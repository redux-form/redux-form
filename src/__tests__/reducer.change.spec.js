import { change } from '../actions'

const describeChange = (reducer, expect, { fromJS }) => () => {
  it('should set value on change with empty state', () => {
    const state = reducer(undefined, change('foo', 'myField', 'myValue'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'myValue'
          }
        }
      })
  })

  it('should set value on change and touch with empty state', () => {
    const state = reducer(undefined, change('foo', 'myField', 'myValue', true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'myValue'
          },
          fields: {
            myField: {
              touched: true
            }
          }
        }
      })
  })

  it('should set value on change and touch with initial value', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        },
        initial: {
          myField: 'initialValue'
        }
      }
    }), change('foo', 'myField', 'myValue', true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'myValue'
          },
          initial: {
            myField: 'initialValue'
          },
          fields: {
            myField: {
              touched: true
            }
          }
        }
      })
  })

  it('should remove a value if on change is set with \'\'', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        }
      }
    }), change('foo', 'myField', '', true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          fields: {
            myField: {
              touched: true
            }
          }
        }
      })
  })

  it('should NOT remove a value if on change is set with \'\' if it\'s an array field', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: [ 'initialValue' ]
        }
      }
    }), change('foo', 'myField[0]', '', true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: [ undefined ]
          },
          fields: {
            myField: [
              {
                touched: true
              }
            ]
          }
        }
      })
  })

  it('should remove nested value container if on change clears all values', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          nested: {
            myField: 'initialValue'
          }
        }
      }
    }), change('foo', 'nested.myField', '', true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          fields: {
            nested: {
              myField: {
                touched: true
              }
            }
          }
        }
      })
  })

  it('should not modify a value if called with undefined', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        }
      }
    }), change('foo', 'myField', undefined, true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'initialValue'
          },
          fields: {
            myField: {
              touched: true
            }
          }
        }
      })
  })

  it('should set value on change and remove field-level submit and async errors', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initial'
        },
        asyncErrors: {
          myField: 'async error'
        },
        submitErrors: {
          myField: 'submit error'
        },
        error: 'some global error'
      }
    }), change('foo', 'myField', 'different', false))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'different'
          },
          error: 'some global error' // unaffected by CHANGE
        }
      })
  })

  it('should set nested value on change with empty state', () => {
    const state = reducer(undefined, change('foo', 'myField.mySubField', 'myValue', false))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: {
              mySubField: 'myValue'
            }
          }
        }
      })
  })
}

export default describeChange
