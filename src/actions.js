// @flow
import type { FieldType } from './types.js.flow'
import type {
  ArrayInsertAction,
  ArrayInsert,
  ArrayMoveAction,
  ArrayMove,
  ArrayPopAction,
  ArrayPop,
  ArrayPushAction,
  ArrayPush,
  ArrayRemoveAction,
  ArrayRemove,
  ArrayRemoveAllAction,
  ArrayRemoveAll,
  ArrayShiftAction,
  ArrayShift,
  ArraySpliceAction,
  ArraySplice,
  ArraySwapAction,
  ArraySwap,
  ArrayUnshiftAction,
  ArrayUnshift,
  AutofillAction,
  Autofill,
  BlurAction,
  Blur,
  ChangeAction,
  Change,
  ClearSubmitAction,
  ClearSubmit,
  ClearSubmitErrorsAction,
  ClearSubmitErrors,
  ClearAsyncErrorAction,
  ClearAsyncError,
  DestroyAction,
  Destroy,
  FocusAction,
  Focus,
  InitializeAction,
  Initialize,
  RegisterFieldAction,
  RegisterField,
  ResetAction,
  Reset,
  StartAsyncValidationAction,
  StartAsyncValidation,
  StartSubmitAction,
  StartSubmit,
  StopAsyncValidationAction,
  StopAsyncValidation,
  StopSubmitAction,
  StopSubmit,
  SubmitAction,
  Submit,
  SetSubmitFailedAction,
  SetSubmitFailed,
  SetSubmitSucceededAction,
  SetSubmitSucceeded,
  TouchAction,
  Touch,
  UnregisterFieldAction,
  UnregisterField,
  UntouchAction,
  Untouch,
  UpdateSyncErrorsAction,
  UpdateSyncErrors,
  UpdateSyncWarningsAction,
  UpdateSyncWarnings
} from './actions.types'

const arrayInsert: ArrayInsert = (
  form: string,
  field: string,
  index: number,
  value: any
): ArrayInsertAction => ({
  type: '@@redux-form/ARRAY_INSERT',
  meta: { form, field, index },
  payload: value
})

const arrayMove: ArrayMove = (
  form: string,
  field: string,
  from: number,
  to: number
): ArrayMoveAction => ({
  type: '@@redux-form/ARRAY_MOVE',
  meta: { form, field, from, to }
})

const arrayPop: ArrayPop = (form: string, field: string): ArrayPopAction => ({
  type: '@@redux-form/ARRAY_POP',
  meta: { form, field }
})

const arrayPush: ArrayPush = (
  form: string,
  field: string,
  value: any
): ArrayPushAction => ({
  type: '@@redux-form/ARRAY_PUSH',
  meta: { form, field },
  payload: value
})

const arrayRemove: ArrayRemove = (
  form: string,
  field: string,
  index: number
): ArrayRemoveAction => ({
  type: '@@redux-form/ARRAY_REMOVE',
  meta: { form, field, index }
})

const arrayRemoveAll: ArrayRemoveAll = (
  form: string,
  field: string
): ArrayRemoveAllAction => ({
  type: '@@redux-form/ARRAY_REMOVE_ALL',
  meta: { form, field }
})

const arrayShift: ArrayShift = (
  form: string,
  field: string
): ArrayShiftAction => ({
  type: '@@redux-form/ARRAY_SHIFT',
  meta: { form, field }
})

const arraySplice: ArraySplice = (
  form: string,
  field: string,
  index: number,
  removeNum: number,
  value: any
): ArraySpliceAction => {
  const action: ArraySpliceAction = {
    type: '@@redux-form/ARRAY_SPLICE',
    meta: { form, field, index, removeNum }
  }
  if (value !== undefined) {
    action.payload = value
  }
  return action
}

const arraySwap: ArraySwap = (
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
  return {
    type: '@@redux-form/ARRAY_SWAP',
    meta: { form, field, indexA, indexB }
  }
}

const arrayUnshift: ArrayUnshift = (
  form: string,
  field: string,
  value: any
): ArrayUnshiftAction => ({
  type: '@@redux-form/ARRAY_UNSHIFT',
  meta: { form, field },
  payload: value
})

const autofill: Autofill = (
  form: string,
  field: string,
  value: any
): AutofillAction => ({
  type: '@@redux-form/AUTOFILL',
  meta: { form, field },
  payload: value
})

const blur: Blur = (
  form: string,
  field: string,
  value: any,
  touch: boolean
): BlurAction => ({
  type: '@@redux-form/BLUR',
  meta: { form, field, touch },
  payload: value
})

const change: Change = (
  form: string,
  field: string,
  value: any,
  touch: boolean,
  persistentSubmitErrors: boolean
): ChangeAction => ({
  type: '@@redux-form/CHANGE',
  meta: { form, field, touch, persistentSubmitErrors },
  payload: value
})

const clearSubmit: ClearSubmit = (form: string): ClearSubmitAction => ({
  type: '@@redux-form/CLEAR_SUBMIT',
  meta: { form }
})

const clearSubmitErrors: ClearSubmitErrors = (
  form: string
): ClearSubmitErrorsAction => ({
  type: '@@redux-form/CLEAR_SUBMIT_ERRORS',
  meta: { form }
})

const clearAsyncError: ClearAsyncError = (
  form: string,
  field: string
): ClearAsyncErrorAction => ({
  type: '@@redux-form/CLEAR_ASYNC_ERROR',
  meta: { form, field }
})

const destroy: Destroy = (...form: string[]): DestroyAction => ({
  type: '@@redux-form/DESTROY',
  meta: { form }
})

const focus: Focus = (form: string, field: string): FocusAction => ({
  type: '@@redux-form/FOCUS',
  meta: { form, field }
})

const initialize: Initialize = (
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
    type: '@@redux-form/INITIALIZE',
    meta: { form, keepDirty, ...otherMeta },
    payload: values
  }
}

const registerField: RegisterField = (
  form: string,
  name: string,
  type: FieldType
): RegisterFieldAction => ({
  type: '@@redux-form/REGISTER_FIELD',
  meta: { form },
  payload: { name, type }
})

const reset: Reset = (form: string): ResetAction => ({
  type: '@@redux-form/RESET',
  meta: { form }
})

const startAsyncValidation: StartAsyncValidation = (
  form: string,
  field: string
): StartAsyncValidationAction => ({
  type: '@@redux-form/START_ASYNC_VALIDATION',
  meta: { form, field }
})

const startSubmit: StartSubmit = (form: string): StartSubmitAction => ({
  type: '@@redux-form/START_SUBMIT',
  meta: { form }
})

const stopAsyncValidation: StopAsyncValidation = (
  form: string,
  errors: ?Object
): StopAsyncValidationAction => ({
  type: '@@redux-form/STOP_ASYNC_VALIDATION',
  meta: { form },
  payload: errors,
  error: !!(errors && Object.keys(errors).length)
})

const stopSubmit: StopSubmit = (
  form: string,
  errors: ?Object
): StopSubmitAction => ({
  type: '@@redux-form/STOP_SUBMIT',
  meta: { form },
  payload: errors,
  error: !!(errors && Object.keys(errors).length)
})

const submit: Submit = (form: string): SubmitAction => ({
  type: '@@redux-form/SUBMIT',
  meta: { form }
})

const setSubmitFailed: SetSubmitFailed = (
  form: string,
  ...fields: string[]
): SetSubmitFailedAction => ({
  type: '@@redux-form/SET_SUBMIT_FAILED',
  meta: { form, fields },
  error: true
})

const setSubmitSucceeded: SetSubmitSucceeded = (
  form: string,
  ...fields: string[]
): SetSubmitSucceededAction => ({
  type: '@@redux-form/SET_SUBMIT_SUCCEEDED',
  meta: { form, fields },
  error: false
})

const touch: Touch = (form: string, ...fields: string[]): TouchAction => ({
  type: '@@redux-form/TOUCH',
  meta: { form, fields }
})

const unregisterField: UnregisterField = (
  form: string,
  name: string,
  destroyOnUnmount: boolean = true
): UnregisterFieldAction => ({
  type: '@@redux-form/UNREGISTER_FIELD',
  meta: { form },
  payload: { name, destroyOnUnmount }
})

const untouch: Untouch = (
  form: string,
  ...fields: string[]
): UntouchAction => ({
  type: '@@redux-form/UNTOUCH',
  meta: { form, fields }
})

const updateSyncErrors: UpdateSyncErrors = (
  form: string,
  syncErrors: Object = {},
  error: any
): UpdateSyncErrorsAction => ({
  type: '@@redux-form/UPDATE_SYNC_ERRORS',
  meta: { form },
  payload: { syncErrors, error }
})

const updateSyncWarnings: UpdateSyncWarnings = (
  form: string,
  syncWarnings: Object = {},
  warning: any
): UpdateSyncWarningsAction => ({
  type: '@@redux-form/UPDATE_SYNC_WARNINGS',
  meta: { form },
  payload: { syncWarnings, warning }
})

const actions = {
  arrayInsert,
  arrayMove,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
  arrayShift,
  arraySplice,
  arraySwap,
  arrayUnshift,
  autofill,
  blur,
  change,
  clearSubmit,
  clearSubmitErrors,
  clearAsyncError,
  destroy,
  focus,
  initialize,
  registerField,
  reset,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  submit,
  setSubmitFailed,
  setSubmitSucceeded,
  touch,
  unregisterField,
  untouch,
  updateSyncErrors,
  updateSyncWarnings
}

export default actions
