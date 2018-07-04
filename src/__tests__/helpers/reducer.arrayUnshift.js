import actions from '../../actions'
const { arrayUnshift } = actions

const describeArrayUnshift = (reducer, expect, { fromJS }) => () => {
  it('should work with empty state', () => {
    const state = reducer(undefined, arrayUnshift('foo', 'myField', 'myValue'))
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: ['myValue']
        }
      }
    })
  })

  it('should insert at beginning', () => {
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
                { touched: true, visited: true },
                { touched: true }
              ]
            }
          }
        }
      }),
      arrayUnshift('foo', 'myField.subField', 'newValue')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: ['newValue', 'a', 'b', 'c']
          }
        },
        fields: {
          myField: {
            subField: [
              {},
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

export default describeArrayUnshift
