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
  blur,
  change,
  destroy,
  Field,
  FieldArray,
  focus,
  formValueSelector,
  initialize,
  propTypes,
  reducer,
  reduxForm,
  reset,
  setSubmitFailed,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  SubmissionError,
  touch,
  untouch,
  values
} from '../index'

describe('index', () => {
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
  it('should export blur', () => {
    expect(blur).toExist().toBeA('function')
  })
  it('should export change', () => {
    expect(change).toExist().toBeA('function')
  })
  it('should export destroy', () => {
    expect(destroy).toExist().toBeA('function')
  })
  it('should export Field', () => {
    expect(Field).toExist().toBeA('function')
  })
  it('should export FieldArray', () => {
    expect(FieldArray).toExist().toBeA('function')
  })
  it('should export focus', () => {
    expect(focus).toExist().toBeA('function')
  })
  it('should export formValueSelector', () => {
    expect(formValueSelector).toExist().toBeA('function')
  })
  it('should export initialize', () => {
    expect(initialize).toExist().toBeA('function')
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
  it('should export stopAsyncValidation', () => {
    expect(stopAsyncValidation).toExist().toBeA('function')
  })
  it('should export stopSubmit', () => {
    expect(stopSubmit).toExist().toBeA('function')
  })
  it('should export SubmissionError', () => {
    expect(SubmissionError).toExist().toBeA('function')
  })
  it('should export touch', () => {
    expect(touch).toExist().toBeA('function')
  })
  it('should export untouch', () => {
    expect(untouch).toExist().toBeA('function')
  })
  it('should export values', () => {
    expect(values).toExist().toBeA('function')
  })
})
