import { registerField } from '../actions'

const describeRegisterField = (reducer, expect, { fromJS }) => () => {
  it('should create registeredFields if it does not exist and a field', () => {
    const state = reducer(
      fromJS({
        foo: {}
      }),
      registerField('foo', 'bar', 'Field')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: { bar: { name: 'bar', type: 'Field', count: 1 } }
      }
    })
  })

  it('should add a field to registeredFields', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            baz: { name: 'baz', type: 'FieldArray', count: 1 }
          }
        }
      }),
      registerField('foo', 'bar', 'Field')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          baz: { name: 'baz', type: 'FieldArray', count: 1 },
          bar: { name: 'bar', type: 'Field', count: 1 }
        }
      }
    })
  })

  it('should increase count if the field already exists', () => {
    const initialState = fromJS({
      foo: {
        registeredFields: { bar: { name: 'bar', type: 'Field', count: 1 } }
      }
    })
    const state = reducer(initialState, registerField('foo', 'bar', 'Field'))
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          bar: { name: 'bar', type: 'Field', count: 2 }
        }
      }
    })
  })
}

export default describeRegisterField
