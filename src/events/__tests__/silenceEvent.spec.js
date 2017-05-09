import expect, {createSpy} from 'expect'
import {noop} from 'lodash'
import silenceEvent from '../silenceEvent'

describe('silenceEvent', () => {
  it('should return false if not an event', () => {
    expect(silenceEvent(undefined)).toBe(false)
    expect(silenceEvent(null)).toBe(false)
    expect(silenceEvent(true)).toBe(false)
    expect(silenceEvent(42)).toBe(false)
    expect(silenceEvent({})).toBe(false)
    expect(silenceEvent([])).toBe(false)
    expect(silenceEvent(noop)).toBe(false)
  })

  it('should return true if an event', () => {
    expect(
      silenceEvent({
        preventDefault: noop,
        stopPropagation: noop
      })
    ).toBe(true)
  })

  it('should call preventDefault and stopPropagation', () => {
    const preventDefault = createSpy()
    const stopPropagation = createSpy()

    silenceEvent({
      preventDefault,
      stopPropagation
    })
    expect(preventDefault).toHaveBeenCalled()
    expect(stopPropagation).toNotHaveBeenCalled()
  })
})
