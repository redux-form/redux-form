import expect, { createSpy } from 'expect'
import onChangeValue from '../onChangeValue'

const makeEvent = value => ({
  preventDefault: id => id,
  stopPropagation: id => id,
  target: { value }
})

describe('onChangeValue', () => {
  it('should parse the value before returning', () => {
    const parse = createSpy(value => `parsed-${value}`).andCallThrough()
    const value = onChangeValue(makeEvent('bar'), { parse })
    expect(parse)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(value)
      .toBe('parsed-bar')
  })

  it('should normalize the value before returning', () => {
    const normalize = createSpy(value => `normalized-${value}`).andCallThrough()
    const value = onChangeValue(makeEvent('bar'), { normalize })
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(value)
      .toBe('normalized-bar')
  })

  it('should parse before normalize', () => {
    const parse = createSpy(value => `parsed-${value}`).andCallThrough()
    const normalize = createSpy(value => `normalized-${value}`).andCallThrough()
    const value = onChangeValue(makeEvent('bar'), { normalize, parse })
    expect(parse)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('parsed-bar')
    expect(value)
      .toBe('normalized-parsed-bar')
  })
})
