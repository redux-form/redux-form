import expect from 'expect'
import expectPredicate from 'expect-predicate'
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
  BLUR,
  CHANGE,
  CLEAR_SUBMIT,
  CLEAR_SUBMIT_ERRORS,
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
  UPDATE_SYNC_WARNINGS,
  CLEAR_ASYNC_ERROR,
} from '../actionTypes'
import {
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
  clearSubmit,
  clearSubmitErrors,
  destroy,
  focus,
  initialize,
  registerField,
  reset,
  setSubmitFailed,
  setSubmitSucceeded,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  submit,
  touch,
  unregisterField,
  untouch,
  updateSyncErrors,
  updateSyncWarnings,
  clearAsyncError,
} from '../actions'
import {isFSA} from 'flux-standard-action'
expect.extend(expectPredicate)

describe('actions', () => {
  it('should create array insert action', () => {
    expect(arrayInsert('myForm', 'myField', 0, 'foo'))
      .toEqual({
        type: ARRAY_INSERT,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 0,
        },
        payload: 'foo',
      })
      .toPass(isFSA)
  })

  it('should create array move action', () => {
    expect(arrayMove('myForm', 'myField', 2, 4))
      .toEqual({
        type: ARRAY_MOVE,
        meta: {
          form: 'myForm',
          field: 'myField',
          from: 2,
          to: 4,
        },
      })
      .toPass(isFSA)
  })

  it('should create array pop action', () => {
    expect(arrayPop('myForm', 'myField'))
      .toEqual({
        type: ARRAY_POP,
        meta: {
          form: 'myForm',
          field: 'myField',
        },
      })
      .toPass(isFSA)
  })

  it('should create array push action', () => {
    expect(arrayPush('myForm', 'myField', 'foo'))
      .toEqual({
        type: ARRAY_PUSH,
        meta: {
          form: 'myForm',
          field: 'myField',
        },
        payload: 'foo',
      })
      .toPass(isFSA)

    expect(arrayPush('myForm', 'myField'))
      .toEqual({
        type: ARRAY_PUSH,
        meta: {
          form: 'myForm',
          field: 'myField',
        },
        payload: undefined,
      })
      .toPass(isFSA)
  })

  it('should create array remove action', () => {
    expect(arrayRemove('myForm', 'myField', 3))
      .toEqual({
        type: ARRAY_REMOVE,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 3,
        },
      })
      .toPass(isFSA)
  })

  it('should create array removeAll action', () => {
    expect(arrayRemoveAll('myForm', 'myField'))
      .toEqual({
        type: ARRAY_REMOVE_ALL,
        meta: {
          form: 'myForm',
          field: 'myField',
        },
      })
      .toPass(isFSA)
  })

  it('should create array shift action', () => {
    expect(arrayShift('myForm', 'myField'))
      .toEqual({
        type: ARRAY_SHIFT,
        meta: {
          form: 'myForm',
          field: 'myField',
        },
      })
      .toPass(isFSA)
  })

  it('should create array splice action', () => {
    expect(arraySplice('myForm', 'myField', 1, 1))
      .toEqual({
        type: ARRAY_SPLICE,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 1,
          removeNum: 1,
        },
      })
      .toPass(isFSA)
    expect(arraySplice('myForm', 'myField', 2, 1))
      .toEqual({
        type: ARRAY_SPLICE,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 2,
          removeNum: 1,
        },
      })
      .toPass(isFSA)
    expect(arraySplice('myForm', 'myField', 2, 0, 'foo'))
      .toEqual({
        type: ARRAY_SPLICE,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 2,
          removeNum: 0,
        },
        payload: 'foo',
      })
      .toPass(isFSA)
    expect(arraySplice('myForm', 'myField', 3, 2, {foo: 'bar'}))
      .toEqual({
        type: ARRAY_SPLICE,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 3,
          removeNum: 2,
        },
        payload: {foo: 'bar'},
      })
      .toPass(isFSA)
  })

  it('should create array unshift action', () => {
    expect(arrayUnshift('myForm', 'myField', 'foo'))
      .toEqual({
        type: ARRAY_UNSHIFT,
        meta: {
          form: 'myForm',
          field: 'myField',
        },
        payload: 'foo',
      })
      .toPass(isFSA)
  })

  it('should create array swap action', () => {
    expect(arraySwap('myForm', 'myField', 0, 8))
      .toEqual({
        type: ARRAY_SWAP,
        meta: {
          form: 'myForm',
          field: 'myField',
          indexA: 0,
          indexB: 8,
        },
      })
      .toPass(isFSA)
  })

  it('should throw an exception with illegal array swap indices', () => {
    expect(() => arraySwap('myForm', 'myField', 2, 2)).toThrow(
      'Swap indices cannot be equal'
    )
    expect(() => arraySwap('myForm', 'myField', -2, 2)).toThrow(
      'Swap indices cannot be negative'
    )
    expect(() => arraySwap('myForm', 'myField', 2, -2)).toThrow(
      'Swap indices cannot be negative'
    )
  })

  it('should create blur action', () => {
    expect(blur('myForm', 'myField', 'bar', false))
      .toEqual({
        type: BLUR,
        meta: {
          form: 'myForm',
          field: 'myField',
          touch: false,
        },
        payload: 'bar',
      })
      .toPass(isFSA)
    expect(blur('myForm', 'myField', 7, true))
      .toEqual({
        type: BLUR,
        meta: {
          form: 'myForm',
          field: 'myField',
          touch: true,
        },
        payload: 7,
      })
      .toPass(isFSA)
  })

  it('should create change action', () => {
    expect(change('myForm', 'myField', 'bar', false, true))
      .toEqual({
        type: CHANGE,
        meta: {
          form: 'myForm',
          field: 'myField',
          touch: false,
          persistentSubmitErrors: true,
        },
        payload: 'bar',
      })
      .toPass(isFSA)
    expect(change('myForm', 'myField', 7, true, false))
      .toEqual({
        type: CHANGE,
        meta: {
          form: 'myForm',
          field: 'myField',
          touch: true,
          persistentSubmitErrors: false,
        },
        payload: 7,
      })
      .toPass(isFSA)
  })

  it('should create focus action', () => {
    expect(focus('myForm', 'myField'))
      .toEqual({
        type: FOCUS,
        meta: {
          form: 'myForm',
          field: 'myField',
        },
      })
      .toPass(isFSA)
  })

  it('should create clear submit action', () => {
    expect(clearSubmit('myForm'))
      .toEqual({
        type: CLEAR_SUBMIT,
        meta: {
          form: 'myForm',
        },
      })
      .toPass(isFSA)
  })

  it('should create clear submit errors action', () => {
    expect(clearSubmitErrors('myForm'))
      .toEqual({
        type: CLEAR_SUBMIT_ERRORS,
        meta: {
          form: 'myForm',
        },
      })
      .toPass(isFSA)
  })

  it('should create initialize action', () => {
    const data = {a: 8, c: 9}
    expect(initialize('myForm', data))
      .toEqual({
        type: INITIALIZE,
        meta: {
          form: 'myForm',
          keepDirty: undefined,
        },
        payload: data,
      })
      .toPass(isFSA)
  })

  it('should create initialize action with a keepDirty value', () => {
    const data = {a: 8, c: 9}
    expect(initialize('myForm', data, true))
      .toEqual({
        type: INITIALIZE,
        meta: {
          form: 'myForm',
          keepDirty: true,
        },
        payload: data,
      })
      .toPass(isFSA)
  })

  it('should create registerField action', () => {
    expect(registerField('myForm', 'foo', 'Field'))
      .toEqual({
        type: REGISTER_FIELD,
        meta: {
          form: 'myForm',
        },
        payload: {
          name: 'foo',
          type: 'Field',
        },
      })
      .toPass(isFSA)
  })

  it('should create reset action', () => {
    expect(reset('myForm'))
      .toEqual({
        type: RESET,
        meta: {
          form: 'myForm',
        },
      })
      .toPass(isFSA)
  })

  it('should create destroy action', () => {
    expect(destroy('myForm'))
      .toEqual({
        type: DESTROY,
        meta: {
          form: ['myForm'],
        },
      })
      .toPass(isFSA)
    expect(destroy('myForm1', 'myForm2'))
      .toEqual({
        type: DESTROY,
        meta: {
          form: ['myForm1', 'myForm2'],
        },
      })
      .toPass(isFSA)
  })

  it('should create startAsyncValidation action', () => {
    expect(startAsyncValidation('myForm', 'myField'))
      .toEqual({
        type: START_ASYNC_VALIDATION,
        meta: {
          form: 'myForm',
          field: 'myField',
        },
      })
      .toPass(isFSA)
  })

  it('should create startSubmit action', () => {
    expect(startSubmit('myForm'))
      .toEqual({
        type: START_SUBMIT,
        meta: {
          form: 'myForm',
        },
      })
      .toPass(isFSA)
  })

  it('should create startSubmit action', () => {
    expect(startSubmit('myForm'))
      .toEqual({
        type: START_SUBMIT,
        meta: {
          form: 'myForm',
        },
      })
      .toPass(isFSA)
  })

  it('should create stopAsyncValidation action', () => {
    const errors = {
      foo: 'Foo error',
      bar: 'Error for bar',
    }
    expect(stopAsyncValidation('myForm', errors))
      .toEqual({
        type: STOP_ASYNC_VALIDATION,
        meta: {
          form: 'myForm',
        },
        payload: errors,
        error: true,
      })
      .toPass(isFSA)
  })

  it('should create stopSubmit action', () => {
    expect(stopSubmit('myForm'))
      .toEqual({
        type: STOP_SUBMIT,
        meta: {
          form: 'myForm',
        },
        payload: undefined,
      })
      .toPass(isFSA)
    const errors = {
      foo: 'Foo error',
      bar: 'Error for bar',
    }
    expect(stopSubmit('myForm', errors))
      .toEqual({
        type: STOP_SUBMIT,
        meta: {
          form: 'myForm',
        },
        payload: errors,
        error: true,
      })
      .toPass(isFSA)
  })

  it('should create submit action', () => {
    expect(submit('myForm'))
      .toEqual({
        type: SUBMIT,
        meta: {
          form: 'myForm',
        },
      })
      .toPass(isFSA)
  })

  it('should create setSubmitFailed action', () => {
    expect(setSubmitFailed('myForm'))
      .toEqual({
        type: SET_SUBMIT_FAILED,
        meta: {
          form: 'myForm',
          fields: [],
        },
        error: true,
      })
      .toPass(isFSA)
    expect(setSubmitFailed('myForm', 'a', 'b', 'c'))
      .toEqual({
        type: SET_SUBMIT_FAILED,
        meta: {
          form: 'myForm',
          fields: ['a', 'b', 'c'],
        },
        error: true,
      })
      .toPass(isFSA)
  })

  it('should create setSubmitSucceeded action', () => {
    expect(setSubmitSucceeded('myForm'))
      .toEqual({
        type: SET_SUBMIT_SUCCEEDED,
        meta: {
          form: 'myForm',
          fields: [],
        },
        error: false,
      })
      .toPass(isFSA)
    expect(setSubmitSucceeded('myForm', 'a', 'b', 'c'))
      .toEqual({
        type: SET_SUBMIT_SUCCEEDED,
        meta: {
          form: 'myForm',
          fields: ['a', 'b', 'c'],
        },
        error: false,
      })
      .toPass(isFSA)
  })

  it('should create touch action', () => {
    expect(touch('myForm', 'foo', 'bar'))
      .toEqual({
        type: TOUCH,
        meta: {
          form: 'myForm',
          fields: ['foo', 'bar'],
        },
      })
      .toPass(isFSA)
    expect(touch('myForm', 'cat', 'dog', 'pig'))
      .toEqual({
        type: TOUCH,
        meta: {
          form: 'myForm',
          fields: ['cat', 'dog', 'pig'],
        },
      })
      .toPass(isFSA)
  })

  it('should create unregisterField action', () => {
    expect(unregisterField('myForm', 'foo'))
      .toEqual({
        type: UNREGISTER_FIELD,
        meta: {
          form: 'myForm',
        },
        payload: {
          name: 'foo',
          destroyOnUnmount: true,
        },
      })
      .toPass(isFSA)
  })

  it('should create untouch action', () => {
    expect(untouch('myForm', 'foo', 'bar'))
      .toEqual({
        type: UNTOUCH,
        meta: {
          form: 'myForm',
          fields: ['foo', 'bar'],
        },
      })
      .toPass(isFSA)
    expect(untouch('myForm', 'cat', 'dog', 'pig'))
      .toEqual({
        type: UNTOUCH,
        meta: {
          form: 'myForm',
          fields: ['cat', 'dog', 'pig'],
        },
      })
      .toPass(isFSA)
  })

  it('should create updateSyncErrors action', () => {
    expect(updateSyncErrors('myForm', {foo: 'foo error'}))
      .toEqual({
        type: UPDATE_SYNC_ERRORS,
        meta: {
          form: 'myForm',
        },
        payload: {
          error: undefined,
          syncErrors: {
            foo: 'foo error',
          },
        },
      })
      .toPass(isFSA)
  })

  it('should create updateSyncErrors action with no errors if none given', () => {
    expect(updateSyncErrors('myForm'))
      .toEqual({
        type: UPDATE_SYNC_ERRORS,
        meta: {
          form: 'myForm',
        },
        payload: {
          error: undefined,
          syncErrors: {},
        },
      })
      .toPass(isFSA)
  })

  it('should create updateSyncWarnings action', () => {
    expect(updateSyncWarnings('myForm', {foo: 'foo warning'}))
      .toEqual({
        type: UPDATE_SYNC_WARNINGS,
        meta: {
          form: 'myForm',
        },
        payload: {
          warning: undefined,
          syncWarnings: {
            foo: 'foo warning',
          },
        },
      })
      .toPass(isFSA)
  })

  it('should create updateSyncWarnings action with no warnings if none given', () => {
    expect(updateSyncWarnings('myForm'))
      .toEqual({
        type: UPDATE_SYNC_WARNINGS,
        meta: {
          form: 'myForm',
        },
        payload: {
          warning: undefined,
          syncWarnings: {},
        },
      })
      .toPass(isFSA)
  })

  it('should create clearAsyncError action', () => {
    expect(clearAsyncError('myForm', 'foo'))
      .toEqual({
        type: CLEAR_ASYNC_ERROR,
        meta: {
          form: 'myForm',
          field: 'foo',
        },
      })
      .toPass(isFSA)
  })
})
