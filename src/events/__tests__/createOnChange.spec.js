import expect, { createSpy } from 'expect'
import createOnChange from '../createOnChange'

describe('createOnChange', () => {
  it('should return a function', () => {
    expect(createOnChange())
      .toExist()
      .toBeA('function')
  })

  it('should return a function that calls change with name and value', () => {
    const change = createSpy()
    const normalize = createSpy(value => `normalized-${value}`).andCallThrough()
    createOnChange(change, normalize)('bar')
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(change)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('normalized-bar')
  })
})
