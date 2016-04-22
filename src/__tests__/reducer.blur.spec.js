import { blur } from '../actions'

const describeBlur = (reducer, expect, { fromJS, setIn }) => () => {
  it('should set value on blur with empty state', () => {
    const state = reducer(undefined, {
      ...blur('myValue'),
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

  it('should set value on blur and touch with empty state', () => {
    const state = reducer(undefined, {
      ...blur('myValue'),
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

  it('should set value on blur and touch with initial value', () => {
    const state = reducer(fromJS({
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
    }), {
      ...blur('myValue'),
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

  it('should not modify value if undefined is passed on blur (for android react native)', () => {
    const state = reducer(fromJS({
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
    }), {
      ...blur(),
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

  it('should not modify value if undefined is passed on blur, even if no value existed (for android react native)', () => {
    const state = reducer(fromJS({
      foo: {
        fields: {
          myField: {
            active: true
          }
        },
        active: 'myField'
      }
    }), {
      ...blur(),
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

  it('should remove a value if on blur is set with \'\'', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        }
      }
    }), {
      ...blur(''),
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

  it('should remove nested value container if on blur clears all values', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          nested: {
            myField: 'initialValue'
          }
        }
      }
    }), {
      ...blur(''),
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

  it('should set nested value on blur', () => {
    const state = reducer(fromJS({
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
    }), {
      ...blur('hello'),
      form: 'foo',
      field: 'myField.mySubField',
      touch: true
    })
    expect(state)
      .toEqualMap({
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
    const state = reducer(fromJS({
      foo: {
        values: {
          myArray: []
        },
        fields: {
          myArray: [
            { active: true }
          ]
        },
        active: 'myArray[0]'
      }
    }), {
      ...blur('hello'),
      form: 'foo',
      field: 'myArray[0]',
      touch: true
    })
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myArray: [ 'hello' ]
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
    const state = reducer(fromJS({
      foo: {
        fields: {
          myComplexField: {
            active: true
          }
        },
        active: 'myComplexField'
      }
    }), {
      ...blur({ id: 42, name: 'Bobby' }),
      form: 'foo',
      field: 'myComplexField',
      touch: true
    })
    expect(state)
      .toEqualMap(setIn(fromJS({ // must use setIn to make sure complex value is js object
        foo: {
          anyTouched: true,
          fields: {
            myComplexField: {
              touched: true
            }
          }
        }
      }), 'foo.values.myComplexField', { id: 42, name: 'Bobby' }))
  })
}

export default describeBlur
