import { blur } from '../actions'

const describeBlur = (reducer, expect, { fromJS, setIn }) => () => {
  it('should touch on blur', () => {
    const state = reducer(undefined, blur('foo', 'myField', true))
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

  it('should touch on blur with initial value', () => {
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
    }), blur('foo', 'myField', true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'initialValue'
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
    }), blur('foo', 'myField', true))
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
    }), blur('foo', 'myField', true))
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

  it('should NOT remove active field if the blurred field is not active', () => {
    const state = reducer(fromJS({
      foo: {
        fields: {
          myField: {
            active: true
          },
          myOtherField: {}
        },
        active: 'myField'
      }
    }), blur('foo', 'myOtherField'))
    expect(state)
      .toEqualMap({
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
    const state = reducer(fromJS({
      foo: {
        values: {
          myArray: [ {} ]
        }
      }
    }), blur('foo', 'myArray[0].foo', true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myArray: [ {} ]
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
