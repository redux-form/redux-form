import expect, { createSpy } from 'expect'
import noop from '../../util/noop'
import createOnBlur from '../createOnBlur'

describe('createOnBlur', () => {
  it('should return a function', () => {
    expect(createOnBlur())
      .toExist()
      .toBeA('function')
  })

  it('should return a function that calls blur with name and value', () => {
    const blur = createSpy()
    createOnBlur(blur)('bar')
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
  })

  it('should return a function that calls blur with name and value from event', () => {
    const blur = createSpy()
    createOnBlur(blur)({
      target: {
        value: 'bar'
      },
      preventDefault: noop,
      stopPropagation: noop
    })
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
  })

  it('should return a function that calls blur and then afterBlur with name and value', () => {
    const blur = createSpy()
    const afterBlur = createSpy()
    createOnBlur(blur, afterBlur)('bar')
    expect(blur).toHaveBeenCalled()
    expect(afterBlur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
  })

})
