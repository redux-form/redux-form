import { stopAsyncValidation } from '../actions'

const describeStopAsyncValidation = (reducer, expect, { fromJS }) => () => {
  it('should set asyncError on nested fields on stopAsyncValidation', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          bar: {
            myField: 'dirtyValue',
            myOtherField: 'otherDirtyValue'
          }
        },
        fields: {
          bar: {
            myField: {
              touched: true
            },
            myOtherField: {
              touched: true
            }
          }
        },
        asyncValidating: true
      }
    }), {
      ...stopAsyncValidation({
        bar: {
          myField: 'Error about myField',
          myOtherField: 'Error about myOtherField'
        }
      }),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            bar: {
              myField: 'dirtyValue',
              myOtherField: 'otherDirtyValue'
            }
          },
          asyncErrors: {
            bar: {
              myField: 'Error about myField',
              myOtherField: 'Error about myOtherField'
            }
          },
          fields: {
            bar: {
              myField: {
                touched: true
              },
              myOtherField: {
                touched: true
              }
            }
          }
        }
      })
  })

  it('should set asyncError on array fields on stopAsyncValidation', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          bar: [ 'dirtyValue', 'otherDirtyValue' ]
        },
        initial: {
          bar: [ 'initialValue', 'otherInitialValue' ]
        },
        fields: {
          bar: [
            {
              touched: true
            },
            {
              touched: true
            }
          ]
        },
        asyncValidating: true
      }
    }), {
      ...stopAsyncValidation({
        bar: [
          'async error 1',
          'async error 2'
        ]
      }),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            bar: [ 'dirtyValue', 'otherDirtyValue' ]
          },
          initial: {
            bar: [ 'initialValue', 'otherInitialValue' ]
          },
          asyncErrors: {
            bar: [
              'async error 1',
              'async error 2'
            ]
          },
          fields: {
            bar: [
              {
                touched: true
              },
              {
                touched: true
              }
            ]
          }
        }
      })
  })

  it('should unset field async errors on stopAsyncValidation', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          bar: [ 'dirtyValue', 'otherDirtyValue' ]
        },
        initial: {
          bar: [ 'initialValue', 'otherInitialValue' ]
        },
        asyncErrors: {
          bar: [
            'async error 1',
            'async error 2'
          ]
        },
        fields: {
          bar: [
            {
              touched: true
            },
            {
              touched: true
            }
          ]
        },
        asyncValidating: true
      }
    }), {
      ...stopAsyncValidation(),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            bar: [ 'dirtyValue', 'otherDirtyValue' ]
          },
          initial: {
            bar: [ 'initialValue', 'otherInitialValue' ]
          },
          fields: {
            bar: [
              {
                touched: true
              },
              {
                touched: true
              }
            ]
          }
        }
      })
  })

  it('should allow multiple errors on same field', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          cat: 'Garfield',
          dog: 'Odie'
        },
        fields: {
          cat: {
            touched: true
          },
          dog: {
            touched: true
          }
        },
        asyncValidating: true
      }
    }), {
      ...stopAsyncValidation({
        cat: [
          'Not funny',
          'Sleeps too much'
        ],
        dog: [
          'Unhelpful',
          'Not house trained'
        ]
      }),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            cat: 'Garfield',
            dog: 'Odie'
          },
          asyncErrors: {
            cat: [
              'Not funny',
              'Sleeps too much'
            ],
            dog: [
              'Unhelpful',
              'Not house trained'
            ]
          },
          fields: {
            cat: {
              touched: true
            },
            dog: {
              touched: true
            }
          }
        }
      })
  })

  it('should unset global errors on stopAsyncValidation', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'myValue'
        },
        fields: {
          myField: {
            touched: true
          }
        },
        asyncValidating: true,
        error: 'Previous global error'
      }
    }), {
      ...stopAsyncValidation(),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
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

  it('should unset asyncValidating on stopAsyncValidation and set global error', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'myValue'
        },
        fields: {
          myField: {
            touched: true
          }
        },
        asyncValidating: true
      }
    }), {
      ...stopAsyncValidation({
        _error: 'This is a global error'
      }),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'myValue'
          },
          fields: {
            myField: {
              touched: true
            }
          },
          error: 'This is a global error'
        }
      })
  })
}

export default describeStopAsyncValidation
