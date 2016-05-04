import expect, { createSpy } from 'expect'
import createInsert from '../insert'

describe('arrays.insert', () => {
  it('should insert with empty array', () => {
    const arraySplice = createSpy()
    const insert = createInsert(arraySplice)
    expect(insert).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(insert(1, 'foo')).toNotExist()
    expect(arraySplice)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(1, 0, 'foo')
  })

  it('should insert with non-empty array', () => {
    const arraySplice = createSpy()
    const insert = createInsert(arraySplice)
    expect(insert).toBeA('function')
    expect(arraySplice).toNotHaveBeenCalled()
    expect(insert(2, 'bar')).toNotExist()
    expect(arraySplice)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(2, 0, 'bar')
  })
})
