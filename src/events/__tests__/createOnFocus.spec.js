import expect, { createSpy } from 'expect'
import createOnFocus from '../createOnFocus'

describe('createOnFocus', () => {
  it('should return a function', () => {
    expect(createOnFocus())
      .toExist()
      .toBeA('function')
  })

  it('should return a function that calls focus with name', () => {
    const focus = createSpy()
    createOnFocus('foo', focus)()
    expect(focus)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo')
  })

})
