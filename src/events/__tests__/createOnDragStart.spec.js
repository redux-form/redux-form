import expect, { createSpy } from 'expect'
import createOnDragStart, { dataKey } from '../createOnDragStart'

describe('createOnDragStart', () => {
  it('should return a function', () => {
    expect(createOnDragStart())
      .toExist()
      .toBeA('function')
  })

  it('should return a function that calls dataTransfer.setData with key and result from value', () => {
    const setData = createSpy()
    createOnDragStart('foo', 'bar')({
      dataTransfer: { setData }
    })
    expect(setData)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(dataKey, 'bar')
  })

})
