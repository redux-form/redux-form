import expect, { createSpy } from 'expect'
import createShift from '../shift'
import plain from '../../structure/plain'

const { getIn } = plain

describe('arrays.shift', () => {
  it('should do nothing with undefined array', () => {
    const arraySplice = createSpy()
    const getInSpy = createSpy(getIn).andCallThrough()
    const shift = createShift(undefined, 0, getInSpy, arraySplice)
    expect(shift).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(getInSpy).toNotHaveBeenCalled()
    expect(shift('foo')).toNotExist()
    expect(arraySplice).toNotHaveBeenCalled()
    expect(getInSpy).toNotHaveBeenCalled()
  })

  it('should do nothing with empty array', () => {
    const arraySplice = createSpy()
    const getInSpy = createSpy(getIn).andCallThrough()
    const shift = createShift([], 0, getInSpy, arraySplice)
    expect(shift).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(getInSpy).toNotHaveBeenCalled()
    expect(shift('foo')).toNotExist()
    expect(arraySplice).toNotHaveBeenCalled()
    expect(getInSpy).toNotHaveBeenCalled()
  })

  it('should shift with non-empty array', () => {
    const arraySplice = createSpy()
    const getInSpy = createSpy(getIn).andCallThrough()
    const shift = createShift([ 'a', 'b', 'c' ], 3, getInSpy, arraySplice)
    expect(shift).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(shift()).toBe('a')
    expect(arraySplice)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(0, 1)
    expect(getInSpy)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith([ 'a', 'b', 'c' ], 0)
  })
})
