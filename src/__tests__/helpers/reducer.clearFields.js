import actions from '../../actions'
const { clearFields } = actions

const describeClearFields = (reducer, expect, { fromJS }) => () => {
  it('should clear fields value, touched, submitErrors', () => {
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
          asyncErrors: {
            myField: 'async error',
            myOtherField: 'async error'
          },
          submitErrors: {
            myField: 'submit error',
            myOtherField: 'submit error'
          },
          fields: {
            myField: {
              touched: true
            },
            myOtherField: {
              touched: true
            }
          },
          error: 'some global error',
          anyTouched: true
        }
      }),
      clearFields('foo', false, false, 'myField', 'myOtherField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { type: 'Field', name: 'myField' },
          myOtherField: { type: 'Field', name: 'myOtherField' }
        },
        fields: {
          myField: {},
          myOtherField: {}
        },
        error: 'some global error'
      }
    })
  })
  it('should clear fields value, touched, but NOT submitErrors', () => {
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
          asyncErrors: {
            myField: 'async error',
            myOtherField: 'async error'
          },
          submitErrors: {
            myField: 'submit error',
            myOtherField: 'submit error'
          },
          fields: {
            myField: {
              touched: true
            },
            myOtherField: {
              touched: true
            }
          },
          anyTouched: true,
          error: 'some global error'
        }
      }),
      clearFields('foo', false, true, 'myField', 'myOtherField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { type: 'Field', name: 'myField' },
          myOtherField: { type: 'Field', name: 'myOtherField' }
        },
        fields: {
          myField: {},
          myOtherField: {}
        },
        submitErrors: {
          myField: 'submit error',
          myOtherField: 'submit error'
        },
        error: 'some global error'
      }
    })
  })
  it('should clear fields values and keep touched', () => {
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
      clearFields('foo', true, false, 'myField', 'myOtherField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { type: 'Field', name: 'myField' },
          myOtherField: { type: 'Field', name: 'myOtherField' }
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
    })
  })

  it('should only clear fields values and touched', () => {
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
      clearFields('foo', false, false, 'myField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { type: 'Field', name: 'myField' },
          myOtherField: { type: 'Field', name: 'myOtherField' }
        },
        values: {
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

  it('should only clear fields values and keep touched', () => {
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
      clearFields('foo', true, false, 'myField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { type: 'Field', name: 'myField' },
          myOtherField: { type: 'Field', name: 'myOtherField' }
        },
        values: {
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
    })
  })

  it('should NOT remove field-level submit errors and global errors if persistentSubmitErrors is enabled', () => {
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
          asyncErrors: {
            myField: 'async error',
            myOtherField: 'async error'
          },
          submitErrors: {
            myField: 'submit error',
            myOtherField: 'submit error'
          },
          fields: {
            myField: {
              touched: true
            },
            myOtherField: {
              touched: true
            }
          },
          error: 'some global error',
          anyTouched: true
        }
      }),
      clearFields('foo', true, true, 'myField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          myField: { type: 'Field', name: 'myField' },
          myOtherField: { type: 'Field', name: 'myOtherField' }
        },
        values: {
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
        asyncErrors: {
          myOtherField: 'async error'
        },
        submitErrors: {
          myField: 'submit error',
          myOtherField: 'submit error'
        },
        error: 'some global error',
        anyTouched: true
      }
    })
  })

  it('should reset deep fields as touched and remove values on clearFields', () => {
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
      clearFields('foo', false, false, 'deep.myField', 'deep.myOtherField')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          'deep.myField': { type: 'Field', name: 'deep.myField' },
          'deep.myOtherField': { type: 'Field', name: 'deep.myOtherField' }
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

  it('should reset array fields as touched and clear values on clearFields', () => {
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
      clearFields('foo', false, false, 'myFields[0]', 'myFields[1]')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: {
          'myFields[0]': { type: 'Field', name: 'myFields[0]' },
          'myFields[1]': { type: 'Field', name: 'myFields[1]' }
        },
        values: {
          myFields: [undefined, undefined]
        },
        fields: {
          myFields: [{}, {}]
        }
      }
    })
  })
}

export default describeClearFields
