import actions from '../../actions'
const { arrayShift } = actions

const describeArrayShift = (reducer, expect, { fromJS }) => () => {
  it('should remove from beginning', () => {
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
      arrayShift('foo', 'myField.subField')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: ['b', 'c', 'd']
          }
        },
        fields: {
          myField: {
            subField: [
              { touched: true },
              { touched: true, visited: true },
              { touched: true }
            ]
          }
        }
      }
    })
  })
}

export default describeArrayShift
