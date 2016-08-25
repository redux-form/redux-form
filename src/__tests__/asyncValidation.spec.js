import expect, { createSpy } from 'expect'
import isPromise from 'is-promise'
import { noop } from 'lodash'
import asyncValidation from '../asyncValidation'

describe('asyncValidation', () => {
  const field = 'myField'

  it('should throw an error if fn does not return a promise', () => {
    const fn = noop
    const start = noop
    const stop = noop
    expect(() => asyncValidation(fn, start, stop, field))
      .toThrow(/promise/)
  })

  it('should return a promise', () => {
    const fn = () => Promise.resolve()
    const start = noop
    const stop = noop
    expect(isPromise(asyncValidation(fn, start, stop, field))).toBe(true)
  })

  it('should call start, fn, and stop on promise resolve', () => {
    const fn = createSpy().andReturn(Promise.resolve())
    const start = createSpy()
    const stop = createSpy()
    const promise = asyncValidation(fn, start, stop, field)
    expect(fn).toHaveBeenCalled()
    expect(start)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(field)
    return promise.then(() => {
      expect(stop).toHaveBeenCalled()
    })
  })

  it('should throw when promise rejected with no errors', () => {
    const fn = createSpy().andReturn(Promise.reject())
    const start = createSpy()
    const stop = createSpy()
    const promise = asyncValidation(fn, start, stop, field)
    expect(fn).toHaveBeenCalled()
    expect(start)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(field)
    return promise.catch(() => {
      expect(stop).toHaveBeenCalled()
    })
  })

  it('should call start, fn, and stop on promise reject', () => {
    const errors = { foo: 'error' }
    const fn = createSpy().andReturn(Promise.reject(errors))
    const start = createSpy()
    const stop = createSpy()
    const promise = asyncValidation(fn, start, stop, field)
    expect(fn).toHaveBeenCalled()
    expect(start)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(field)
    return promise.catch(() => {
      expect(stop)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(errors)
    })
  })
})
