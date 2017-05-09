import expect from 'expect'
import * as expectedActionTypes from '../actionTypes'
import expectedPropTypes from '../propTypes'
import {
  actionTypes,
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
  clearSubmitErrors,
  defaultShouldAsyncValidate,
  defaultShouldValidate,
  destroy,
  Field,
  Fields,
  FieldArray,
  Form,
  FormSection,
  focus,
  formValueSelector,
  getFormValues,
  getFormInitialValues,
  getFormSyncErrors,
  getFormMeta,
  getFormAsyncErrors,
  getFormSyncWarnings,
  getFormSubmitErrors,
  initialize,
  isDirty,
  isInvalid,
  isPristine,
  isValid,
  isSubmitting,
  hasSubmitSucceeded,
  hasSubmitFailed,
  propTypes,
  reducer,
  reduxForm,
  registerField,
  reset,
  setSubmitFailed,
  setSubmitSucceeded,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  submit,
  SubmissionError,
  touch,
  unregisterField,
  untouch,
  values
} from '../immutable'

describe('immutable', () => {
  it('should export actionTypes', () => {
    expect(actionTypes).toEqual(expectedActionTypes)
  })
  it('should export arrayInsert', () => {
    expect(arrayInsert).toExist().toBeA('function')
  })
  it('should export arrayMove', () => {
    expect(arrayMove).toExist().toBeA('function')
  })
  it('should export arrayPop', () => {
    expect(arrayPop).toExist().toBeA('function')
  })
  it('should export arrayPush', () => {
    expect(arrayPush).toExist().toBeA('function')
  })
  it('should export arrayRemove', () => {
    expect(arrayRemove).toExist().toBeA('function')
  })
  it('should export arrayRemoveAll', () => {
    expect(arrayRemoveAll).toExist().toBeA('function')
  })
  it('should export arrayShift', () => {
    expect(arrayShift).toExist().toBeA('function')
  })
  it('should export arraySplice', () => {
    expect(arraySplice).toExist().toBeA('function')
  })
  it('should export arraySwap', () => {
    expect(arraySwap).toExist().toBeA('function')
  })
  it('should export arrayUnshift', () => {
    expect(arrayUnshift).toExist().toBeA('function')
  })
  it('should export autofill', () => {
    expect(autofill).toExist().toBeA('function')
  })
  it('should export blur', () => {
    expect(blur).toExist().toBeA('function')
  })
  it('should export change', () => {
    expect(change).toExist().toBeA('function')
  })
  it('should export clearSubmitErrors', () => {
    expect(clearSubmitErrors).toExist().toBeA('function')
  })
  it('should export defaultShouldAsyncValidate', () => {
    expect(defaultShouldAsyncValidate).toExist().toBeA('function')
  })
  it('should export defaultShouldValidate', () => {
    expect(defaultShouldValidate).toExist().toBeA('function')
  })
  it('should export destroy', () => {
    expect(destroy).toExist().toBeA('function')
  })
  it('should export Field', () => {
    expect(Field).toExist().toBeA('function')
  })
  it('should export Fields', () => {
    expect(Fields).toExist().toBeA('function')
  })
  it('should export FieldArray', () => {
    expect(FieldArray).toExist().toBeA('function')
  })
  it('should export Form', () => {
    expect(Form).toExist().toBeA('function')
  })
  it('should export FormSection', () => {
    expect(FormSection).toExist().toBeA('function')
  })
  it('should export focus', () => {
    expect(focus).toExist().toBeA('function')
  })
  it('should export formValueSelector', () => {
    expect(formValueSelector).toExist().toBeA('function')
  })
  it('should export getFormValues', () => {
    expect(getFormValues).toExist().toBeA('function')
  })
  it('should export getFormInitialValues', () => {
    expect(getFormInitialValues).toExist().toBeA('function')
  })
  it('should export getFormSyncErrors', () => {
    expect(getFormSyncErrors).toExist().toBeA('function')
  })
  it('should export getFormMeta', () => {
    expect(getFormMeta).toExist().toBeA('function')
  })
  it('should export getFormAsyncErrors', () => {
    expect(getFormAsyncErrors).toExist().toBeA('function')
  })
  it('should export getFormSyncWarnings', () => {
    expect(getFormSyncWarnings).toExist().toBeA('function')
  })
  it('should export getFormSubmitErrors', () => {
    expect(getFormSubmitErrors).toExist().toBeA('function')
  })
  it('should export initialize', () => {
    expect(initialize).toExist().toBeA('function')
  })
  it('should export isDirty', () => {
    expect(isDirty).toExist().toBeA('function')
  })
  it('should export isInvalid', () => {
    expect(isInvalid).toExist().toBeA('function')
  })
  it('should export isPristine', () => {
    expect(isPristine).toExist().toBeA('function')
  })
  it('should export isValid', () => {
    expect(isValid).toExist().toBeA('function')
  })
  it('should export isSubmitting', () => {
    expect(isSubmitting).toExist().toBeA('function')
  })
  it('should export hasSubmitSucceeded', () => {
    expect(hasSubmitSucceeded).toExist().toBeA('function')
  })
  it('should export hasSubmitFailed', () => {
    expect(hasSubmitFailed).toExist().toBeA('function')
  })
  it('should export propTypes', () => {
    expect(propTypes).toEqual(expectedPropTypes)
  })
  it('should export reducer', () => {
    expect(reducer).toExist().toBeA('function')
  })
  it('should export reduxForm', () => {
    expect(reduxForm).toExist().toBeA('function')
  })
  it('should export registerField', () => {
    expect(registerField).toExist().toBeA('function')
  })
  it('should export reset', () => {
    expect(reset).toExist().toBeA('function')
  })
  it('should export startAsyncValidation', () => {
    expect(startAsyncValidation).toExist().toBeA('function')
  })
  it('should export startSubmit', () => {
    expect(startSubmit).toExist().toBeA('function')
  })
  it('should export setSubmitFailed', () => {
    expect(setSubmitFailed).toExist().toBeA('function')
  })
  it('should export setSubmitSucceeded', () => {
    expect(setSubmitSucceeded).toExist().toBeA('function')
  })
  it('should export stopAsyncValidation', () => {
    expect(stopAsyncValidation).toExist().toBeA('function')
  })
  it('should export stopSubmit', () => {
    expect(stopSubmit).toExist().toBeA('function')
  })
  it('should export submit', () => {
    expect(submit).toExist().toBeA('function')
  })
  it('should export SubmissionError', () => {
    expect(SubmissionError).toExist().toBeA('function')
  })
  it('should export touch', () => {
    expect(touch).toExist().toBeA('function')
  })
  it('should export unregisterField', () => {
    expect(unregisterField).toExist().toBeA('function')
  })
  it('should export untouch', () => {
    expect(untouch).toExist().toBeA('function')
  })
  it('should export values', () => {
    expect(values).toExist().toBeA('function')
  })
})
