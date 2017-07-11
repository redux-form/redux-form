import actions from '../actions'
const { arrayPop } = actions

const describeArrayPop = (reducer, expect, { fromJS }) => () => {
  it('should do nothing with no array', () => {
    const state = reducer(
      fromJS({
        foo: {}
      }),
      arrayPop('foo', 'myField.subField')
    )
    expect(state).toEqualMap({
      foo: {}
    })
  })

  it('should pop from end', () => {
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
      arrayPop('foo', 'myField.subField')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: ['a', 'b', 'c']
          }
        },
        fields: {
          myField: {
            subField: [
              { touched: true, visited: true },
              { touched: true },
              { touched: true, visited: true }
            ]
          }
        }
      }
    })
  })
}

export default describeArrayPop
