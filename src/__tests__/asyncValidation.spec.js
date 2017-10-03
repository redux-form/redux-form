import isPromise from 'is-promise'
import { noop } from 'lodash'
import asyncValidation from '../asyncValidation'

describe('asyncValidation', () => {
  const field = 'myField'

  it('should throw an error if fn does not return a promise', () => {
    const fn = noop
    const start = noop
    const stop = noop
    expect(() => asyncValidation(fn, start, stop, field)).toThrow(/promise/)
  })

  it('should return a promise', () => {
    const fn = () => Promise.resolve()
    const start = noop
    const stop = noop
    expect(isPromise(asyncValidation(fn, start, stop, field))).toBe(true)
  })

  it('should call start, fn, and stop on promise resolve', () => {
    const fn = jest.fn().mockImplementation(() => Promise.resolve())
    const start = jest.fn()
    const stop = jest.fn()
    const promise = asyncValidation(fn, start, stop, field)
    expect(fn).toHaveBeenCalled()
    expect(start).toHaveBeenCalledWith(field)
    return promise.then(() => {
      expect(stop).toHaveBeenCalled()
    })
  })

  it('should throw when promise rejected with no errors', () => {
    const fn = jest.fn().mockImplementation(() => Promise.reject())
    const start = jest.fn()
    const stop = jest.fn()
    const promise = asyncValidation(fn, start, stop, field)
    expect(fn).toHaveBeenCalled()
    expect(start).toHaveBeenCalledWith(field)
    return promise.catch(() => {
      expect(stop).toHaveBeenCalled()
    })
  })

  it('should call start, fn, and stop on promise reject', () => {
    const errors = { foo: 'error' }
    const fn = jest.fn().mockImplementation(() => Promise.reject(errors))
    const start = jest.fn()
    const stop = jest.fn()
    const promise = asyncValidation(fn, start, stop, field)
    expect(fn).toHaveBeenCalled()
    expect(start).toHaveBeenCalledWith(field)
    return promise.catch(() => {
      expect(stop).toHaveBeenCalledWith(errors)
    })
  })
})
