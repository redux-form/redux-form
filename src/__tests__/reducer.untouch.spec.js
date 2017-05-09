import { untouch } from '../actions'

const describeUntouch = (reducer, expect, { fromJS }) => () => {
  it('should unmark fields as touched on untouch', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            myField: { type: 'Field', name: 'myField' },
            myOtherField: { type: 'Field', name: 'myOtherField' }
          },
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          },
          fields: {
            myField: {
              touched: true
            },
            myOtherField: {
              touched: true
            }
          },
          anyTouched: true
        }
      }),
      untouch('foo', 'myField', 'myOtherField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { type: 'Field', name: 'myField' },
          myOtherField: { type: 'Field', name: 'myOtherField' }
        },
        values: {
          myField: 'value',
          myOtherField: 'otherValue'
        },
        fields: {
          myField: {},
          myOtherField: {}
        }
      }
    })
  })

  it('should only unmark anyTouched if all fields are now untouched', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            myField: { type: 'Field', name: 'myField' },
            myOtherField: { type: 'Field', name: 'myOtherField' }
          },
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          },
          fields: {
            myField: {
              touched: true
            },
            myOtherField: {
              touched: true
            }
          },
          anyTouched: true
        }
      }),
      untouch('foo', 'myField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { type: 'Field', name: 'myField' },
          myOtherField: { type: 'Field', name: 'myOtherField' }
        },
        values: {
          myField: 'value',
          myOtherField: 'otherValue'
        },
        fields: {
          myField: {},
          myOtherField: {
            touched: true
          }
        },
        anyTouched: true
      }
    })
  })

  it('should unmark deep fields as touched on untouch', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            'deep.myField': { type: 'Field', name: 'deep.myField' },
            'deep.myOtherField': { type: 'Field', name: 'deep.myOtherField' }
          },
          values: {
            deep: {
              myField: 'value',
              myOtherField: 'otherValue'
            }
          },
          fields: {
            deep: {
              myField: {
                touched: true
              },
              myOtherField: {
                touched: true
              }
            }
          },
          anyTouched: true
        }
      }),
      untouch('foo', 'deep.myField', 'deep.myOtherField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          'deep.myField': { type: 'Field', name: 'deep.myField' },
          'deep.myOtherField': { type: 'Field', name: 'deep.myOtherField' }
        },
        values: {
          deep: {
            myField: 'value',
            myOtherField: 'otherValue'
          }
        },
        fields: {
          deep: {
            myField: {},
            myOtherField: {}
          }
        }
      }
    })
  })

  it('should unmark array fields as touched on untouch', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: {
            'myFields[0]': { type: 'Field', name: 'myFields[0]' },
            'myFields[1]': { type: 'Field', name: 'myFields[1]' }
          },
          values: {
            myFields: ['value', 'otherValue']
          },
          fields: {
            myFields: [{ touched: true }, { touched: true }]
          },
          anyTouched: true
        }
      }),
      untouch('foo', 'myFields[0]', 'myFields[1]')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          'myFields[0]': { type: 'Field', name: 'myFields[0]' },
          'myFields[1]': { type: 'Field', name: 'myFields[1]' }
        },
        values: {
          myFields: ['value', 'otherValue']
        },
        fields: {
          myFields: [{}, {}]
        }
      }
    })
  })
}

export default describeUntouch
