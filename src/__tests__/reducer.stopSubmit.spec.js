import {stopSubmit} from '../actions'

const describeStopSubmit = (reducer, expect, {fromJS}) => () => {
  it('should unset submitting on stopSubmit', () => {
    const state = reducer(
      fromJS({
        foo: {
          doesnt: 'matter',
          should: 'notchange',
          submitting: true
        }
      }),
      stopSubmit('foo')
    )
    expect(state).toEqualMap({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitSucceeded: true
      }
    })
  })

  it('should set submitError on nested fields on stopSubmit', () => {
    const state = reducer(
      fromJS({
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
          },
          submitting: true
        }
      }),
      stopSubmit('foo', {
        bar: {
          myField: 'Error about myField',
          myOtherField: 'Error about myOtherField'
        }
      })
    )
    expect(state).toEqualMap({
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
        submitErrors: {
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
        },
        submitFailed: true
      }
    })
  })

  it('should set submitError on array fields on stopSubmit', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            bar: ['dirtyValue', 'otherDirtyValue']
          },
          initial: {
            bar: ['initialValue', 'otherInitialValue']
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
          submitting: true
        }
      }),
      stopSubmit('foo', {
        bar: ['Error about myField', 'Error about myOtherField']
      })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          bar: ['dirtyValue', 'otherDirtyValue']
        },
        initial: {
          bar: ['initialValue', 'otherInitialValue']
        },
        submitErrors: {
          bar: ['Error about myField', 'Error about myOtherField']
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
        submitFailed: true
      }
    })
  })

  it('should allow multiple errors on same field', () => {
    const state = reducer(
      fromJS({
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
          submitting: true
        }
      }),
      stopSubmit('foo', {
        cat: ['Not funny', 'Sleeps too much'],
        dog: ['Unhelpful', 'Not house trained']
      })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          cat: 'Garfield',
          dog: 'Odie'
        },
        submitErrors: {
          cat: ['Not funny', 'Sleeps too much'],
          dog: ['Unhelpful', 'Not house trained']
        },
        fields: {
          cat: {
            touched: true
          },
          dog: {
            touched: true
          }
        },
        submitFailed: true
      }
    })
  })

  it('should unset field submit errors on stopSubmit with no errors', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            bar: ['dirtyValue', 'otherDirtyValue']
          },
          initial: {
            bar: ['initialValue', 'otherInitialValue']
          },
          submitErrors: {
            bar: ['submit error 1', 'submit error 2']
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
          submitting: true
        }
      }),
      stopSubmit('foo')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          bar: ['dirtyValue', 'otherDirtyValue']
        },
        initial: {
          bar: ['initialValue', 'otherInitialValue']
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
        submitSucceeded: true
      }
    })
  })

  it('should unset field submit errors on stopSubmit with global errors', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'myValue'
          },
          submitErrors: {
            myField: 'some submit error'
          },
          fields: {
            myField: {
              touched: true
            }
          },
          submitting: true
        }
      }),
      stopSubmit('foo', {_error: 'some global error'})
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'myValue'
        },
        fields: {
          myField: {
            touched: true
          }
        },
        error: 'some global error',
        submitFailed: true
      }
    })
  })

  it('should unset global errors on stopSubmit with no errors', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'myValue'
          },
          fields: {
            myField: {
              touched: true
            }
          },
          submitting: true,
          error: 'Previous global error'
        }
      }),
      stopSubmit('foo')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'myValue'
        },
        fields: {
          myField: {
            touched: true
          }
        },
        submitSucceeded: true
      }
    })
  })

  it('should unset global errors on stopSubmit with field errors', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'myValue'
          },
          fields: {
            myField: {
              touched: true
            }
          },
          submitting: true,
          error: 'some global error'
        }
      }),
      stopSubmit('foo', {myField: 'some submit error'})
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'myValue'
        },
        submitErrors: {
          myField: 'some submit error'
        },
        fields: {
          myField: {
            touched: true
          }
        },
        submitFailed: true
      }
    })
  })

  it('should unset submitFailed and set submitSucceeded on stopSubmit with no errors', () => {
    const state = reducer(
      fromJS({
        foo: {
          doesnt: 'matter',
          should: 'notchange',
          submitting: true,
          submitFailed: true
        }
      }),
      stopSubmit('foo')
    )
    expect(state).toEqualMap({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitSucceeded: true
      }
    })
  })

  it('should unset submitting and set submit errors on stopSubmit', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'dirtyValue',
            myOtherField: 'otherDirtyValue'
          },
          initial: {
            myField: 'initialValue',
            myOtherField: 'otherInitialValue'
          },
          fields: {
            myField: {
              touched: true
            },
            myOtherField: {
              touched: true
            }
          },
          submitting: true
        }
      }),
      stopSubmit('foo', {
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'dirtyValue',
          myOtherField: 'otherDirtyValue'
        },
        initial: {
          myField: 'initialValue',
          myOtherField: 'otherInitialValue'
        },
        submitErrors: {
          myField: 'Error about myField',
          myOtherField: 'Error about myOtherField'
        },
        fields: {
          myField: {
            touched: true
          },
          myOtherField: {
            touched: true
          }
        },
        submitFailed: true
      }
    })
  })

  it('should unset submitting and set submit global error on stopSubmit', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'value'
          },
          fields: {
            myField: {
              touched: true
            }
          },
          submitting: true
        }
      }),
      stopSubmit('foo', {
        _error: 'This is a global error'
      })
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'value'
        },
        fields: {
          myField: {
            touched: true
          }
        },
        error: 'This is a global error',
        submitFailed: true
      }
    })
  })
}

export default describeStopSubmit
