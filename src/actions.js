// @flow
import {
  ARRAY_INSERT,
  ARRAY_MOVE,
  ARRAY_POP,
  ARRAY_PUSH,
  ARRAY_REMOVE,
  ARRAY_REMOVE_ALL,
  ARRAY_SHIFT,
  ARRAY_SPLICE,
  ARRAY_SWAP,
  ARRAY_UNSHIFT,
  AUTOFILL,
  BLUR,
  CHANGE,
  CLEAR_SUBMIT,
  CLEAR_SUBMIT_ERRORS,
  CLEAR_ASYNC_ERROR,
  DESTROY,
  FOCUS,
  INITIALIZE,
  REGISTER_FIELD,
  RESET,
  SET_SUBMIT_FAILED,
  SET_SUBMIT_SUCCEEDED,
  START_ASYNC_VALIDATION,
  START_SUBMIT,
  STOP_ASYNC_VALIDATION,
  STOP_SUBMIT,
  SUBMIT,
  TOUCH,
  UNREGISTER_FIELD,
  UNTOUCH,
  UPDATE_SYNC_ERRORS,
  UPDATE_SYNC_WARNINGS
} from './actionTypes'
import type { Action, FieldType } from './types'

export const arrayInsert = (
  form: string,
  field: string,
  index: number,
  value: any
): Action => ({
  type: ARRAY_INSERT,
  meta: { form, field, index },
  payload: value
})

export const arrayMove = (
  form: string,
  field: string,
  from: number,
  to: number
): Action => ({
  type: ARRAY_MOVE,
  meta: { form, field, from, to }
})

export const arrayPop = (form: string, field: string): Action => ({
  type: ARRAY_POP,
  meta: { form, field }
})

export const arrayPush = (form: string, field: string, value: any): Action => ({
  type: ARRAY_PUSH,
  meta: { form, field },
  payload: value
})

export const arrayRemove = (
  form: string,
  field: string,
  index: number
): Action => ({
  type: ARRAY_REMOVE,
  meta: { form, field, index }
})

export const arrayRemoveAll = (form: string, field: string): Action => ({
  type: ARRAY_REMOVE_ALL,
  meta: { form, field }
})

export const arrayShift = (form: string, field: string): Action => ({
  type: ARRAY_SHIFT,
  meta: { form, field }
})

type ArraySplice = {
  type: string,
  meta: {
    form: string,
    field: string,
    index: number,
    removeNum: number
  },
  payload?: any
} & Action

export const arraySplice = (
  form: string,
  field: string,
  index: number,
  removeNum: number,
  value: any
): ArraySplice => {
  const action: ArraySplice = {
    type: ARRAY_SPLICE,
    meta: { form, field, index, removeNum }
  }
  if (value !== undefined) {
    action.payload = value
  }
  return action
}

export const arraySwap = (
  form: string,
  field: string,
  indexA: number,
  indexB: number
): Action => {
  if (indexA === indexB) {
    throw new Error('Swap indices cannot be equal')
  }
  if (indexA < 0 || indexB < 0) {
    throw new Error('Swap indices cannot be negative')
  }
  return { type: ARRAY_SWAP, meta: { form, field, indexA, indexB } }
}

export const arrayUnshift = (
  form: string,
  field: string,
  value: any
): Action => ({
  type: ARRAY_UNSHIFT,
  meta: { form, field },
  payload: value
})

export const autofill = (form: string, field: string, value: any): Action => ({
  type: AUTOFILL,
  meta: { form, field },
  payload: value
})

export const blur = (
  form: string,
  field: string,
  value: any,
  touch: boolean
): Action => ({
  type: BLUR,
  meta: { form, field, touch },
  payload: value
})

export const change = (
  form: string,
  field: string,
  value: any,
  touch: boolean,
  persistentSubmitErrors: boolean
): Action => ({
  type: CHANGE,
  meta: { form, field, touch, persistentSubmitErrors },
  payload: value
})

export const clearSubmit = (form: string): Action => ({
  type: CLEAR_SUBMIT,
  meta: { form }
})

export const clearSubmitErrors = (form: string): Action => ({
  type: CLEAR_SUBMIT_ERRORS,
  meta: { form }
})

export const clearAsyncError = (form: string, field: string): Action => ({
  type: CLEAR_ASYNC_ERROR,
  meta: { form, field }
})

export const destroy = (...form: string[]): Action => ({
  type: DESTROY,
  meta: { form }
})

export const focus = (form: string, field: string): Action => ({
  type: FOCUS,
  meta: { form, field }
})

export const initialize = (
  form: string,
  values: Object,
  keepDirty: boolean,
  otherMeta: Object = {}
): Action => {
  if (keepDirty instanceof Object) {
    otherMeta = keepDirty
    keepDirty = false
  }
  return {
    type: INITIALIZE,
    meta: { form, keepDirty, ...otherMeta },
    payload: values
  }
}

export const registerField = (
  form: string,
  name: string,
  type: FieldType
): Action => ({
  type: REGISTER_FIELD,
  meta: { form },
  payload: { name, type }
})

export const reset = (form: string): Action => ({ type: RESET, meta: { form } })

export const startAsyncValidation = (form: string, field: string): Action => ({
  type: START_ASYNC_VALIDATION,
  meta: { form, field }
})

export const startSubmit = (form: string): Action => ({
  type: START_SUBMIT,
  meta: { form }
})

type StopAsyncValidation = {
  type: string,
  meta: {
    form: string
  },
  payload: Object,
  error: boolean
} & Action

export const stopAsyncValidation = (
  form: string,
  errors: Object
): StopAsyncValidation => ({
  type: STOP_ASYNC_VALIDATION,
  meta: { form },
  payload: errors,
  error: !!(errors && Object.keys(errors).length)
})

type StopSubmit = {
  type: string,
  meta: {
    form: string
  },
  payload: Object,
  error: boolean
} & Action

export const stopSubmit = (form: string, errors: Object): StopSubmit => ({
  type: STOP_SUBMIT,
  meta: { form },
  payload: errors,
  error: !!(errors && Object.keys(errors).length)
})

export const submit = (form: string): Action => ({
  type: SUBMIT,
  meta: { form }
})

export const setSubmitFailed = (form: string, ...fields: string[]): Action => ({
  type: SET_SUBMIT_FAILED,
  meta: { form, fields },
  error: true
})

export const setSubmitSucceeded = (
  form: string,
  ...fields: string[]
): Action => ({
  type: SET_SUBMIT_SUCCEEDED,
  meta: { form, fields },
  error: false
})

export const touch = (form: string, ...fields: string[]): Action => ({
  type: TOUCH,
  meta: { form, fields }
})

export const unregisterField = (
  form: string,
  name: string,
  destroyOnUnmount: boolean = true
): Action => ({
  type: UNREGISTER_FIELD,
  meta: { form },
  payload: { name, destroyOnUnmount }
})

export const untouch = (form: string, ...fields: string[]): Action => ({
  type: UNTOUCH,
  meta: { form, fields }
})

export const updateSyncErrors = (
  form: string,
  syncErrors: Object = {},
  error: any
): Action => ({
  type: UPDATE_SYNC_ERRORS,
  meta: { form },
  payload: { syncErrors, error }
})

export const updateSyncWarnings = (
  form: string,
  syncWarnings: Object = {},
  warning: any
): Action => ({
  type: UPDATE_SYNC_WARNINGS,
  meta: { form },
  payload: { syncWarnings, warning }
})
