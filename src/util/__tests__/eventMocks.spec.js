import expect from 'expect'
import * as mocks from '../eventMocks'

describe('#eventMocks', () => {
  it('should create a mock with identity functions', () => {
    const event = mocks.valueMock('value')

    expect(event.preventDefault).toBeA('function')
    expect(event.stopPropagation).toBeA('function')
    expect(event.preventDefault('id')).toEqual('id')
    expect(event.stopPropagation('id')).toEqual('id')
  })

  it('should create a value mock', () => {
    const event = mocks.valueMock('value')

    expect(event.target.value).toEqual('value')
  })
})
