// @flow
import type {
  ArrayInsertType,
  ArrayMoveType,
  ArrayPopType,
  ArrayPushType,
  ArrayRemoveType,
  ArrayRemoveAllType,
  ArrayShiftType,
  ArraySpliceType,
  ArrayUnshiftType,
  ArraySwapType,
  AutofillType,
  BlurType,
  ChangeType,
  ClearSubmitType,
  ClearSubmitErrorsType,
  ClearAsyncErrorType,
  DestroyType,
  FocusType,
  InitializeType,
  RegisterFieldType,
  ResetType,
  SetSubmitFailedType,
  SetSubmitSucceededType,
  StartAsyncValidationType,
  StartSubmitType,
  StopAsyncValidationType,
  StopSubmitType,
  SubmitType,
  TouchType,
  UnregisterFieldType,
  UntouchType,
  UpdateSyncErrorsType,
  UpdateSyncWarningsType
} from './actionTypes.types'

export const prefix = '@@redux-form/'

export const ARRAY_INSERT: ArrayInsertType = '@@redux-form/ARRAY_INSERT'
export const ARRAY_MOVE: ArrayMoveType = '@@redux-form/ARRAY_MOVE'
export const ARRAY_POP: ArrayPopType = '@@redux-form/ARRAY_POP'
export const ARRAY_PUSH: ArrayPushType = '@@redux-form/ARRAY_PUSH'
export const ARRAY_REMOVE: ArrayRemoveType = '@@redux-form/ARRAY_REMOVE'
export const ARRAY_REMOVE_ALL: ArrayRemoveAllType =
  '@@redux-form/ARRAY_REMOVE_ALL'
export const ARRAY_SHIFT: ArrayShiftType = '@@redux-form/ARRAY_SHIFT'
export const ARRAY_SPLICE: ArraySpliceType = '@@redux-form/ARRAY_SPLICE'
export const ARRAY_UNSHIFT: ArrayUnshiftType = '@@redux-form/ARRAY_UNSHIFT'
export const ARRAY_SWAP: ArraySwapType = '@@redux-form/ARRAY_SWAP'
export const AUTOFILL: AutofillType = '@@redux-form/AUTOFILL'
export const BLUR: BlurType = '@@redux-form/BLUR'
export const CHANGE: ChangeType = '@@redux-form/CHANGE'
export const CLEAR_SUBMIT: ClearSubmitType = '@@redux-form/CLEAR_SUBMIT'
export const CLEAR_SUBMIT_ERRORS: ClearSubmitErrorsType =
  '@@redux-form/CLEAR_SUBMIT_ERRORS'
export const CLEAR_ASYNC_ERROR: ClearAsyncErrorType =
  '@@redux-form/CLEAR_ASYNC_ERROR'
export const DESTROY: DestroyType = '@@redux-form/DESTROY'
export const FOCUS: FocusType = '@@redux-form/FOCUS'
export const INITIALIZE: InitializeType = '@@redux-form/INITIALIZE'
export const REGISTER_FIELD: RegisterFieldType = '@@redux-form/REGISTER_FIELD'
export const RESET: ResetType = '@@redux-form/RESET'
export const SET_SUBMIT_FAILED: SetSubmitFailedType =
  '@@redux-form/SET_SUBMIT_FAILED'
export const SET_SUBMIT_SUCCEEDED: SetSubmitSucceededType =
  '@@redux-form/SET_SUBMIT_SUCCEEDED'
export const START_ASYNC_VALIDATION: StartAsyncValidationType =
  '@@redux-form/START_ASYNC_VALIDATION'
export const START_SUBMIT: StartSubmitType = '@@redux-form/START_SUBMIT'
export const STOP_ASYNC_VALIDATION: StopAsyncValidationType =
  '@@redux-form/STOP_ASYNC_VALIDATION'
export const STOP_SUBMIT: StopSubmitType = '@@redux-form/STOP_SUBMIT'
export const SUBMIT: SubmitType = '@@redux-form/SUBMIT'
export const TOUCH: TouchType = '@@redux-form/TOUCH'
export const UNREGISTER_FIELD: UnregisterFieldType =
  '@@redux-form/UNREGISTER_FIELD'
export const UNTOUCH: UntouchType = '@@redux-form/UNTOUCH'
export const UPDATE_SYNC_ERRORS: UpdateSyncErrorsType =
  '@@redux-form/UPDATE_SYNC_ERRORS'
export const UPDATE_SYNC_WARNINGS: UpdateSyncWarningsType =
  '@@redux-form/UPDATE_SYNC_WARNINGS'
