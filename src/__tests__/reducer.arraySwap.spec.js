import { arraySwap } from '../actions'

const describeArraySwap = (reducer, expect, { fromJS }) => () => {
  it('should do nothing with empty state', () => {
    const state = reducer(undefined, arraySwap('foo', 'myField', 0, 1))
    expect(state).toEqualMap({
      foo: {}
    })
  })

  it('should swap values and field state', () => {
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
      arraySwap('foo', 'myField.subField', 0, 2)
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: ['c', 'b', 'a']
          }
        },
        fields: {
          myField: {
            subField: [
              { touched: true, visited: true },
              { touched: true, visited: true },
              { touched: true }
            ]
          }
        },
        submitErrors: {
          myField: {
            subField: [undefined, , 'Invalid'] // eslint-disable-line no-sparse-arrays
          }
        }
      }
    })
  })

  it('should swap overflow values', () => {
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
      arraySwap('foo', 'myField.subField', 0, 3)
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: {
            subField: [undefined, 'b', 'c', 'a']
          }
        }
      }
    })
  })
}

export default describeArraySwap
