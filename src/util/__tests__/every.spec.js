import expect, { createSpy } from 'expect'
import every from '../every'

describe('every', () => {
  it('should return true when given undefined', () => {
    const spy = createSpy()
    expect(every(undefined)).toBe(true)
    expect(spy).toNotHaveBeenCalled()
  })

  it('should return true when given an empty array', () => {
    const spy = createSpy()
    expect(every([])).toBe(true)
    expect(spy).toNotHaveBeenCalled()
  })

  it('should return true when given an empty object', () => {
    const spy = createSpy()
    expect(every({})).toBe(true)
    expect(spy).toNotHaveBeenCalled()
  })

  it('should return false not every array element fails', () => {
    const spy = createSpy(value => value === 'a').andCallThrough()
    expect(every([ 'a', 'b' ], spy)).toBe(false)
    expect(spy).toHaveBeenCalled()
    expect(spy.calls.length).toBe(2)
    expect(spy.calls[ 0 ].arguments).toEqual([ 'a', 0, [ 'a', 'b' ] ])
    expect(spy.calls[ 1 ].arguments).toEqual([ 'b', 1, [ 'a', 'b' ] ])
  })

  it('should return true every array element passes', () => {
    const spy = createSpy(value => value < 'c').andCallThrough()
    expect(every([ 'a', 'b' ], spy)).toBe(true)
    expect(spy).toHaveBeenCalled()
    expect(spy.calls.length).toBe(2)
    expect(spy.calls[ 0 ].arguments).toEqual([ 'a', 0, [ 'a', 'b' ] ])
    expect(spy.calls[ 1 ].arguments).toEqual([ 'b', 1, [ 'a', 'b' ] ])
  })

  it('should short circuit', () => {
    const spy = createSpy(value => value === 'a').andCallThrough()
    expect(every([ 'a', 'b', 'c' ], spy)).toBe(false)
    expect(spy).toHaveBeenCalled()
    expect(spy.calls.length).toBe(2)
    expect(spy.calls[ 0 ].arguments).toEqual([ 'a', 0, [ 'a', 'b', 'c' ] ])
    expect(spy.calls[ 1 ].arguments).toEqual([ 'b', 1, [ 'a', 'b', 'c' ] ])
  })

  it('should return false not every object element fails', () => {
    const spy = createSpy(value => value === 42).andCallThrough()
    expect(every({ a: 42, b: 43 }, spy)).toBe(false)
    expect(spy).toHaveBeenCalled()
    expect(spy.calls.length).toBe(2)
    expect(spy.calls[ 0 ].arguments).toEqual([ 42, 'a', { a: 42, b: 43 } ])
    expect(spy.calls[ 1 ].arguments).toEqual([ 43, 'b', { a: 42, b: 43 } ])
  })

  it('should return true every object element passes', () => {
    const spy = createSpy(value => value < 44).andCallThrough()
    expect(every({ a: 42, b: 43 }, spy)).toBe(true)
    expect(spy).toHaveBeenCalled()
    expect(spy.calls.length).toBe(2)
    expect(spy.calls[ 0 ].arguments).toEqual([ 42, 'a', { a: 42, b: 43 } ])
    expect(spy.calls[ 1 ].arguments).toEqual([ 43, 'b', { a: 42, b: 43 } ])
  })
})
