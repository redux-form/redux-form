import onChangeValue from '../onChangeValue'
import { valueMock } from '../../util/eventMocks'

const name = 'sampleField'

describe('onChangeValue', () => {
  it('should parse the value before returning', () => {
    const parse = jest.fn(value => `parsed-${value}`)
    const value = onChangeValue(valueMock('bar'), { name, parse })
    expect(parse).toHaveBeenCalledWith('bar', name)
    expect(value).toBe('parsed-bar')
  })

  it('should normalize the value before returning', () => {
    const normalize = jest.fn(
      (_, value) => `normalized-${value}`
    )
    const value = onChangeValue(valueMock('bar'), { name, normalize })
    expect(normalize).toHaveBeenCalledWith(name, 'bar')
    expect(value).toBe('normalized-bar')
  })

  it('should parse before normalize', () => {
    const parse = jest.fn(value => `parsed-${value}`)
    const normalize = jest.fn(
      (_, value) => `normalized-${value}`
    )
    const value = onChangeValue(valueMock('bar'), { name, normalize, parse })
    expect(parse).toHaveBeenCalledWith('bar', name)
    expect(normalize).toHaveBeenCalled();
    expect(normalize).toHaveBeenCalledWith(name, 'parsed-bar');
    expect(value).toBe('normalized-parsed-bar')
  })
})
