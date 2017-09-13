import * as mocks from '../eventMocks'

describe('#eventMocks', () => {
  it('should create a mock with identity functions', () => {
    const event = mocks.valueMock('value')

    expect(typeof event.preventDefault).toBe('function')
    expect(typeof event.stopPropagation).toBe('function')
    expect(event.preventDefault('id')).toEqual('id')
    expect(event.stopPropagation('id')).toEqual('id')
  })

  it('should create a value mock', () => {
    const event = mocks.valueMock('value')

    expect(event.target.value).toEqual('value')
  })

  it('should create a drag start mock', () => {
    const fn = id => id
    const event = mocks.dragStartMock(fn)

    expect(event.dataTransfer.setData).toBe(fn)
  })

  it('should create a drop mock', () => {
    const fn = id => id
    const event = mocks.dropMock(fn)

    expect(event.dataTransfer.getData).toBe(fn)
  })
})
