import { registerField } from '../actions'

const describeRegisterField = (reducer, expect, { fromJS }) => () => {
  it('should create registeredFields if it does not exist and a field', () => {
    const state = reducer(fromJS({
      foo: {}
    }), registerField('foo', 'bar', 'Field' ))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [ { name: 'bar', type: 'Field' } ]
        }
      })
  })

  it('should add a field to registeredFields', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [ { name: 'baz', type: 'FieldArray' } ]
      }
    }), registerField('foo', 'bar', 'Field' ))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'baz', type: 'FieldArray' },
            { name: 'bar', type: 'Field' }
          ]
        }
      })
  })

  it('should remove count if the field is not destroyed on unmount', () => {
    const initialState = fromJS({
      foo: {
        registeredFields: [ { name: 'bar', type: 'Field', count: 0 } ]
      }
    })
    const state = reducer(initialState, registerField('foo', 'bar', 'Field'))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'bar', type: 'Field' }
          ]
        }
      })
  })

  it('should increase count if the field already exists', () => {
    const initialState = fromJS({
      foo: {
        registeredFields: [ { name: 'bar', type: 'Field' } ]
      }
    })
    const state = reducer(initialState, registerField('foo', 'bar', 'Field'))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'bar', type: 'Field', count: 2 }
          ]
        }
      })
  })

  it('should increase count if the field is registered multiple times', () => {
    const initialState = fromJS({
      foo: {
        registeredFields: [ { name: 'bar', type: 'Field', count: 7 } ]
      }
    })
    const state = reducer(initialState, registerField('foo', 'bar', 'Field' ))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'bar', type: 'Field', count: 8 }
          ]
        }
      })
  })
}

export default describeRegisterField
