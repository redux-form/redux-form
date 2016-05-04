import {
  ARRAY_SPLICE, ARRAY_SWAP,
  BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, RESET, SET_SUBMIT_FAILED, START_ASYNC_VALIDATION,
  START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, TOUCH, UNTOUCH
} from './actionTypes'

export const arraySplice = (form, field, index, removeNum, value) => {
  const action = {
    type: ARRAY_SPLICE,
    meta: { form, field, index, removeNum }
  }
  if (value !== undefined) {
    action.payload = value
  }
  return action
}

export const arraySwap = (form, field, indexA, indexB) => {
  if(indexA === indexB) {
    throw new Error('Swap indices cannot be equal')
  }
  if(indexA < 0 || indexB < 0) {
    throw new Error('Swap indices cannot be negative')
  }
  return { type: ARRAY_SWAP, meta: { form, field, indexA, indexB } }
}

export const blur = (form, field, value, touch) =>
  ({ type: BLUR, meta: { form, field, touch }, payload: value })

export const change = (form, field, value, touch) =>
  ({ type: CHANGE, meta: { form, field, touch }, payload: value })

export const destroy = (form) =>
  ({ type: DESTROY, meta: { form } })

export const focus = (form, field) =>
  ({ type: FOCUS, meta: { form, field } })

export const initialize = (form, values) =>
  ({ type: INITIALIZE, meta: { form }, payload: values })

export const reset = form =>
  ({ type: RESET, meta: { form } })

export const startAsyncValidation = (form, field) =>
  ({ type: START_ASYNC_VALIDATION, meta: { form, field } })

export const startSubmit = form =>
  ({ type: START_SUBMIT, meta: { form } })

export const stopAsyncValidation = (form, errors) => {
  const action = {
    type: STOP_ASYNC_VALIDATION,
    meta: { form },
    payload: errors
  }
  if (errors && Object.keys(errors).length) {
    action.error = true
  }
  return action
}

export const stopSubmit = (form, errors) => {
  const action = {
    type: STOP_SUBMIT,
    meta: { form },
    payload: errors
  }
  if (errors && Object.keys(errors).length) {
    action.error = true
  }
  return action
}

export const setSubmitFailed = (form, ...fields) =>
  ({ type: SET_SUBMIT_FAILED, meta: { form, fields }, error: true })

export const touch = (form, ...fields) =>
  ({ type: TOUCH, meta: { form, fields } })

export const untouch = (form, ...fields) =>
  ({ type: UNTOUCH, meta: { form, fields } })
