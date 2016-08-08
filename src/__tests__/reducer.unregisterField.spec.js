import { unregisterField } from '../actions'

const describeUnregisterField = (reducer, expect, { fromJS }) => () => {
  it('should remove a field from registeredFields', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [ { name: 'bar', type: 'field' } ]
      }
    }), unregisterField('foo', 'bar'))
    expect(state)
      .toEqualMap({
        foo: {}
      })
  })

  it('should do nothing if there are no registered fields', () => {
    const initialState = fromJS({
      foo: {}
    })
    const state = reducer(initialState, unregisterField('foo', 'bar'))
    expect(state)
      .toEqual(initialState)
  })
  
  it('should do nothing if the field is not registered', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [ 
          { name: 'bar', type: 'field' }
        ]
      }
    }), unregisterField('foo', 'baz'))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [ { name: 'bar', type: 'field' } ]
        }
      })
  })
}

export default describeUnregisterField
