import {
  ARRAY_SPLICE, ARRAY_SWAP, BLUR, CHANGE, DESTROY, FOCUS,
  INITIALIZE, RESET, SET_SUBMIT_FAILED, START_ASYNC_VALIDATION, START_SUBMIT,
  STOP_ASYNC_VALIDATION, STOP_SUBMIT, TOUCH, UNTOUCH
} from './actionTypes'
import createDeleteInWithCleanUp from './deleteInWithCleanUp'

const createReducer = structure => {
  const { splice, empty, getIn, setIn, deleteIn, fromJS } = structure
  const deleteInWithCleanUp = createDeleteInWithCleanUp(structure)
  const doSplice = (state, key, field, index, removeNum, value, force) => {
    const existing = getIn(state, `${key}.${field}`)
    return existing || force ?
      setIn(state, `${key}.${field}`, splice(existing, index, removeNum, value)) :
      state
  }
  const rootKeys = [ 'values', 'fields', 'submitErrors', 'asyncErrors' ]

  const behaviors = {
    [ARRAY_SPLICE](state, { meta: { field, index, removeNum }, payload }) {
      let result = state
      result = doSplice(result, 'values', field, index, removeNum, payload, true)
      result = doSplice(result, 'fields', field, index, removeNum, empty)
      result = doSplice(result, 'submitErrors', field, index, removeNum, empty)
      result = doSplice(result, 'asyncErrors', field, index, removeNum, empty)
      return result
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
    [BLUR](state, { meta: { field, touch }, payload }) {
      let result = state
      if (payload === '') {
        result = deleteInWithCleanUp(result, `values.${field}`)
      } else if (payload !== undefined) {
        result = setIn(result, `values.${field}`, payload)
      }
      result = deleteIn(result, 'active')
      result = deleteIn(result, `fields.${field}.active`)
      if (touch) {
        result = setIn(result, `fields.${field}.touched`, true)
        result = setIn(result, 'anyTouched', true)
      }
      return result
    },
    [CHANGE](state, { meta: { field, touch }, payload }) {
      let result = state
      if (payload === '') {
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
      result = setIn(result, 'values', mapData)
      result = setIn(result, 'initial', mapData)
      return result
    },
    [RESET](state) {
      const values = getIn(state, 'initial')
      let result = empty
      if (values) {
        result = setIn(result, 'values', values)
        result = setIn(result, 'initial', values)
      } else {
        result = deleteInWithCleanUp(result, 'values')
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
        return Object.keys(state).reduce((accumulator, formName) =>
          formName === form ? accumulator : {
            ...accumulator,
            [formName]: state[ formName ]
          }, {})
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
