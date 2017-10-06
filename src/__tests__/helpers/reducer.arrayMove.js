import actions from '../../actions'
const { arrayMove } = actions

const describeArrayMove = (reducer, expect, { fromJS }) => () => {
  it('should do nothing with empty state', () => {
    const state = reducer(undefined, arrayMove('foo', 'myField', 0, 1))
    expect(state).toEqualMap({
      foo: {}
    })
  })

  it('should move values and field state', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: {
              subField: ['a', 'b', 'c']
            }
          },
          fields: {
            myField: {
              subField: [
                { touched: true },
                { touched: true, visited: false },
                { touched: true, visited: true }
              ]
            }
          },
          submitErrors: {
            myField: {
              subField: ['Invalid']
            }
          }
        }
      }),
      arrayMove('foo', 'myField.subField', 0, 2)
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: ['b', 'c', 'a']
          }
        },
        fields: {
          myField: {
            subField: [
              { touched: true, visited: false },
              { touched: true, visited: true },
              { touched: true }
            ]
          }
        },
        submitErrors: {
          myField: {
            subField: [, , 'Invalid'] // eslint-disable-line no-sparse-arrays
          }
        }
      }
    })
  })

  it('should move to overflow indexes', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: {
              subField: ['a', 'b', 'c']
            }
          }
        }
      }),
      arrayMove('foo', 'myField.subField', 0, 3)
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: ['b', 'c', , 'a'] // eslint-disable-line no-sparse-arrays
          }
        }
      }
    })
  })
}

export default describeArrayMove
