import expect from 'expect'
import expectPredicate from 'expect-predicate'
import {
  ARRAY_SPLICE, ARRAY_SWAP,
  BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, RESET, SET_SUBMIT_FAILED, START_ASYNC_VALIDATION,
  START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, TOUCH, UNTOUCH
} from '../actionTypes'
import {
  arraySplice, arraySwap, blur, change, destroy, focus, initialize,
  reset, setSubmitFailed, startAsyncValidation, startSubmit, stopAsyncValidation, stopSubmit,
  touch, untouch
} from '../actions'
import { isFSA } from 'flux-standard-action'
expect.extend(expectPredicate)

describe('actions', () => {
  it('should create array splice action', () => {
    expect(arraySplice('myForm', 'myField', 1, 1))
      .toEqual({
        type: ARRAY_SPLICE,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 1,
          removeNum: 1
        }
      })
      .toPass(isFSA)
    expect(arraySplice('myForm', 'myField', 2, 1))
      .toEqual({
        type: ARRAY_SPLICE,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 2,
          removeNum: 1
        }
      })
      .toPass(isFSA)
    expect(arraySplice('myForm', 'myField', 2, 0, 'foo'))
      .toEqual({
        type: ARRAY_SPLICE,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 2,
          removeNum: 0
        },
        payload: 'foo'
      })
      .toPass(isFSA)
    expect(arraySplice('myForm', 'myField', 3, 2, { foo: 'bar' }))
      .toEqual({
        type: ARRAY_SPLICE,
        meta: {
          form: 'myForm',
          field: 'myField',
          index: 3,
          removeNum: 2
        },
        payload: { foo: 'bar' }
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
          indexB: 8
        }
      })
      .toPass(isFSA)
  })

  it('should throw an exception with illegal array swap indices', () => {
    expect(() => arraySwap('myForm', 'myField', 2, 2))
      .toThrow('Swap indices cannot be equal')
    expect(() => arraySwap('myForm', 'myField', -2, 2))
      .toThrow('Swap indices cannot be negative')
    expect(() => arraySwap('myForm', 'myField', 2, -2))
      .toThrow('Swap indices cannot be negative')
  })

  it('should create blur action', () => {
    expect(blur('myForm', 'myField', 'bar', false))
      .toEqual({
        type: BLUR,
        meta: {
          form: 'myForm',
          field: 'myField',
          touch: false
        },
        payload: 'bar'
      })
      .toPass(isFSA)
    expect(blur('myForm', 'myField', 7, true))
      .toEqual({
        type: BLUR,
        meta: {
          form: 'myForm',
          field: 'myField',
          touch: true
        },
        payload: 7
      })
      .toPass(isFSA)
  })

  it('should create change action', () => {
    expect(change('myForm', 'myField', 'bar', false))
      .toEqual({
        type: CHANGE,
        meta: {
          form: 'myForm',
          field: 'myField',
          touch: false
        },
        payload: 'bar'
      })
      .toPass(isFSA)
    expect(change('myForm', 'myField', 7, true))
      .toEqual({
        type: CHANGE,
        meta: {
          form: 'myForm',
          field: 'myField',
          touch: true
        },
        payload: 7
      })
      .toPass(isFSA)
  })

  it('should create focus action', () => {
    expect(focus('myForm', 'myField'))
      .toEqual({
        type: FOCUS,
        meta: {
          form: 'myForm',
          field: 'myField'
        }
      })
      .toPass(isFSA)
  })

  it('should create initialize action', () => {
    const data = { a: 8, c: 9 }
    expect(initialize('myForm', data))
      .toEqual({
        type: INITIALIZE,
        meta: {
          form: 'myForm'
        },
        payload: data
      })
      .toPass(isFSA)
  })

  it('should create reset action', () => {
    expect(reset('myForm'))
      .toEqual({
        type: RESET,
        meta: {
          form: 'myForm'
        }
      })
      .toPass(isFSA)
  })

  it('should create destroy action', () => {
    expect(destroy('myForm'))
      .toEqual({
        type: DESTROY,
        meta: {
          form: 'myForm'
        }
      })
      .toPass(isFSA)
  })

  it('should create startAsyncValidation action', () => {
    expect(startAsyncValidation('myForm', 'myField'))
      .toEqual({
        type: START_ASYNC_VALIDATION,
        meta: {
          form: 'myForm',
          field: 'myField'
        }
      })
      .toPass(isFSA)
  })

  it('should create startSubmit action', () => {
    expect(startSubmit('myForm'))
      .toEqual({
        type: START_SUBMIT,
        meta: {
          form: 'myForm'
        }
      })
      .toPass(isFSA)
  })

  it('should create startSubmit action', () => {
    expect(startSubmit('myForm'))
      .toEqual({
        type: START_SUBMIT,
        meta: {
          form: 'myForm'
        }
      })
      .toPass(isFSA)
  })

  it('should create stopAsyncValidation action', () => {
    const errors = {
      foo: 'Foo error',
      bar: 'Error for bar'
    }
    expect(stopAsyncValidation('myForm', errors))
      .toEqual({
        type: STOP_ASYNC_VALIDATION,
        meta: {
          form: 'myForm'
        },
        payload: errors,
        error: true
      })
      .toPass(isFSA)
  })

  it('should create stopSubmit action', () => {
    expect(stopSubmit('myForm'))
      .toEqual({
        type: STOP_SUBMIT,
        meta: {
          form: 'myForm'
        },
        payload: undefined
      })
      .toPass(isFSA)
    const errors = {
      foo: 'Foo error',
      bar: 'Error for bar'
    }
    expect(stopSubmit('myForm', errors))
      .toEqual({
        type: STOP_SUBMIT,
        meta: {
          form: 'myForm'
        },
        payload: errors,
        error: true
      })
      .toPass(isFSA)
  })

  it('should create setSubmitFailed action', () => {
    expect(setSubmitFailed('myForm'))
      .toEqual({
        type: SET_SUBMIT_FAILED,
        meta: {
          form: 'myForm',
          fields: []
        },
        error: true
      })
      .toPass(isFSA)
    expect(setSubmitFailed('myForm', 'a', 'b', 'c'))
      .toEqual({
        type: SET_SUBMIT_FAILED,
        meta: {
          form: 'myForm',
          fields: [ 'a', 'b', 'c' ]
        },
        error: true
      })
      .toPass(isFSA)
  })

  it('should create touch action', () => {
    expect(touch('myForm', 'foo', 'bar'))
      .toEqual({
        type: TOUCH,
        meta: {
          form: 'myForm',
          fields: [ 'foo', 'bar' ]
        }
      })
      .toPass(isFSA)
    expect(touch('myForm', 'cat', 'dog', 'pig'))
      .toEqual({
        type: TOUCH,
        meta: {
          form: 'myForm',
          fields: [ 'cat', 'dog', 'pig' ]
        }
      })
      .toPass(isFSA)
  })

  it('should create untouch action', () => {
    expect(untouch('myForm', 'foo', 'bar'))
      .toEqual({
        type: UNTOUCH,
        meta: {
          form: 'myForm',
          fields: [ 'foo', 'bar' ]
        }
      })
      .toPass(isFSA)
    expect(untouch('myForm', 'cat', 'dog', 'pig'))
      .toEqual({
        type: UNTOUCH,
        meta: {
          form: 'myForm',
          fields: [ 'cat', 'dog', 'pig' ]
        }
      })
      .toPass(isFSA)
  })
})
