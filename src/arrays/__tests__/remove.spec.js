import expect, { createSpy } from 'expect'
import createRemove from '../remove'

describe('arrays.remove', () => {
  it('should remove', () => {
    const arraySplice = createSpy()
    const remove = createRemove(arraySplice)
    expect(remove).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(remove(2)).toNotExist()
    expect(arraySplice)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(2, 1)
  })
})
