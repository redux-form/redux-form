import expect, { createSpy } from 'expect'
import { noop } from 'lodash'
import createOnBlur from '../createOnBlur'

const prepend = value => `normalized-${value}`

describe('createOnBlur', () => {
  it('should return a function', () => {
    expect(createOnBlur())
      .toExist()
      .toBeA('function')
  })

  it('should return a function that calls blur with name and value', () => {
    const blur = createSpy()
    const normalize = createSpy(prepend).andCallThrough()
    createOnBlur(blur, normalize)('bar')
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('normalized-bar')
  })

  it('should return a function that calls blur with name and value from event', () => {
    const blur = createSpy()
    const normalize = createSpy(prepend).andCallThrough()
    createOnBlur(blur, normalize)({
      target: {
        value: 'bar'
      },
      preventDefault: noop,
      stopPropagation: noop
    })
    expect(normalize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar')
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('normalized-bar')
  })

  it('should return a function that calls blur and then afterBlur with name and value', () => {
    const blur = createSpy()
    const normalize = createSpy(prepend).andCallThrough()
    const afterBlur = createSpy()
    createOnBlur(blur, normalize, afterBlur)('bar')
    expect(blur).toHaveBeenCalled()
    expect(normalize).toHaveBeenCalled()
    expect(afterBlur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('normalized-bar')
  })
})
