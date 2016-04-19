import { stopSubmit } from '../actions'

const describeStopSubmit = (reducer, expect, { fromJS }) => () => {
  it('should unset submitting on stopSubmit', () => {
    const state = reducer(fromJS({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitting: true
      }
    }), {
      ...stopSubmit(),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          doesnt: 'matter',
          should: 'notchange'
        }
      })
  })

  it('should set submitError on nested fields on stopSubmit', () => {
    const state = reducer(fromJS({
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
    }), {
      ...stopSubmit({
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
        submitting: true
      }
    }), {
      ...stopSubmit({
        bar: [
          'Error about myField',
          'Error about myOtherField'
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
          submitErrors: {
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
          },
          submitFailed: true
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
        submitting: true
      }
    }), {
      ...stopSubmit({
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
          submitErrors: {
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
          },
          submitFailed: true
        }
      })
  })

  it('should unset field submit errors on stopSubmit', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          bar: [ 'dirtyValue', 'otherDirtyValue' ]
        },
        initial: {
          bar: [ 'initialValue', 'otherInitialValue' ]
        },
        submitErrors: {
          bar: [
            'submit error 1',
            'submit error 2'
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
        submitting: true
      }
    }), {
      ...stopSubmit(),
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

  it('should unset global errors on stopSubmit', () => {
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
        submitting: true,
        error: 'Previous global error'
      }
    }), {
      ...stopSubmit(),
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

  it('should unset submitFailed on stopSubmit with no errors', () => {
    const state = reducer(fromJS({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitting: true,
        submitFailed: true
      }
    }), {
      ...stopSubmit(),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          doesnt: 'matter',
          should: 'notchange'
        }
      })
  })

  it('should unset submitting and set submit errors on stopSubmit', () => {
    const state = reducer(fromJS({
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
    }), {
      ...stopSubmit({
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      }),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
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
    const state = reducer(fromJS({
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
    }), {
      ...stopSubmit({
        _error: 'This is a global error'
      }),
      form: 'foo'
    })
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
          error: 'This is a global error',
          submitFailed: true
        }
      })
  })
}

export default describeStopSubmit
