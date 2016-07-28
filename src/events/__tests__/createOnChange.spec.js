import expect, { createSpy } from 'expect'
import createOnChange from '../createOnChange'

describe('createOnChange', () => {
  it('should return a function', () => {
    expect(createOnChange())
      .toExist()
      .toBeA('function')
  })

  it('should parse the value before dispatching action', () => {
    const change = createSpy()
    const parse = createSpy(value => `parsed-${value}`).andCallThrough()
    createOnChange(change, { parse })('bar')
    expect(parse)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(change)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('parsed-bar')
  })

  it('should normalize the value before dispatching action', () => {
    const change = createSpy()
    const normalize = createSpy(value => `normalized-${value}`).andCallThrough()
    createOnChange(change, { normalize })('bar')
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(change)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('normalized-bar')
  })

  it('should parse before normalize', () => {
    const change = createSpy()
    const parse = createSpy(value => `parsed-${value}`).andCallThrough()
    const normalize = createSpy(value => `normalized-${value}`).andCallThrough()
    createOnChange(change, { normalize, parse })('bar')
    expect(parse)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('parsed-bar')
    expect(change)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('normalized-parsed-bar')
  })
})
