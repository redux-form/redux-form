import expect, { createSpy } from 'expect'
import createPop from '../pop'
import plain from '../../structure/plain'

const { getIn } = plain

describe('arrays.pop', () => {
  it('should do nothing with undefined', () => {
    const arraySplice = createSpy()
    const getInSpy = createSpy(getIn).andCallThrough()
    const pop = createPop(undefined, 0, getInSpy, arraySplice)
    expect(pop).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(getInSpy).toNotHaveBeenCalled()
    expect(pop('foo')).toNotExist()
    expect(arraySplice).toNotHaveBeenCalled()
    expect(getInSpy).toNotHaveBeenCalled()
  })

  it('should do nothing with empty array', () => {
    const arraySplice = createSpy()
    const getInSpy = createSpy(getIn).andCallThrough()
    const pop = createPop([], 0, getInSpy, arraySplice)
    expect(pop).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(getInSpy).toNotHaveBeenCalled()
    expect(pop('foo')).toNotExist()
    expect(arraySplice).toNotHaveBeenCalled()
    expect(getInSpy).toNotHaveBeenCalled()
  })

  it('should pop with non-empty array', () => {
    const arraySplice = createSpy()
    const getInSpy = createSpy(getIn).andCallThrough()
    const pop = createPop([ 'a', 'b', 'c' ], 3, getInSpy, arraySplice)
    expect(pop).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(getInSpy).toNotHaveBeenCalled()
    expect(pop()).toBe('c')
    expect(arraySplice)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(2, 1)
    expect(getInSpy)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith([ 'a', 'b', 'c' ], 2)
  })
})
