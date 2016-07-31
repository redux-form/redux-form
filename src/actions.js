import {
  ARRAY_INSERT, ARRAY_MOVE, ARRAY_POP, ARRAY_PUSH, ARRAY_REMOVE, ARRAY_REMOVE_ALL, ARRAY_SHIFT,
  ARRAY_SPLICE, ARRAY_SWAP, ARRAY_UNSHIFT, BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE,
  REGISTER_FIELD, RESET, SET_SUBMIT_FAILED, SET_SUBMIT_SUCCEEDED, START_ASYNC_VALIDATION, START_SUBMIT,
  STOP_ASYNC_VALIDATION, STOP_SUBMIT, TOUCH, UNREGISTER_FIELD, UNTOUCH, UPDATE_SYNC_ERRORS
} from './actionTypes'

export const arrayInsert = (form, field, index, value) =>
  ({ type: ARRAY_INSERT, meta: { form, field, index }, payload: value })

export const arrayMove = (form, field, from, to) =>
  ({ type: ARRAY_MOVE, meta: { form, field, from, to } })

export const arrayPop = (form, field) =>
  ({ type: ARRAY_POP, meta: { form, field } })

export const arrayPush = (form, field, value) =>
  ({ type: ARRAY_PUSH, meta: { form, field }, payload: value })

export const arrayRemove = (form, field, index) =>
  ({ type: ARRAY_REMOVE, meta: { form, field, index } })

export const arrayRemoveAll = (form, field) =>
  ({ type: ARRAY_REMOVE_ALL, meta: { form, field } })

export const arrayShift = (form, field) =>
  ({ type: ARRAY_SHIFT, meta: { form, field } })

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
  if (indexA === indexB) {
    throw new Error('Swap indices cannot be equal')
  }
  if (indexA < 0 || indexB < 0) {
    throw new Error('Swap indices cannot be negative')
  }
  return { type: ARRAY_SWAP, meta: { form, field, indexA, indexB } }
}

export const arrayUnshift = (form, field, value) =>
  ({ type: ARRAY_UNSHIFT, meta: { form, field }, payload: value })

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

export const registerField = (form, name, type) =>
  ({ type: REGISTER_FIELD, meta: { form }, payload: { name, type } })

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

export const setSubmitSucceeded = (form, ...fields) =>
  ({ type: SET_SUBMIT_SUCCEEDED, meta: { form, fields }, error: false })

export const touch = (form, ...fields) =>
  ({ type: TOUCH, meta: { form, fields } })

export const unregisterField = (form, name) =>
  ({ type: UNREGISTER_FIELD, meta: { form }, payload: { name } })

export const untouch = (form, ...fields) =>
  ({ type: UNTOUCH, meta: { form, fields } })

export const updateSyncErrors = (form, syncErrors = {}) =>
  ({ type: UPDATE_SYNC_ERRORS, meta: { form }, payload: syncErrors })
