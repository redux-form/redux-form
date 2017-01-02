import {
  ARRAY_INSERT, ARRAY_MOVE, ARRAY_POP, ARRAY_PUSH, ARRAY_REMOVE, ARRAY_REMOVE_ALL, ARRAY_SHIFT,
  ARRAY_SPLICE, ARRAY_SWAP, ARRAY_UNSHIFT, AUTOFILL, BLUR, CHANGE, CLEAR_SUBMIT, CLEAR_ASYNC_ERROR,
  DESTROY, FOCUS, INITIALIZE,
  REGISTER_FIELD, RESET, SET_SUBMIT_FAILED, SET_SUBMIT_SUCCEEDED, START_ASYNC_VALIDATION, START_SUBMIT,
  STOP_ASYNC_VALIDATION, STOP_SUBMIT, SUBMIT, TOUCH, UNREGISTER_FIELD, UNTOUCH, UPDATE_SYNC_ERRORS,
  UPDATE_SYNC_WARNINGS
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

export const autofill = (field, value) =>
  ({ type: AUTOFILL, meta: { field }, payload: value })

export const blur = (form, field, value, touch) =>
  ({ type: BLUR, meta: { form, field, touch }, payload: value })

export const change = (form, field, value, touch, persistentSubmitErrors) =>
  ({ type: CHANGE, meta: { form, field, touch, persistentSubmitErrors }, payload: value })

export const clearSubmit = (form) =>
  ({ type: CLEAR_SUBMIT, meta: { form } })

export const clearAsyncError = (field) =>
  ({ type: CLEAR_ASYNC_ERROR, meta: { field } })

export const destroy = () =>
  ({ type: DESTROY })

export const focus = (field) =>
  ({ type: FOCUS, meta: { field } })

export const initialize = (values, keepDirty) =>
  ({ type: INITIALIZE, meta: { keepDirty }, payload: values })

export const registerField = (name, type) =>
  ({ type: REGISTER_FIELD, payload: { name, type } })

export const reset = () =>
  ({ type: RESET })

export const startAsyncValidation = (field) =>
  ({ type: START_ASYNC_VALIDATION, meta: { field } })

export const startSubmit = () =>
  ({ type: START_SUBMIT })

export const stopAsyncValidation = (errors) => {
  const action = {
    type: STOP_ASYNC_VALIDATION,
    payload: errors
  }
  if (errors && Object.keys(errors).length) {
    action.error = true
  }
  return action
}

export const stopSubmit = (errors) => {
  const action = {
    type: STOP_SUBMIT,
    payload: errors
  }
  if (errors && Object.keys(errors).length) {
    action.error = true
  }
  return action
}

export const submit = () =>
  ({ type: SUBMIT })

export const setSubmitFailed = (...fields) =>
  ({ type: SET_SUBMIT_FAILED, meta: { fields }, error: true })

export const setSubmitSucceeded = (...fields) =>
  ({ type: SET_SUBMIT_SUCCEEDED, meta: { fields }, error: false })

export const touch = (...fields) =>
  ({ type: TOUCH, meta: { fields } })

export const unregisterField = (name) =>
  ({ type: UNREGISTER_FIELD, payload: { name } })

export const untouch = (...fields) =>
  ({ type: UNTOUCH, meta: { fields } })

export const updateSyncErrors = (syncErrors = {}, error) =>
  ({ type: UPDATE_SYNC_ERRORS, payload: { syncErrors, error } })

export const updateSyncWarnings = (syncWarnings = {}, warning) =>
  ({ type: UPDATE_SYNC_WARNINGS, payload: { syncWarnings, warning } })
