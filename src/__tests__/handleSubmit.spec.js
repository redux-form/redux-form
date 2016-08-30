import expect, { createSpy } from 'expect'
import handleSubmit from '../handleSubmit'
import SubmissionError from '../SubmissionError'
import { noop } from 'lodash'

describe('handleSubmit', () => {
  it('should stop if sync validation fails', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncValidate = createSpy()
    const props = { startSubmit, stopSubmit, touch, setSubmitFailed, setSubmitSucceeded, values }

    handleSubmit(submit, props, false, asyncValidate, [ 'foo', 'baz' ])

    expect(submit).toNotHaveBeenCalled()
    expect(startSubmit).toNotHaveBeenCalled()
    expect(stopSubmit).toNotHaveBeenCalled()
    expect(touch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'baz')
    expect(asyncValidate).toNotHaveBeenCalled()
    expect(setSubmitSucceeded).toNotHaveBeenCalled()
    expect(setSubmitFailed)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'baz')
  })

  it('should stop and return errors if sync validation fails', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const syncErrors = { foo: 'error' }
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncValidate = createSpy()
    const props = {
      startSubmit,
      stopSubmit,
      touch,
      setSubmitFailed, setSubmitSucceeded,
      syncErrors,
      values
    }

    const result = handleSubmit(submit, props, false, asyncValidate, [ 'foo', 'baz' ])

    expect(asyncValidate).toNotHaveBeenCalled()
    expect(submit).toNotHaveBeenCalled()
    expect(startSubmit).toNotHaveBeenCalled()
    expect(stopSubmit).toNotHaveBeenCalled()
    expect(touch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'baz')
    expect(setSubmitSucceeded).toNotHaveBeenCalled()
    expect(setSubmitFailed)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'baz')
    expect(result).toBe(syncErrors)
  })

  it('should return result of sync submit', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncValidate = undefined
    const props = { dispatch, startSubmit, stopSubmit, touch, setSubmitFailed, setSubmitSucceeded, values }

    expect(handleSubmit(submit, props, true, asyncValidate, [ 'foo', 'baz' ])).toBe(69)

    expect(submit)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(values, dispatch, props)
    expect(startSubmit).toNotHaveBeenCalled()
    expect(stopSubmit).toNotHaveBeenCalled()
    expect(touch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'baz')
    expect(setSubmitFailed).toNotHaveBeenCalled()
    expect(setSubmitSucceeded).toHaveBeenCalled()
  })

  it('should not submit if async validation fails', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.reject())
    const props = { dispatch, startSubmit, stopSubmit, touch, setSubmitFailed, setSubmitSucceeded, values }

    return handleSubmit(submit, props, true, asyncValidate, [ 'foo', 'baz' ])
      .catch(result => {
        expect(result).toBe(undefined)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit).toNotHaveBeenCalled()
        expect(startSubmit).toNotHaveBeenCalled()
        expect(stopSubmit).toNotHaveBeenCalled()
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith('foo', 'baz')
        expect(setSubmitSucceeded).toNotHaveBeenCalled()
        expect(setSubmitFailed)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith('foo', 'baz')
      })
  })

  it('should not submit if async validation fails and return rejected promise', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncErrors = { foo: 'async error' }
    const asyncValidate = createSpy().andReturn(Promise.reject(asyncErrors))
    const props = {
      dispatch, startSubmit, stopSubmit, touch, setSubmitFailed, setSubmitSucceeded, values
    }

    return handleSubmit(submit, props, true, asyncValidate, [ 'foo', 'baz' ])
      .catch(result => {
        expect(result).toBe(asyncErrors)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit).toNotHaveBeenCalled()
        expect(startSubmit).toNotHaveBeenCalled()
        expect(stopSubmit).toNotHaveBeenCalled()
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith('foo', 'baz')
        expect(setSubmitSucceeded).toNotHaveBeenCalled()
        expect(setSubmitFailed)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith('foo', 'baz')
      })
  })

  it('should sync submit if async validation passes', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.resolve())
    const props = { dispatch, startSubmit, stopSubmit, touch, setSubmitFailed, setSubmitSucceeded, values }

    return handleSubmit(submit, props, true, asyncValidate, [ 'foo', 'baz' ])
      .then(result => {
        expect(result).toBe(69)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch, props)
        expect(startSubmit).toNotHaveBeenCalled()
        expect(stopSubmit).toNotHaveBeenCalled()
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith('foo', 'baz')
        expect(setSubmitFailed).toNotHaveBeenCalled()
        expect(setSubmitSucceeded).toHaveBeenCalled()
      })
  })

  it('should async submit if async validation passes', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(Promise.resolve(69))
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.resolve())
    const props = { dispatch, startSubmit, stopSubmit, touch, setSubmitFailed, setSubmitSucceeded, values }

    return handleSubmit(submit, props, true, asyncValidate, [ 'foo', 'baz' ])
      .then(result => {
        expect(result).toBe(69)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch, props)
        expect(startSubmit)
          .toHaveBeenCalled()
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith('foo', 'baz')
        expect(setSubmitFailed)
          .toNotHaveBeenCalled()
        expect(setSubmitSucceeded)
          .toHaveBeenCalled()
      })
  })

  it('should set submit errors if async submit fails', () => {
    const values = { foo: 'bar', baz: 42 }
    const submitErrors = { foo: 'submit error' }
    const submit = createSpy().andReturn(Promise.reject(new SubmissionError(submitErrors)))
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.resolve())
    const props = { dispatch, startSubmit, stopSubmit, touch, setSubmitFailed, setSubmitSucceeded, values }

    return handleSubmit(submit, props, true, asyncValidate, [ 'foo', 'baz' ])
      .then(error => {
        expect(error).toBe(submitErrors)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch, props)
        expect(startSubmit)
          .toHaveBeenCalled()
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(submitErrors)
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith('foo', 'baz')
        expect(setSubmitFailed)
          .toHaveBeenCalled()
        expect(setSubmitSucceeded)
          .toNotHaveBeenCalled()
      })
  })

  it('should not set errors if rejected value not a SubmissionError', () => {
    const values = { foo: 'bar', baz: 42 }
    const submitErrors = { foo: 'submit error' }
    const submit = createSpy().andReturn(Promise.reject(submitErrors))
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.resolve())
    const props = { dispatch, startSubmit, stopSubmit, touch, setSubmitFailed, setSubmitSucceeded, values }

    return handleSubmit(submit, props, true, asyncValidate, [ 'foo', 'baz' ])
      .then(result => {
        expect(result).toBe(undefined)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch, props)
        expect(startSubmit)
          .toHaveBeenCalled()
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(undefined)  // not wrapped in SubmissionError
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith('foo', 'baz')
        expect(setSubmitFailed)
          .toHaveBeenCalled()
        expect(setSubmitSucceeded)
          .toNotHaveBeenCalled()
      })
  })

  it('should set submit errors if async submit fails and return rejected promise', () => {
    const values = { foo: 'bar', baz: 42 }
    const submitErrors = { foo: 'submit error' }
    const submit = createSpy().andReturn(Promise.reject(new SubmissionError(submitErrors)))
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const touch = createSpy()
    const setSubmitFailed = createSpy()
    const setSubmitSucceeded = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.resolve())
    const props = {
      dispatch, startSubmit, stopSubmit, touch, setSubmitFailed, setSubmitSucceeded, values
    }

    return handleSubmit(submit, props, true, asyncValidate, [ 'foo', 'baz' ])
      .then(error => {
        expect(error).toBe(submitErrors)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch, props)
        expect(startSubmit)
          .toHaveBeenCalled()
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(submitErrors)
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith('foo', 'baz')
        expect(setSubmitFailed).toHaveBeenCalled()
        expect(setSubmitSucceeded).toNotHaveBeenCalled()
      })
  })
})
