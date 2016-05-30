import {
  ARRAY_INSERT, ARRAY_POP, ARRAY_PUSH, ARRAY_REMOVE, ARRAY_SHIFT, ARRAY_SPLICE, ARRAY_SWAP,
  ARRAY_UNSHIFT, BLUR, CHANGE, DESTROY, FOCUS,
  INITIALIZE, REGISTER_FIELD, RESET, SET_SUBMIT_FAILED, START_ASYNC_VALIDATION,
  START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, TOUCH, UNREGISTER_FIELD, UNTOUCH
} from './actionTypes'
import createDeleteInWithCleanUp from './deleteInWithCleanUp'

const createReducer = structure => {
  const { splice, empty, getIn, setIn, deleteIn, fromJS, size, some } = structure
  const deleteInWithCleanUp = createDeleteInWithCleanUp(structure)
  const doSplice = (state, key, field, index, removeNum, value, force) => {
    const existing = getIn(state, `${key}.${field}`)
    return existing || force ?
      setIn(state, `${key}.${field}`, splice(existing, index, removeNum, value)) :
      state
  }
  const rootKeys = [ 'values', 'fields', 'submitErrors', 'asyncErrors' ]
  const arraySplice = (state, field, index, removeNum, value) => {
    let result = state
    result = doSplice(result, 'values', field, index, removeNum, value, true)
    result = doSplice(result, 'fields', field, index, removeNum, empty)
    result = doSplice(result, 'submitErrors', field, index, removeNum, empty)
    result = doSplice(result, 'asyncErrors', field, index, removeNum, empty)
    return result
  }

  const behaviors = {
    [ARRAY_INSERT](state, { meta: { field, index }, payload }) {
      return arraySplice(state, field, index, 0, payload)
    },
    [ARRAY_POP](state, { meta: { field } }) {
      const array = getIn(state, `values.${field}`)
      const length = array ? size(array) : 0
      return length ? arraySplice(state, field, length - 1, 1) : state
    },
    [ARRAY_PUSH](state, { meta: { field }, payload }) {
      const array = getIn(state, `values.${field}`)
      const length = array ? size(array) : 0
      return arraySplice(state, field, length, 0, payload)
    },
    [ARRAY_REMOVE](state, { meta: { field, index } }) {
      return arraySplice(state, field, index, 1)
    },
    [ARRAY_SHIFT](state, { meta: { field } }) {
      return arraySplice(state, field, 0, 1)
    },
    [ARRAY_SPLICE](state, { meta: { field, index, removeNum }, payload }) {
      return arraySplice(state, field, index, removeNum, payload)
    },
    [ARRAY_SWAP](state, { meta: { field, indexA, indexB } }) {
      let result = state
      rootKeys.forEach(key => {
        const valueA = getIn(result, `${key}.${field}[${indexA}]`)
        const valueB = getIn(result, `${key}.${field}[${indexB}]`)
        if (valueA !== undefined || valueB !== undefined) {
          result = setIn(result, `${key}.${field}[${indexA}]`, valueB)
          result = setIn(result, `${key}.${field}[${indexB}]`, valueA)
        }
      })
      return result
    },
    [ARRAY_UNSHIFT](state, { meta: { field }, payload }) {
      return arraySplice(state, field, 0, 0, payload)
    },
    [BLUR](state, { meta: { field, touch }, payload }) {
      let result = state
      const initial = getIn(result, `initial.${field}`)
      if (initial === undefined && payload === '') {
        result = deleteInWithCleanUp(result, `values.${field}`)
      } else if (payload !== undefined) {
        result = setIn(result, `values.${field}`, payload)
      }
      if (field === getIn(result, 'active')) {
        result = deleteIn(result, 'active')
      }
      result = deleteIn(result, `fields.${field}.active`)
      if (touch) {
        result = setIn(result, `fields.${field}.touched`, true)
        result = setIn(result, 'anyTouched', true)
      }
      return result
    },
    [CHANGE](state, { meta: { field, touch }, payload }) {
      let result = state
      const initial = getIn(result, `initial.${field}`)
      if (initial === undefined && payload === '') {
        result = deleteInWithCleanUp(result, `values.${field}`)
      } else if (payload !== undefined) {
        result = setIn(result, `values.${field}`, payload)
      }
      result = deleteInWithCleanUp(result, `asyncErrors.${field}`)
      result = deleteInWithCleanUp(result, `submitErrors.${field}`)
      if (touch) {
        result = setIn(result, `fields.${field}.touched`, true)
        result = setIn(result, 'anyTouched', true)
      }
      return result
    },
    [FOCUS](state, { meta: { field } }) {
      let result = state
      const previouslyActive = getIn(state, 'active')
      result = deleteIn(result, `fields.${previouslyActive}.active`)
      result = setIn(result, `fields.${field}.visited`, true)
      result = setIn(result, `fields.${field}.active`, true)
      result = setIn(result, 'active', field)
      return result
    },
    [INITIALIZE](state, { payload }) {
      const mapData = fromJS(payload)
      let result = empty // clean all field state
      const registeredFields = getIn(state, 'registeredFields')
      if (registeredFields) {
        result = setIn(result, 'registeredFields', registeredFields)
      }
      result = setIn(result, 'values', mapData)
      result = setIn(result, 'initial', mapData)
      return result
    },
    [REGISTER_FIELD](state, { payload: { name, type } }) {
      let result = state
      const registeredFields = getIn(result, 'registeredFields')
      if (some(registeredFields, (field) => getIn(field, 'name') === name)) {
        return state
      }

      const mapData = fromJS({ name, type })
      result = setIn(state, 'registeredFields', splice(registeredFields, size(registeredFields), 0, mapData))
      return result
    },
    [RESET](state) {
      let result = empty
      const registeredFields = getIn(state, 'registeredFields')
      if (registeredFields) {
        result = setIn(result, 'registeredFields', registeredFields)
      }
      const values = getIn(state, 'initial')
      if (values) {
        result = setIn(result, 'values', values)
        result = setIn(result, 'initial', values)
      }
      return result
    },
    [START_ASYNC_VALIDATION](state, { meta: { field } }) {
      return setIn(state, 'asyncValidating', field || true)
    },
    [START_SUBMIT](state) {
      return setIn(state, 'submitting', true)
    },
    [STOP_ASYNC_VALIDATION](state, { payload }) {
      let result = state
      result = deleteIn(result, 'asyncValidating')
      if (payload && Object.keys(payload).length) {
        const { _error, ...fieldErrors } = payload
        if (_error) {
          result = setIn(result, 'error', _error)
        }
        if (Object.keys(fieldErrors).length) {
          result = setIn(result, 'asyncErrors', fromJS(fieldErrors))
        } else {
          result = deleteIn(result, 'asyncErrors')
        }
      } else {
        result = deleteIn(result, 'error')
        result = deleteIn(result, 'asyncErrors')
      }
      return result
    },
    [STOP_SUBMIT](state, { payload }) {
      let result = state
      result = deleteIn(result, 'submitting')
      result = deleteIn(result, 'submitFailed')
      if (payload && Object.keys(payload).length) {
        const { _error, ...fieldErrors } = payload
        if (_error) {
          result = setIn(result, 'error', _error)
        }
        if (Object.keys(fieldErrors).length) {
          result = setIn(result, 'submitErrors', fromJS(fieldErrors))
        } else {
          result = deleteIn(result, 'submitErrors')
        }
        result = setIn(result, 'submitFailed', true)
      } else {
        result = deleteIn(result, 'error')
        result = deleteIn(result, 'submitErrors')
      }
      return result
    },
    [SET_SUBMIT_FAILED](state, { meta: { fields } }) {
      let result = state
      result = setIn(result, 'submitFailed', true)
      result = deleteIn(result, 'submitting')
      fields.forEach(field => result = setIn(result, `fields.${field}.touched`, true))
      if (fields.length) {
        result = setIn(result, 'anyTouched', true)
      }
      return result
    },
    [TOUCH](state, { meta: { fields } }) {
      let result = state
      fields.forEach(field => result = setIn(result, `fields.${field}.touched`, true))
      result = setIn(result, 'anyTouched', true)
      return result
    },
    [UNREGISTER_FIELD](state, { payload: { name } }) {
      const registeredFields = getIn(state, 'registeredFields')

      // in case the form was destroyed and registeredFields no longer exists
      if (!registeredFields) {
        return state
      }

      const fieldIndex = registeredFields.findIndex((value) => {
        return getIn(value, 'name') === name
      })
      if (size(registeredFields) <= 1 && fieldIndex >= 0) {
        return deleteInWithCleanUp(state, 'registeredFields')
      }
      return setIn(state, 'registeredFields', splice(registeredFields, fieldIndex, 1))
    },
    [UNTOUCH](state, { meta: { fields } }) {
      let result = state
      fields.forEach(field => result = deleteIn(result, `fields.${field}.touched`))
      return result
    }
  }

  const reducer = (state = empty, action) => {
    const behavior = behaviors[ action.type ]
    return behavior ? behavior(state, action) : state
  }

  const byForm = (reducer) =>
    (state = empty, action = {}) => {
      const form = action && action.meta && action.meta.form
      if (!form) {
        return state
      }
      if (action.type === DESTROY) {
        return deleteInWithCleanUp(state, action.meta.form)
      }
      const formState = getIn(state, form)
      const result = reducer(formState, action)
      return result === formState ? state : setIn(state, form, result)
    }

  /**
   * Adds additional functionality to the reducer
   */
  function decorate(target) {

    // put back plugin and normalize?
    return target
  }

  return decorate(byForm(reducer))
}

export default createReducer
