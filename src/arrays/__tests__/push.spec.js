import expect, { createSpy } from 'expect'
import createPush from '../push'

describe('arrays.push', () => {
  it('should push with empty array', () => {
    const arraySplice = createSpy()
    const push = createPush(0, arraySplice)
    expect(push).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(push('foo')).toNotExist()
    expect(arraySplice)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(0, 0, 'foo')
  })

  it('should push with non-empty array', () => {
    const arraySplice = createSpy()
    const push = createPush(3, arraySplice)
    expect(push).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(push('bar')).toNotExist()
    expect(arraySplice)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(3, 0, 'bar')
  })

  it('should default to null', () => {
    const arraySplice = createSpy()
    const push = createPush(3, arraySplice)
    expect(push).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(push()).toNotExist()
    expect(arraySplice)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(3, 0, null)
  })
})
