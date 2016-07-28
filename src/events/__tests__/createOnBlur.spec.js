import expect, { createSpy } from 'expect'
import createOnBlur from '../createOnBlur'

describe('createOnBlur', () => {
  it('should return a function', () => {
    expect(createOnBlur())
      .toExist()
      .toBeA('function')
  })

  it('should parse the value before dispatching action', () => {
    const blur = createSpy()
    const parse = createSpy(value => `parsed-${value}`).andCallThrough()
    createOnBlur(blur, { parse })('bar')
    expect(parse)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('parsed-bar')
  })
  
  it('should normalize the value before dispatching action', () => {
    const blur = createSpy()
    const normalize = createSpy(value => `normalized-${value}`).andCallThrough()
    createOnBlur(blur, { normalize })('bar')
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('normalized-bar')
  })
    
  it('should parse before normalize', () => {
    const blur = createSpy()
    const parse = createSpy(value => `parsed-${value}`).andCallThrough()
    const normalize = createSpy(value => `normalized-${value}`).andCallThrough()
    createOnBlur(blur, { normalize, parse })('bar')
    expect(parse)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('parsed-bar')
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('normalized-parsed-bar')
  })
  
  it('should call blur then after', () => {
    const blur = createSpy()
    const parse = createSpy(value => `parsed-${value}`).andCallThrough()
    const normalize = createSpy(value => `normalized-${value}`).andCallThrough()
    const after = createSpy()
    createOnBlur(blur, { parse, normalize, after })('bar')
    expect(blur).toHaveBeenCalled()
    expect(normalize).toHaveBeenCalled()
    expect(after)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('normalized-parsed-bar')
  })
})
