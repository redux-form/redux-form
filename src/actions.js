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

type ArrayInsertAction = {
  type: string,
  meta: { form: string, field: string, index: number },
  payload: any
} & Action
type ArrayInsert = {
  (form: string, field: string, index: number, value: any): ArrayInsertAction
}
type ArrayMoveAction = {
  type: string,
  meta: { form: string, field: string, from: number, to: number }
} & Action
type ArrayMove = {
  (form: string, field: string, from: number, to: number): ArrayMoveAction
}
type ArrayPopAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
type ArrayPop = { (form: string, field: string): ArrayPopAction }
type ArrayPushAction = {
  type: string,
  meta: { form: string, field: string },
  payload: any
} & Action
type ArrayPush = { (form: string, field: string, value: any): ArrayPushAction }
type ArrayRemoveAction = {
  type: string,
  meta: { form: string, field: string, index: number }
} & Action
type ArrayRemove = {
  (form: string, field: string, index: number): ArrayRemoveAction
}
type ArrayRemoveAllAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
type ArrayRemoveAll = { (form: string, field: string): ArrayRemoveAllAction }
type ArrayShiftAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
type ArrayShift = { (form: string, field: string): ArrayShiftAction }
type ArraySpliceAction = {
  type: string,
  meta: {
    form: string,
    field: string,
    index: number,
    removeNum: number
  },
  payload?: any
} & Action
type ArraySplice = {
  (
    form: string,
    field: string,
    index: number,
    removeNum: number,
    value: any
  ): ArraySpliceAction
}
type ArraySwapAction = {
  type: string,
  meta: { form: string, field: string, indexA: number, indexB: number }
} & Action
type ArraySwap = {
  (form: string, field: string, indexA: number, indexB: number): ArraySwapAction
}
type ArrayUnshiftAction = {
  type: string,
  meta: { form: string, field: string },
  payload: any
} & Action
type ArrayUnshift = {
  (form: string, field: string, value: any): ArrayUnshiftAction
}
type AutofillAction = {
  type: string,
  meta: { form: string, field: string },
  payload: any
} & Action
type Autofill = { (form: string, field: string, value: any): AutofillAction }
type BlurAction = {
  type: string,
  meta: { form: string, field: string, touch: boolean },
  payload: any
} & Action
type Blur = {
  (form: string, field: string, value: any, touch: boolean): BlurAction
}
type ChangeAction = {
  type: string,
  meta: {
    form: string,
    field: string,
    touch: boolean,
    persistentSubmitErrors: boolean
  },
  payload: any
} & Action
type Change = {
  (
    form: string,
    field: string,
    value: any,
    touch: boolean,
    persistentSubmitErrors: boolean
  ): ChangeAction
}
type ClearSubmitAction = { type: string, meta: { form: string } } & Action
type ClearSubmit = { (form: string): ClearSubmitAction }
type ClearSubmitErrorsAction = { type: string, meta: { form: string } } & Action
type ClearSubmitErrors = { (form: string): ClearSubmitErrorsAction }
type ClearAsyncErrorAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
type ClearAsyncError = { (form: string, field: string): ClearAsyncErrorAction }
type DestroyAction = { type: string, meta: { form: string[] } } & Action
type Destroy = { (...forms: string[]): DestroyAction }
type FocusAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
type Focus = { (form: string, field: string): FocusAction }
type InitializeAction = {
  type: string,
  meta: { form: string, keepDirty: boolean },
  payload: Object
} & Action
type Initialize = {
  (
    form: string,
    values: Object,
    keepDirty: boolean,
    otherMeta: Object
  ): InitializeAction
}
type RegisterFieldAction = {
  type: string,
  meta: { form: string },
  payload: { name: string, type: FieldType }
} & Action
type RegisterField = {
  (form: string, name: string, type: FieldType): RegisterFieldAction
}
type ResetAction = { type: string, meta: { form: string } } & Action
type Reset = { (form: string): ResetAction }
type StartAsyncValidationAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
type StartAsyncValidation = {
  (
    form: string,
    field: string,
    index: number,
    value: any
  ): StartAsyncValidationAction
}
type StartSubmitAction = { type: string, meta: { form: string } } & Action
type StartSubmit = { (form: string): StartSubmitAction }
type StopAsyncValidationAction = {
  type: string,
  meta: { form: string },
  payload: ?Object,
  error: boolean
} & Action
type StopAsyncValidation = {
  (form: string, errors: ?Object): StopAsyncValidationAction
}
type StopSubmitAction = {
  type: string,
  meta: { form: string },
  payload: ?Object,
  error: boolean
} & Action
type StopSubmit = { (form: string, errors: ?Object): StopSubmitAction }
type SubmitAction = { type: string, meta: { form: string } } & Action
type Submit = { (form: string): SubmitAction }
type SetSubmitFailedAction = {
  type: string,
  meta: { form: string, fields: string[] },
  error: true
} & Action
type SetSubmitFailed = {
  (form: string, ...fields: string[]): SetSubmitFailedAction
}
type SetSubmitSucceededAction = {
  type: string,
  meta: { form: string, fields: string[] },
  error: false
} & Action
type SetSubmitSucceeded = {
  (form: string, ...fields: string[]): SetSubmitSucceededAction
}
type TouchAction = {
  type: string,
  meta: { form: string, fields: string[] }
} & Action
type Touch = { (form: string, ...fields: string[]): TouchAction }
type UnregisterFieldAction = {
  type: string,
  meta: { form: string },
  payload: { name: string, destroyOnUnmount: boolean }
} & Action
type UnregisterField = {
  (form: string, name: string, destroyOnUnmount: boolean): UnregisterFieldAction
}
type UntouchAction = {
  type: string,
  meta: { form: string, fields: string[] }
} & Action
type Untouch = { (form: string, ...fields: string[]): UntouchAction }
type UpdateSyncErrorsAction = {
  type: string,
  meta: { form: string },
  payload: { syncErrors: Object, error: any }
} & Action
type UpdateSyncErrors = {
  (form: string, syncErrors: Object, error: any): UpdateSyncErrorsAction
}
type UpdateSyncWarningsAction = {
  type: string,
  meta: { form: string },
  payload: { syncWarnings: Object, warning: any }
} & Action
type UpdateSyncWarnings = {
  (form: string, syncWarnings: Object, warning: any): UpdateSyncWarningsAction
}

export type Actions = {
  arrayInsert: ArrayInsert,
  arrayMove: ArrayMove,
  arrayPop: ArrayPop,
  arrayPush: ArrayPush,
  arrayRemove: ArrayRemove,
  arrayRemoveAll: ArrayRemoveAll,
  arrayShift: ArrayShift,
  arraySpliceAction: ArraySpliceAction,
  arraySplice: ArraySplice,
  arraySwap: ArraySwap,
  arrayUnshift: ArrayUnshift,
  autofill: Autofill,
  blur: Blur,
  change: Change,
  clearSubmit: ClearSubmit,
  clearSubmitErrors: ClearSubmitErrors,
  clearAsyncError: ClearAsyncError,
  destroy: Destroy,
  focus: Focus,
  initialize: Initialize,
  registerField: RegisterField,
  reset: Reset,
  startAsyncValidation: StartAsyncValidation,
  startSubmit: StartSubmit,
  stopAsyncValidation: StopAsyncValidation,
  stopSubmit: StopSubmit,
  submit: Submit,
  setSubmitFailed: SetSubmitFailed,
  setSubmitSucceeded: SetSubmitSucceeded,
  touch: Touch,
  unregisterField: UnregisterField,
  untouch: Untouch,
  updateSyncErrors: UpdateSyncErrors,
  updateSyncWarnings: UpdateSyncWarnings
}

export const arrayInsert: ArrayInsert = (
  form: string,
  field: string,
  index: number,
  value: any
): ArrayInsertAction => ({
  type: ARRAY_INSERT,
  meta: { form, field, index },
  payload: value
})

export const arrayMove: ArrayMove = (
  form: string,
  field: string,
  from: number,
  to: number
): ArrayMoveAction => ({
  type: ARRAY_MOVE,
  meta: { form, field, from, to }
})

export const arrayPop: ArrayPop = (
  form: string,
  field: string
): ArrayPopAction => ({
  type: ARRAY_POP,
  meta: { form, field }
})

export const arrayPush: ArrayPush = (
  form: string,
  field: string,
  value: any
): ArrayPushAction => ({
  type: ARRAY_PUSH,
  meta: { form, field },
  payload: value
})

export const arrayRemove: ArrayRemove = (
  form: string,
  field: string,
  index: number
): ArrayRemoveAction => ({
  type: ARRAY_REMOVE,
  meta: { form, field, index }
})

export const arrayRemoveAll: ArrayRemoveAll = (
  form: string,
  field: string
): ArrayRemoveAllAction => ({
  type: ARRAY_REMOVE_ALL,
  meta: { form, field }
})

export const arrayShift: ArrayShift = (
  form: string,
  field: string
): ArrayShiftAction => ({
  type: ARRAY_SHIFT,
  meta: { form, field }
})

export const arraySplice: ArraySplice = (
  form: string,
  field: string,
  index: number,
  removeNum: number,
  value: any
): ArraySpliceAction => {
  const action: ArraySpliceAction = {
    type: ARRAY_SPLICE,
    meta: { form, field, index, removeNum }
  }
  if (value !== undefined) {
    action.payload = value
  }
  return action
}

export const arraySwap: ArraySwap = (
  form: string,
  field: string,
  indexA: number,
  indexB: number
): ArraySwapAction => {
  if (indexA === indexB) {
    throw new Error('Swap indices cannot be equal')
  }
  if (indexA < 0 || indexB < 0) {
    throw new Error('Swap indices cannot be negative')
  }
  return { type: ARRAY_SWAP, meta: { form, field, indexA, indexB } }
}

export const arrayUnshift: ArrayUnshift = (
  form: string,
  field: string,
  value: any
): ArrayUnshiftAction => ({
  type: ARRAY_UNSHIFT,
  meta: { form, field },
  payload: value
})

export const autofill: Autofill = (
  form: string,
  field: string,
  value: any
): AutofillAction => ({
  type: AUTOFILL,
  meta: { form, field },
  payload: value
})

export const blur: Blur = (
  form: string,
  field: string,
  value: any,
  touch: boolean
): BlurAction => ({
  type: BLUR,
  meta: { form, field, touch },
  payload: value
})

export const change: Change = (
  form: string,
  field: string,
  value: any,
  touch: boolean,
  persistentSubmitErrors: boolean
): ChangeAction => ({
  type: CHANGE,
  meta: { form, field, touch, persistentSubmitErrors },
  payload: value
})

export const clearSubmit: ClearSubmit = (form: string): ClearSubmitAction => ({
  type: CLEAR_SUBMIT,
  meta: { form }
})

export const clearSubmitErrors: ClearSubmitErrors = (
  form: string
): ClearSubmitErrorsAction => ({
  type: CLEAR_SUBMIT_ERRORS,
  meta: { form }
})

export const clearAsyncError: ClearAsyncError = (
  form: string,
  field: string
): ClearAsyncErrorAction => ({
  type: CLEAR_ASYNC_ERROR,
  meta: { form, field }
})

export const destroy: Destroy = (...form: string[]): DestroyAction => ({
  type: DESTROY,
  meta: { form }
})

export const focus: Focus = (form: string, field: string): FocusAction => ({
  type: FOCUS,
  meta: { form, field }
})

export const initialize: Initialize = (
  form: string,
  values: Object,
  keepDirty: boolean,
  otherMeta: Object = {}
): InitializeAction => {
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

export const registerField: RegisterField = (
  form: string,
  name: string,
  type: FieldType
): RegisterFieldAction => ({
  type: REGISTER_FIELD,
  meta: { form },
  payload: { name, type }
})

export const reset: Reset = (form: string): ResetAction => ({
  type: RESET,
  meta: { form }
})

export const startAsyncValidation: StartAsyncValidation = (
  form: string,
  field: string
): StartAsyncValidationAction => ({
  type: START_ASYNC_VALIDATION,
  meta: { form, field }
})

export const startSubmit: StartSubmit = (form: string): StartSubmitAction => ({
  type: START_SUBMIT,
  meta: { form }
})

export const stopAsyncValidation: StopAsyncValidation = (
  form: string,
  errors: ?Object
): StopAsyncValidationAction => ({
  type: STOP_ASYNC_VALIDATION,
  meta: { form },
  payload: errors,
  error: !!(errors && Object.keys(errors).length)
})

export const stopSubmit: StopSubmit = (
  form: string,
  errors: ?Object
): StopSubmitAction => ({
  type: STOP_SUBMIT,
  meta: { form },
  payload: errors,
  error: !!(errors && Object.keys(errors).length)
})

export const submit: Submit = (form: string): SubmitAction => ({
  type: SUBMIT,
  meta: { form }
})

export const setSubmitFailed: SetSubmitFailed = (
  form: string,
  ...fields: string[]
): SetSubmitFailedAction => ({
  type: SET_SUBMIT_FAILED,
  meta: { form, fields },
  error: true
})

export const setSubmitSucceeded: SetSubmitSucceeded = (
  form: string,
  ...fields: string[]
): SetSubmitSucceededAction => ({
  type: SET_SUBMIT_SUCCEEDED,
  meta: { form, fields },
  error: false
})

export const touch: Touch = (
  form: string,
  ...fields: string[]
): TouchAction => ({
  type: TOUCH,
  meta: { form, fields }
})

export const unregisterField: UnregisterField = (
  form: string,
  name: string,
  destroyOnUnmount: boolean = true
): UnregisterFieldAction => ({
  type: UNREGISTER_FIELD,
  meta: { form },
  payload: { name, destroyOnUnmount }
})

export const untouch: Untouch = (
  form: string,
  ...fields: string[]
): UntouchAction => ({
  type: UNTOUCH,
  meta: { form, fields }
})

export const updateSyncErrors: UpdateSyncErrors = (
  form: string,
  syncErrors: Object = {},
  error: any
): UpdateSyncErrorsAction => ({
  type: UPDATE_SYNC_ERRORS,
  meta: { form },
  payload: { syncErrors, error }
})

export const updateSyncWarnings: UpdateSyncWarnings = (
  form: string,
  syncWarnings: Object = {},
  warning: any
): UpdateSyncWarningsAction => ({
  type: UPDATE_SYNC_WARNINGS,
  meta: { form },
  payload: { syncWarnings, warning }
})
