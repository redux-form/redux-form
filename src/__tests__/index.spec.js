import expect from 'expect'
import * as expectedActionTypes from '../actionTypes'
import expectedPropTypes, {
  fieldPropTypes as expectedFieldPropTypes
} from '../propTypes'
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
  getFormNames,
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
  fieldPropTypes,
  propTypes,
  formPropTypes,
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
} from '../index'

describe('index', () => {
  it('should export actionTypes', () => {
    expect(actionTypes).toEqual(expectedActionTypes)
  })
  it('should export arrayInsert', () => {
    expect(arrayInsert).toBeA('function')
  })
  it('should export arrayMove', () => {
    expect(arrayMove).toBeA('function')
  })
  it('should export arrayPop', () => {
    expect(arrayPop).toBeA('function')
  })
  it('should export arrayPush', () => {
    expect(arrayPush).toBeA('function')
  })
  it('should export arrayRemove', () => {
    expect(arrayRemove).toBeA('function')
  })
  it('should export arrayRemoveAll', () => {
    expect(arrayRemoveAll).toBeA('function')
  })
  it('should export arrayShift', () => {
    expect(arrayShift).toBeA('function')
  })
  it('should export arraySplice', () => {
    expect(arraySplice).toBeA('function')
  })
  it('should export arraySwap', () => {
    expect(arraySwap).toBeA('function')
  })
  it('should export arrayUnshift', () => {
    expect(arrayUnshift).toBeA('function')
  })
  it('should export autofill', () => {
    expect(autofill).toBeA('function')
  })
  it('should export blur', () => {
    expect(blur).toBeA('function')
  })
  it('should export change', () => {
    expect(change).toBeA('function')
  })
  it('should export clearSubmitErrors', () => {
    expect(clearSubmitErrors).toBeA('function')
  })
  it('should export defaultShouldAsyncValidate', () => {
    expect(defaultShouldAsyncValidate).toBeA('function')
  })
  it('should export defaultShouldValidate', () => {
    expect(defaultShouldValidate).toBeA('function')
  })
  it('should export destroy', () => {
    expect(destroy).toBeA('function')
  })
  it('should export Field', () => {
    expect(Field).toBeA('function')
  })
  it('should export Fields', () => {
    expect(Fields).toBeA('function')
  })
  it('should export FieldArray', () => {
    expect(FieldArray).toBeA('function')
  })
  it('should export Form', () => {
    expect(Form).toBeA('function')
  })
  it('should export FormSection', () => {
    expect(FormSection).toBeA('function')
  })
  it('should export focus', () => {
    expect(focus).toBeA('function')
  })
  it('should export formValueSelector', () => {
    expect(formValueSelector).toBeA('function')
  })
  it('should export getFormNames', () => {
    expect(getFormNames).toBeA('function')
  })
  it('should export getFormValues', () => {
    expect(getFormValues).toBeA('function')
  })
  it('should export getFormInitialValues', () => {
    expect(getFormInitialValues).toBeA('function')
  })
  it('should export getFormSyncErrors', () => {
    expect(getFormSyncErrors).toBeA('function')
  })
  it('should export getFormMeta', () => {
    expect(getFormMeta).toBeA('function')
  })
  it('should export getFormAsyncErrors', () => {
    expect(getFormAsyncErrors).toBeA('function')
  })
  it('should export getFormSyncWarnings', () => {
    expect(getFormSyncWarnings).toBeA('function')
  })
  it('should export getFormSubmitErrors', () => {
    expect(getFormSubmitErrors).toBeA('function')
  })
  it('should export initialize', () => {
    expect(initialize).toBeA('function')
  })
  it('should export isDirty', () => {
    expect(isDirty).toBeA('function')
  })
  it('should export isInvalid', () => {
    expect(isInvalid).toBeA('function')
  })
  it('should export isPristine', () => {
    expect(isPristine).toBeA('function')
  })
  it('should export isValid', () => {
    expect(isValid).toBeA('function')
  })
  it('should export isSubmitting', () => {
    expect(isSubmitting).toBeA('function')
  })
  it('should export hasSubmitSucceeded', () => {
    expect(hasSubmitSucceeded).toBeA('function')
  })
  it('should export hasSubmitFailed', () => {
    expect(hasSubmitFailed).toBeA('function')
  })
  it('should export fieldPropTypes', () => {
    expect(fieldPropTypes).toEqual(expectedFieldPropTypes)
  })
  it('should export propTypes', () => {
    expect(propTypes).toEqual(expectedPropTypes)
  })
  it('should export formPropTypes', () => {
    expect(formPropTypes).toEqual(expectedPropTypes)
  })
  it('should export reducer', () => {
    expect(reducer).toBeA('function')
  })
  it('should export reduxForm', () => {
    expect(reduxForm).toBeA('function')
  })
  it('should export registerField', () => {
    expect(registerField).toBeA('function')
  })
  it('should export reset', () => {
    expect(reset).toBeA('function')
  })
  it('should export startAsyncValidation', () => {
    expect(startAsyncValidation).toBeA('function')
  })
  it('should export startSubmit', () => {
    expect(startSubmit).toBeA('function')
  })
  it('should export setSubmitFailed', () => {
    expect(setSubmitFailed).toBeA('function')
  })
  it('should export setSubmitSucceeded', () => {
    expect(setSubmitSucceeded).toBeA('function')
  })
  it('should export stopAsyncValidation', () => {
    expect(stopAsyncValidation).toBeA('function')
  })
  it('should export stopSubmit', () => {
    expect(stopSubmit).toBeA('function')
  })
  it('should export submit', () => {
    expect(submit).toBeA('function')
  })
  it('should export SubmissionError', () => {
    expect(SubmissionError).toBeA('function')
  })
  it('should export touch', () => {
    expect(touch).toBeA('function')
  })
  it('should export unregisterField', () => {
    expect(unregisterField).toBeA('function')
  })
  it('should export untouch', () => {
    expect(untouch).toBeA('function')
  })
  it('should export values', () => {
    expect(values).toBeA('function')
  })
})
