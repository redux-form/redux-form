import actions from '../../actions'
const { arrayRemoveAll } = actions

const describeArrayRemoveAll = (reducer, expect, { fromJS }) => () => {
  it('should do nothing with undefined', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: {}
          },
          fields: {
            myField: {}
          }
        }
      }),
      arrayRemoveAll('foo', 'myField.subField')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {}
        },
        fields: {
          myField: {}
        }
      }
    })
  })

  it('should do nothing if already empty', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: {
              subField: []
            }
          },
          fields: {
            myField: {
              subField: []
            }
          }
        }
      }),
      arrayRemoveAll('foo', 'myField.subField')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: []
          }
        },
        fields: {
          myField: {
            subField: []
          }
        }
      }
    })
  })

  it('should remove all the elements', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: {
              subField: ['a', 'b', 'c', 'd']
            }
          },
          fields: {
            myField: {
              subField: [
                { touched: true, visited: true },
                { touched: true },
                { touched: true, visited: true },
                { touched: true }
              ]
            }
          }
        }
      }),
      arrayRemoveAll('foo', 'myField.subField', 1)
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: []
          }
        },
        fields: {
          myField: {
            subField: []
          }
        }
      }
    })
  })
}

export default describeArrayRemoveAll
