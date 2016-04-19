import { blur, change } from '../actions'

const describeSyncErrors = (reducer, expect, { fromJS, getIn }) => () => {
  it('should validate on init with no state', () => {
    const errors = { bar: 'Required' }
    const state = reducer.validation({
      foo: () => errors
    })()
    expect(state).toEqualMap({
      foo: {
        syncErrors: errors
      }
    })
  })

  it('should validate on init with state', () => {
    const state = reducer.validation({
      foo: values => ({
        bar: `Was not expecting "${getIn(values, 'bar')}"`
      })
    })(fromJS({
      foo: {
        values: {
          bar: 'the Spanish Inquisition'
        }
      }
    }))
    expect(state).toEqualMap({
      foo: {
        values: {
          bar: 'the Spanish Inquisition'
        },
        syncErrors: {
          bar: 'Was not expecting "the Spanish Inquisition"'
        }
      }
    })
  })

  it('should call validate with {} when no values', () => {
    reducer.validation({
      foo: values => expect(values).toEqualMap({})
    })()
  })

  it('should validate on blur', () => {
    const validatingReducer = reducer.validation({
      foo: values => {
        const bar = getIn(values, 'bar')
        if (bar === undefined) {
          return { bar: 'Required' }
        }
        if (bar.length > 5) {
          return { bar: 'Too long' }
        }
        return {}
      }
    })

    const requiredState = validatingReducer()
    expect(requiredState).toEqualMap({
      foo: {
        syncErrors: {
          bar: 'Required'
        }
      }
    })

    const validState = validatingReducer(requiredState, {
      ...blur('dog'),
      form: 'foo',
      field: 'bar'
    })
    expect(validState).toEqualMap({
      foo: {
        values: {
          bar: 'dog'
        }
      }
    })

    const tooLongState = validatingReducer(validState, {
      ...blur('rabbit'),
      form: 'foo',
      field: 'bar'
    })
    expect(tooLongState).toEqualMap({
      foo: {
        values: {
          bar: 'rabbit'
        },
        syncErrors: {
          bar: 'Too long'
        }
      }
    })
  })

  it('should validate on change', () => {
    const validatingReducer = reducer.validation({
      foo: values => {
        const bar = getIn(values, 'bar')
        if (bar === undefined) {
          return { bar: 'Required' }
        }
        if (bar.length > 5) {
          return { bar: 'Too long' }
        }
        return {}
      }
    })

    const requiredState = validatingReducer()
    expect(requiredState).toEqualMap({
      foo: {
        syncErrors: {
          bar: 'Required'
        }
      }
    })

    const validState = validatingReducer(requiredState, {
      ...change('dog'),
      form: 'foo',
      field: 'bar'
    })
    expect(validState).toEqualMap({
      foo: {
        values: {
          bar: 'dog'
        }
      }
    })

    const tooLongState = validatingReducer(validState, {
      ...change('rabbit'),
      form: 'foo',
      field: 'bar'
    })
    expect(tooLongState).toEqualMap({
      foo: {
        values: {
          bar: 'rabbit'
        },
        syncErrors: {
          bar: 'Too long'
        }
      }
    })
  })

  it('should set sync error on nested fields', () => {
    const validatingReducer = reducer.validation({
      foo: values => {
        expect(values).toEqualMap({
          bar: {
            myField: 'dirtyValue',
            myOtherField: 'otherDirtyValue'
          }
        })
        return {
          bar: {
            myField: 'Error about myField',
            myOtherField: 'Error about myOtherField'
          }
        }
      }
    })
    const state = validatingReducer(fromJS({
      foo: {
        values: {
          bar: {
            myField: 'dirtyValue',
            myOtherField: 'otherDirtyValue'
          }
        },
        initial: {
          bar: {
            myField: 'initialValue',
            myOtherField: 'otherInitialValue'
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
    }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            bar: {
              myField: 'dirtyValue',
              myOtherField: 'otherDirtyValue'
            }
          },
          initial: {
            bar: {
              myField: 'initialValue',
              myOtherField: 'otherInitialValue'
            }
          },
          syncErrors: {
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

  it('should set sync errors on array fields', () => {
    const validatingReducer = reducer.validation({
      foo: values => {
        expect(values).toEqualMap({
          bar: [
            'dirtyValue',
            'otherDirtyValue'
          ]
        })
        return {
          bar: [
            'Error about myField',
            'Error about myOtherField'
          ]
        }
      }
    })
    const state = validatingReducer(fromJS({
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
    }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            bar: [ 'dirtyValue', 'otherDirtyValue' ]
          },
          initial: {
            bar: [ 'initialValue', 'otherInitialValue' ]
          },
          syncErrors: {
            bar: [
              'Error about myField',
              'Error about myOtherField'
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

  it('should allow multiple errors on same field', () => {
    const validatingReducer = reducer.validation({
      foo: values => {
        expect(values).toEqualMap({
          cat: 'Garfield',
          dog: 'Odie'
        })
        return {
          cat: [
            'Not funny',
            'Sleeps too much'
          ],
          dog: [
            'Unhelpful',
            'Not house trained'
          ]
        }
      }
    })
    const state = validatingReducer(fromJS({
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
        }
      }
    }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            cat: 'Garfield',
            dog: 'Odie'
          },
          syncErrors: {
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

  it('should unset field sync errors', () => {
    const validatingReducer = reducer.validation({
      foo: values => {
        expect(values).toEqualMap({
          bar: [ 'dirtyValue', 'otherDirtyValue' ]
        })
        return {}
      }
    })
    const state = validatingReducer(fromJS({
      foo: {
        values: {
          bar: [ 'dirtyValue', 'otherDirtyValue' ]
        },
        initial: {
          bar: [ 'initialValue', 'otherInitialValue' ]
        },
        syncErrors: {
          bar: [
            'sync error 1',
            'sync error 2'
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
    }))
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

  it('should unset global errors', () => {
    const validatingReducer = reducer.validation({
      foo: values => {
        expect(values).toEqualMap({ myField: 'myValue' })
        return {}
      }
    })
    const state = validatingReducer(fromJS({
      foo: {
        values: {
          myField: 'myValue'
        },
        fields: {
          myField: {
            touched: true
          }
        },
        error: 'Previous global error'
      }
    }))
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

  it('should set global error', () => {
    const validatingReducer = reducer.validation({
      foo: values => {
        expect(values).toEqualMap({ myField: 'value' })
        return {
          _error: 'This is a global error'
        }
      }
    })
    const state = validatingReducer(fromJS({
      foo: {
        values: {
          myField: 'value'
        },
        fields: {
          myField: {
            touched: true
          }
        }
      }
    }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'value'
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

export default describeSyncErrors
