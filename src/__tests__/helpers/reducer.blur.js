import actions from '../../actions'
const { blur } = actions

const describeBlur = (reducer, expect, { fromJS, setIn }) => () => {
  it('should set value on blur with empty state', () => {
    const state = reducer(undefined, blur('foo', 'myField', 'myValue'))
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'myValue'
        }
      }
    })
  })

  it('should set value on blur and touch with empty state', () => {
    const state = reducer(undefined, blur('foo', 'myField', 'myValue', true))
    expect(state).toEqualMap({
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

  it('should set value on blur and touch with initial value', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'initialValue'
          },
          initial: {
            myField: 'initialValue'
          },
          fields: {
            myField: {
              active: true
            }
          },
          active: 'myField'
        }
      }),
      blur('foo', 'myField', 'myValue', true)
    )
    expect(state).toEqualMap({
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

  it('should not modify value if undefined is passed on blur (for android react native)', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'myValue'
          },
          initial: {
            myField: 'initialValue'
          },
          fields: {
            myField: {
              active: true
            }
          },
          active: 'myField'
        }
      }),
      blur('foo', 'myField', undefined, true)
    )
    expect(state).toEqualMap({
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

  it('should not modify value if undefined is passed on blur, even if no value existed (for android react native)', () => {
    const state = reducer(
      fromJS({
        foo: {
          fields: {
            myField: {
              active: true
            }
          },
          active: 'myField'
        }
      }),
      blur('foo', 'myField', undefined, true)
    )
    expect(state).toEqualMap({
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

  it("should remove a value if on blur is set with ''", () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'initialValue'
          }
        }
      }),
      blur('foo', 'myField', '', true)
    )
    expect(state).toEqualMap({
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

  it("should allow setting an initialized field to ''", () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'initialValue'
          },
          initial: {
            myField: 'initialValue'
          }
        }
      }),
      blur('foo', 'myField', '', true)
    )
    expect(state).toEqualMap({
      foo: {
        anyTouched: true,
        values: {
          myField: ''
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

  it("should NOT remove a value if on blur is set with '' if it's an array field", () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: ['initialValue']
          }
        }
      }),
      blur('foo', 'myField[0]', '', true)
    )
    expect(state).toEqualMap({
      foo: {
        anyTouched: true,
        values: {
          myField: [undefined]
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

  it('should remove nested value container if on blur clears all values', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            nested: {
              myField: 'initialValue'
            }
          }
        }
      }),
      blur('foo', 'nested.myField', '', true)
    )
    expect(state).toEqualMap({
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

  it('should set nested value on blur', () => {
    const state = reducer(
      fromJS({
        foo: {
          fields: {
            myField: {
              mySubField: {
                active: true
              }
            }
          },
          active: 'myField.mySubField'
        }
      }),
      blur('foo', 'myField.mySubField', 'hello', true)
    )
    expect(state).toEqualMap({
      foo: {
        anyTouched: true,
        values: {
          myField: {
            mySubField: 'hello'
          }
        },
        fields: {
          myField: {
            mySubField: {
              touched: true
            }
          }
        }
      }
    })
  })

  it('should set array value on blur', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myArray: []
          },
          fields: {
            myArray: [{ active: true }]
          },
          active: 'myArray[0]'
        }
      }),
      blur('foo', 'myArray[0]', 'hello', true)
    )
    expect(state).toEqualMap({
      foo: {
        anyTouched: true,
        values: {
          myArray: ['hello']
        },
        fields: {
          myArray: [
            {
              touched: true
            }
          ]
        }
      }
    })
  })

  it('should set complex value on blur', () => {
    const state = reducer(
      fromJS({
        foo: {
          fields: {
            myComplexField: {
              active: true
            }
          },
          active: 'myComplexField'
        }
      }),
      blur('foo', 'myComplexField', { id: 42, name: 'Bobby' }, true)
    )
    expect(state).toEqualMap(
      setIn(
        fromJS({
          // must use setIn to make sure complex value is js object
          foo: {
            anyTouched: true,
            fields: {
              myComplexField: {
                touched: true
              }
            }
          }
        }),
        'foo.values.myComplexField',
        { id: 42, name: 'Bobby' }
      )
    )
  })

  it('should NOT remove active field if the blurred field is not active', () => {
    const state = reducer(
      fromJS({
        foo: {
          fields: {
            myField: {
              active: true
            },
            myOtherField: {}
          },
          active: 'myField'
        }
      }),
      blur('foo', 'myOtherField')
    )
    expect(state).toEqualMap({
      foo: {
        fields: {
          myField: {
            active: true
          },
          myOtherField: {}
        },
        active: 'myField'
      }
    })
  })

  it('should NOT destroy an empty array field object on blur', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myArray: [{}]
          }
        }
      }),
      blur('foo', 'myArray[0].foo', '', true)
    )
    expect(state).toEqualMap({
      foo: {
        anyTouched: true,
        values: {
          myArray: [{}]
        },
        fields: {
          myArray: [
            {
              foo: {
                touched: true
              }
            }
          ]
        }
      }
    })
  })
}

export default describeBlur
