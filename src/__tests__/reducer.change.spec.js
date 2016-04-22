import { change } from '../actions'

const describeChange = (reducer, expect, { fromJS }) => () => {
  it('should set value on change with empty state', () => {
    const state = reducer(undefined, {
      ...change('myValue'),
      form: 'foo',
      field: 'myField'
    })
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
    const state = reducer(undefined, {
      ...change('myValue'),
      form: 'foo',
      field: 'myField',
      touch: true
    })
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
    }), {
      ...change('myValue'),
      form: 'foo',
      field: 'myField',
      touch: true
    })
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
    }), {
      ...change(''),
      form: 'foo',
      field: 'myField',
      touch: true
    })
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

  it('should remove nested value container if on change clears all values', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          nested: {
            myField: 'initialValue'
          }
        }
      }
    }), {
      ...change(''),
      form: 'foo',
      field: 'nested.myField',
      touch: true
    })
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
    }), {
      ...change(undefined),
      form: 'foo',
      field: 'myField',
      touch: true
    })
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
    }), {
      ...change('different'),
      form: 'foo',
      field: 'myField'
    })
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
    const state = reducer(undefined, {
      ...change('myValue'),
      form: 'foo',
      field: 'myField.mySubField'
    })
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
