import { ADD_ARRAY_VALUE, BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, REMOVE_ARRAY_VALUE, RESET,
  SET_SUBMIT_FAILED, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT,
  SWAP_ARRAY_VALUES, TOUCH, UNTOUCH } from './actionTypes'
import createDeleteInWithCleanUp from './deleteInWithCleanUp'

const createReducer = structure => {
  const { empty, getIn, setIn, deleteIn, fromJS } = structure
  const deleteInWithCleanUp = createDeleteInWithCleanUp(structure)

  const behaviors = {
    [ADD_ARRAY_VALUE](state) {
      return state
    },
    [BLUR](state, { field, value, touch }) {
      let result = state
      if (value !== undefined) {
        result = setIn(result, `values.${field}`, value)
      }
      if (value === '') {
        result = deleteInWithCleanUp(result, `values.${field}`)
      }
      result = deleteIn(result, 'active')
      result = deleteIn(result, `fields.${field}.active`)
      if (touch) {
        result = setIn(result, `fields.${field}.touched`, true)
        result = setIn(result, 'anyTouched', true)
      }
      return result
    },
    [CHANGE](state, { field, value, touch }) {
      let result = state
      if (value !== undefined) {
        result = setIn(result, `values.${field}`, value)
      }
      if (value === '') {
        result = deleteInWithCleanUp(result, `values.${field}`)
      }
      result = deleteInWithCleanUp(result, `asyncErrors.${field}`)
      result = deleteInWithCleanUp(result, `submitErrors.${field}`)
      if (touch) {
        result = setIn(result, `fields.${field}.touched`, true)
        result = setIn(result, 'anyTouched', true)
      }
      return result
    },
    [FOCUS](state, { field }) {
      let result = state
      const previouslyActive = getIn(state, 'active')
      result = deleteIn(result, `fields.${previouslyActive}.active`)
      result = setIn(result, `fields.${field}.visited`, true)
      result = setIn(result, `fields.${field}.active`, true)
      result = setIn(result, 'active', field)
      return result
    },
    [INITIALIZE](state, { data }) {
      const mapData = fromJS(data)
      let result = empty // clean all field state
      result = setIn(result, 'values', mapData)
      result = setIn(result, 'initial', mapData)
      return result
    },
    [REMOVE_ARRAY_VALUE](state) {
      return state
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
    [START_ASYNC_VALIDATION](state, { field }) {
      return setIn(state, 'asyncValidating', field || true)
    },
    [START_SUBMIT](state) {
      return setIn(state, 'submitting', true)
    },
    [STOP_ASYNC_VALIDATION](state, { errors }) {
      let result = state
      result = deleteIn(result, 'asyncValidating')
      if (errors && Object.keys(errors).length) {
        const { _error, ...fieldErrors } = errors
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
    [STOP_SUBMIT](state, { errors }) {
      let result = state
      result = deleteIn(result, 'submitting')
      result = deleteIn(result, 'submitFailed')
      if (errors && Object.keys(errors).length) {
        const { _error, ...fieldErrors } = errors
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
    [SET_SUBMIT_FAILED](state, { fields }) {
      let result = state
      result = setIn(result, 'submitFailed', true)
      result = deleteIn(result, 'submitting')
      fields.forEach(field => result = setIn(result, `fields.${field}.touched`, true))
      if (fields.length) {
        result = setIn(result, 'anyTouched', true)
      }
      return result
    },
    [SWAP_ARRAY_VALUES](state) {
      return state
    },
    [TOUCH](state, { fields }) {
      let result = state
      fields.forEach(field => result = setIn(result, `fields.${field}.touched`, true))
      result = setIn(result, 'anyTouched', true)
      return result
    },
    [UNTOUCH](state, { fields }) {
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
      const { form, ...rest } = action // eslint-disable-line no-redeclare
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
      const result = reducer(formState, rest)
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
