import expect, { createSpy } from 'expect'
import isPromise from 'is-promise'
import handleSubmit from '../handleSubmit'
import SubmissionError from '../SubmissionError'
import noop from 'lodash.noop'

describe('handleSubmit', () => {
  it('should stop if sync validation fails', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const submitFailed = createSpy()
    const asyncValidate = createSpy()
    const props = { startSubmit, stopSubmit, submitFailed, values }

    handleSubmit(submit, props, false, asyncValidate)

    expect(submit).toNotHaveBeenCalled()
    expect(startSubmit).toNotHaveBeenCalled()
    expect(stopSubmit).toNotHaveBeenCalled()
    expect(asyncValidate).toNotHaveBeenCalled()
    expect(submitFailed).toHaveBeenCalled()
  })

  it('should stop and return rejected promise if sync validation fails and returnRejectedSubmitPromise', (done) => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const syncErrors = { foo: 'error' }
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const submitFailed = createSpy()
    const asyncValidate = createSpy()
    const props = {
      returnRejectedSubmitPromise: true,
      startSubmit,
      stopSubmit,
      submitFailed,
      syncErrors,
      values
    }

    const result = handleSubmit(submit, props, false, asyncValidate)
    expect(isPromise(result)).toBe(true)

    expect(asyncValidate).toNotHaveBeenCalled()
    expect(submit).toNotHaveBeenCalled()
    expect(startSubmit).toNotHaveBeenCalled()
    expect(stopSubmit).toNotHaveBeenCalled()
    expect(submitFailed).toHaveBeenCalled()
    result.then(() => {
      expect(false).toBe(true) // should not be in resolve branch
    }, (error) => {
      expect(error).toBe(syncErrors)
      done()
    })
  })

  it('should return result of sync submit', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const submitFailed = createSpy()
    const asyncValidate = undefined
    const props = { dispatch, startSubmit, stopSubmit, submitFailed, values }

    expect(handleSubmit(submit, props, true, asyncValidate)).toBe(69)

    expect(submit)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(values, dispatch)
    expect(startSubmit).toNotHaveBeenCalled()
    expect(stopSubmit).toNotHaveBeenCalled()
    expect(submitFailed).toNotHaveBeenCalled()
  })

  it('should not submit if async validation fails', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const submitFailed = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.reject())
    const props = { dispatch, startSubmit, stopSubmit, submitFailed, values }

    return handleSubmit(submit, props, true, asyncValidate)
      .then(result => {
        expect(result).toBe(undefined)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit).toNotHaveBeenCalled()
        expect(startSubmit).toNotHaveBeenCalled()
        expect(stopSubmit).toNotHaveBeenCalled()
        expect(submitFailed).toHaveBeenCalled()
      }, () => {
        expect(false).toBe(true) // should not get into reject branch
      })
  })

  it('should not submit if async validation fails and return rejected promise', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const submitFailed = createSpy()
    const asyncErrors = { foo: 'async error' }
    const asyncValidate = createSpy().andReturn(Promise.reject(asyncErrors))
    const props = {
      dispatch, startSubmit, stopSubmit, submitFailed, values,
      returnRejectedSubmitPromise: true
    }

    return handleSubmit(submit, props, true, asyncValidate)
      .then(() => {
        expect(false).toBe(true) // should not get into resolve branch
      }, result => {
        expect(result).toBe(asyncErrors)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit).toNotHaveBeenCalled()
        expect(startSubmit).toNotHaveBeenCalled()
        expect(stopSubmit).toNotHaveBeenCalled()
        expect(submitFailed).toHaveBeenCalled()
      })
  })

  it('should sync submit if async validation passes', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(69)
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const submitFailed = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.resolve())
    const props = { dispatch, startSubmit, stopSubmit, submitFailed, values }

    return handleSubmit(submit, props, true, asyncValidate)
      .then(result => {
        expect(result).toBe(69)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch)
        expect(startSubmit).toNotHaveBeenCalled()
        expect(stopSubmit).toNotHaveBeenCalled()
        expect(submitFailed).toNotHaveBeenCalled()
      }, () => {
        expect(false).toBe(true) // should not get into reject branch
      })
  })

  it('should async submit if async validation passes', () => {
    const values = { foo: 'bar', baz: 42 }
    const submit = createSpy().andReturn(Promise.resolve(69))
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const submitFailed = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.resolve())
    const props = { dispatch, startSubmit, stopSubmit, submitFailed, values }

    return handleSubmit(submit, props, true, asyncValidate)
      .then(result => {
        expect(result).toBe(69)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch)
        expect(startSubmit).toHaveBeenCalled()
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submitFailed).toNotHaveBeenCalled()
      }, () => {
        expect(false).toBe(true) // should not get into reject branch
      })
  })

  it('should set submit errors if async submit fails', () => {
    const values = { foo: 'bar', baz: 42 }
    const submitErrors = { foo: 'submit error' }
    const submit = createSpy().andReturn(Promise.reject(new SubmissionError(submitErrors)))
    const dispatch = noop
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const submitFailed = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.resolve())
    const props = { dispatch, startSubmit, stopSubmit, submitFailed, values }

    return handleSubmit(submit, props, true, asyncValidate)
      .then(result => {
        expect(result).toBe(undefined)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch)
        expect(startSubmit).toHaveBeenCalled()
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(submitErrors)
        expect(submitFailed).toNotHaveBeenCalled()
      }, () => {
        expect(false).toBe(true) // should not get into reject branch
      })
  })

  it('should set submit errors if async submit fails and return rejected promise', () => {
    const values = { foo: 'bar', baz: 42 }
    const submitErrors = { foo: 'submit error' }
    const submit = createSpy().andReturn(Promise.reject(new SubmissionError(submitErrors)))
    const dispatch = () => null
    const startSubmit = createSpy()
    const stopSubmit = createSpy()
    const submitFailed = createSpy()
    const asyncValidate = createSpy().andReturn(Promise.resolve())
    const props = {
      dispatch, startSubmit, stopSubmit, submitFailed, values,
      returnRejectedSubmitPromise: true
    }

    return handleSubmit(submit, props, true, asyncValidate)
      .then(() => {
        expect(false).toBe(true) // should not get into resolve branch
      }, result => {
        expect(result instanceof SubmissionError).toBe(true)
        expect(result.errors).toBe(submitErrors)
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith()
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch)
        expect(startSubmit).toHaveBeenCalled()
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(submitErrors)
        expect(submitFailed).toNotHaveBeenCalled()
      })
  })
})
