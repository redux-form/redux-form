import actions from '../../actions'
const { resetSection } = actions

const describeReset = (reducer, expect, { fromJS }) => () => {
  it("should reset section values on reset on with previous state and don't affect to other fields", () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'dirtyValue',
            myOtherField: 'otherDirtyValue',
            mySection: {
              mySectionField: 'dirtyValue',
              mySectionOtherField: 'otherDirtyValue'
            }
          },
          initial: {
            myField: 'initialValue',
            myOtherField: 'otherInitialValue',
            mySection: {
              mySectionField: 'initialValue',
              mySectionOtherField: 'otherInitialValue'
            }
          },
          fields: {
            myField: {
              touched: true
            },
            myOtherField: {
              touched: true
            },
            mySection: {
              mySectionField: {
                touched: true
              },
              mySectionOtherField: {
                touched: true
              }
            }
          }
        }
      }),
      resetSection('foo', 'mySection')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'dirtyValue',
          myOtherField: 'otherDirtyValue',
          mySection: {
            mySectionField: 'initialValue',
            mySectionOtherField: 'otherInitialValue'
          }
        },
        initial: {
          myField: 'initialValue',
          myOtherField: 'otherInitialValue',
          mySection: {
            mySectionField: 'initialValue',
            mySectionOtherField: 'otherInitialValue'
          }
        },
        fields: {
          myField: {
            touched: true
          },
          myOtherField: {
            touched: true
          }
        }
      }
    })
  })

  it('should reset deep values on reset on with previous state', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            mySection: {
              deepField: {
                myField: 'dirtyValue',
                myOtherField: 'otherDirtyValue'
              }
            }
          },
          initial: {
            mySection: {
              deepField: {
                myField: 'initialValue',
                myOtherField: 'otherInitialValue'
              }
            }
          },
          fields: {
            mySection: {
              deepField: {
                myField: {
                  touched: true
                },
                myOtherField: {
                  touched: true
                }
              }
            }
          },
          anyTouched: true
        }
      }),
      resetSection('foo', 'mySection')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          mySection: {
            deepField: {
              myField: 'initialValue',
              myOtherField: 'otherInitialValue'
            }
          }
        },
        initial: {
          mySection: {
            deepField: {
              myField: 'initialValue',
              myOtherField: 'otherInitialValue'
            }
          }
        }
      }
    })
  })

  it('should erase values if reset called with no initial values', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            mySection: {
              myField: 'bar'
            },
            myOtherSection: {
              myOtherField: 'foo'
            }
          },
          fields: {
            mySection: {
              myField: {
                touched: true
              }
            }
          }
        }
      }),
      resetSection('foo', 'mySection', 'myOtherSection')
    )
    expect(state).toEqualMap({
      foo: {}
    })
  })

  it('should erase values and clear errors', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            mySection: {
              myField: 'bar'
            },
            myOtherSection: {
              myOtherField: 'foo'
            },
            foo: null
          },
          asyncErrors: {
            mySection: {
              myField: 'async error'
            },
            myOtherSection: {
              myOtherField: 'async error'
            },
            foo: 'async error'
          },
          submitErrors: {
            mySection: {
              myField: 'submit error'
            },
            myOtherSection: {
              myOtherField: 'submit error'
            },
            foo: 'submit error'
          },
          fields: {
            mySection: {
              myField: {
                touched: true
              }
            }
          }
        }
      }),
      resetSection('foo', 'mySection', 'myOtherSection')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          foo: null
        },
        asyncErrors: {
          foo: 'async error'
        },
        submitErrors: {
          foo: 'submit error'
        }
      }
    })
  })

  it('should not destroy registered fields', () => {
    const state = reducer(
      fromJS({
        foo: {
          registeredFields: [
            { name: 'foo', type: 'Field' },
            { name: 'mySection.username', type: 'Field' },
            { name: 'mySection.password', type: 'Field' }
          ],
          values: {
            mySection: {
              username: 'value'
            }
          },
          fields: {
            mySection: {
              username: {
                touched: true
              }
            }
          }
        }
      }),
      resetSection('foo', 'mySection')
    )
    expect(state).toEqualMap({
      foo: {
        registeredFields: [
          { name: 'foo', type: 'Field' },
          { name: 'mySection.username', type: 'Field' },
          { name: 'mySection.password', type: 'Field' }
        ]
      }
    })
  })
}

export default describeReset
