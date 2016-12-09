import expect, { createSpy } from 'expect'
import onChangeValue from '../onChangeValue'
import { valueMock } from '../../util/eventMocks'

const name = 'sampleField'

describe('onChangeValue', () => {
  it('should parse the value before returning', () => {
    const parse = createSpy((value) => `parsed-${value}`).andCallThrough()
    const value = onChangeValue(valueMock('bar'), { name, parse })
    expect(parse)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar', name)
    expect(value)
      .toBe('parsed-bar')
  })

  it('should normalize the value before returning', () => {
    const normalize = createSpy((_, value) => `normalized-${value}`).andCallThrough()
    const value = onChangeValue(valueMock('bar'), { name, normalize })
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(name, 'bar')
    expect(value)
      .toBe('normalized-bar')
  })

  it('should parse before normalize', () => {
    const parse = createSpy((value) => `parsed-${value}`).andCallThrough()
    const normalize = createSpy((_, value) => `normalized-${value}`).andCallThrough()
    const value = onChangeValue(valueMock('bar'), { name, normalize, parse })
    expect(parse)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar', name)
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(name, 'parsed-bar')
    expect(value)
      .toBe('normalized-parsed-bar')
  })
})
