import expect, { createSpy } from 'expect'
import createUnshift from '../unshift'

describe('arrays.unshift', () => {
  it('should unshift', () => {
    const arraySplice = createSpy()
    const unshift = createUnshift(arraySplice)
    expect(unshift).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(unshift('foo')).toNotExist()
    expect(arraySplice)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(0, 0, 'foo')
  })
})
