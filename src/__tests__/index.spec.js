import * as expectedActionTypes from '../actionTypes'
import expectedPropTypes, {
  fieldPropTypes as expectedFieldPropTypes,
  fieldArrayPropTypes as expectedFieldArrayPropTypes
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
  fieldArrayPropTypes,
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
    expect(typeof arrayInsert).toBe('function')
  })
  it('should export arrayMove', () => {
    expect(typeof arrayMove).toBe('function')
  })
  it('should export arrayPop', () => {
    expect(typeof arrayPop).toBe('function')
  })
  it('should export arrayPush', () => {
    expect(typeof arrayPush).toBe('function')
  })
  it('should export arrayRemove', () => {
    expect(typeof arrayRemove).toBe('function')
  })
  it('should export arrayRemoveAll', () => {
    expect(typeof arrayRemoveAll).toBe('function')
  })
  it('should export arrayShift', () => {
    expect(typeof arrayShift).toBe('function')
  })
  it('should export arraySplice', () => {
    expect(typeof arraySplice).toBe('function')
  })
  it('should export arraySwap', () => {
    expect(typeof arraySwap).toBe('function')
  })
  it('should export arrayUnshift', () => {
    expect(typeof arrayUnshift).toBe('function')
  })
  it('should export autofill', () => {
    expect(typeof autofill).toBe('function')
  })
  it('should export blur', () => {
    expect(typeof blur).toBe('function')
  })
  it('should export change', () => {
    expect(typeof change).toBe('function')
  })
  it('should export clearSubmitErrors', () => {
    expect(typeof clearSubmitErrors).toBe('function')
  })
  it('should export defaultShouldAsyncValidate', () => {
    expect(typeof defaultShouldAsyncValidate).toBe('function')
  })
  it('should export defaultShouldValidate', () => {
    expect(typeof defaultShouldValidate).toBe('function')
  })
  it('should export destroy', () => {
    expect(typeof destroy).toBe('function')
  })
  it('should export Field', () => {
    expect(typeof Field).toBe('function')
  })
  it('should export Fields', () => {
    expect(typeof Fields).toBe('function')
  })
  it('should export FieldArray', () => {
    expect(typeof FieldArray).toBe('function')
  })
  it('should export Form', () => {
    expect(typeof Form).toBe('function')
  })
  it('should export FormSection', () => {
    expect(typeof FormSection).toBe('function')
  })
  it('should export focus', () => {
    expect(typeof focus).toBe('function')
  })
  it('should export formValueSelector', () => {
    expect(typeof formValueSelector).toBe('function')
  })
  it('should export getFormNames', () => {
    expect(typeof getFormNames).toBe('function')
  })
  it('should export getFormValues', () => {
    expect(typeof getFormValues).toBe('function')
  })
  it('should export getFormInitialValues', () => {
    expect(typeof getFormInitialValues).toBe('function')
  })
  it('should export getFormSyncErrors', () => {
    expect(typeof getFormSyncErrors).toBe('function')
  })
  it('should export getFormMeta', () => {
    expect(typeof getFormMeta).toBe('function')
  })
  it('should export getFormAsyncErrors', () => {
    expect(typeof getFormAsyncErrors).toBe('function')
  })
  it('should export getFormSyncWarnings', () => {
    expect(typeof getFormSyncWarnings).toBe('function')
  })
  it('should export getFormSubmitErrors', () => {
    expect(typeof getFormSubmitErrors).toBe('function')
  })
  it('should export initialize', () => {
    expect(typeof initialize).toBe('function')
  })
  it('should export isDirty', () => {
    expect(typeof isDirty).toBe('function')
  })
  it('should export isInvalid', () => {
    expect(typeof isInvalid).toBe('function')
  })
  it('should export isPristine', () => {
    expect(typeof isPristine).toBe('function')
  })
  it('should export isValid', () => {
    expect(typeof isValid).toBe('function')
  })
  it('should export isSubmitting', () => {
    expect(typeof isSubmitting).toBe('function')
  })
  it('should export hasSubmitSucceeded', () => {
    expect(typeof hasSubmitSucceeded).toBe('function')
  })
  it('should export hasSubmitFailed', () => {
    expect(typeof hasSubmitFailed).toBe('function')
  })
  it('should export fieldPropTypes', () => {
    expect(fieldPropTypes).toEqual(expectedFieldPropTypes)
  })
  it('should export fieldArrayPropTypes', () => {
    expect(fieldArrayPropTypes).toEqual(expectedFieldArrayPropTypes)
  })
  it('should export propTypes', () => {
    expect(propTypes).toEqual(expectedPropTypes)
  })
  it('should export formPropTypes', () => {
    expect(formPropTypes).toEqual(expectedPropTypes)
  })
  it('should export reducer', () => {
    expect(typeof reducer).toBe('function')
  })
  it('should export reduxForm', () => {
    expect(typeof reduxForm).toBe('function')
  })
  it('should export registerField', () => {
    expect(typeof registerField).toBe('function')
  })
  it('should export reset', () => {
    expect(typeof reset).toBe('function')
  })
  it('should export startAsyncValidation', () => {
    expect(typeof startAsyncValidation).toBe('function')
  })
  it('should export startSubmit', () => {
    expect(typeof startSubmit).toBe('function')
  })
  it('should export setSubmitFailed', () => {
    expect(typeof setSubmitFailed).toBe('function')
  })
  it('should export setSubmitSucceeded', () => {
    expect(typeof setSubmitSucceeded).toBe('function')
  })
  it('should export stopAsyncValidation', () => {
    expect(typeof stopAsyncValidation).toBe('function')
  })
  it('should export stopSubmit', () => {
    expect(typeof stopSubmit).toBe('function')
  })
  it('should export submit', () => {
    expect(typeof submit).toBe('function')
  })
  it('should export SubmissionError', () => {
    expect(typeof SubmissionError).toBe('function')
  })
  it('should export touch', () => {
    expect(typeof touch).toBe('function')
  })
  it('should export unregisterField', () => {
    expect(typeof unregisterField).toBe('function')
  })
  it('should export untouch', () => {
    expect(typeof untouch).toBe('function')
  })
  it('should export values', () => {
    expect(typeof values).toBe('function')
  })
})
