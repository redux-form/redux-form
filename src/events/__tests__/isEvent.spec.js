import expect from 'expect'
import noop from 'lodash.noop'
import isEvent from '../isEvent'

describe('isEvent', () => {
  it('should return false if event is undefined', () => {
    expect(isEvent()).toBe(false)
  })

  it('should return false if event is null', () => {
    expect(isEvent(null)).toBe(false)
  })

  it('should return false if event is not an object', () => {
    expect(isEvent(42)).toBe(false)
    expect(isEvent(true)).toBe(false)
    expect(isEvent(false)).toBe(false)
    expect(isEvent('not an event')).toBe(false)
  })

  it('should return false if event has no stopPropagation', () => {
    expect(isEvent({
      preventDefault: noop
    })).toBe(false)
  })

  it('should return false if event has no preventDefault', () => {
    expect(isEvent({
      stopPropagation: noop
    })).toBe(false)
  })

  it('should return true if event has stopPropagation, and preventDefault', () => {
    expect(isEvent({
      stopPropagation: noop,
      preventDefault: noop
    })).toBe(true)
  })
})
