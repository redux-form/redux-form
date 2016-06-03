import { arrayPush } from '../actions'

const describeArrayPush = (reducer, expect, { fromJS }) => () => {
  it('should work with empty state', () => {
    const state = reducer(undefined, arrayPush('foo', 'myField', 'myValue'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: [ 'myValue' ]
          }
        }
      })
  })

  it('should work with existing empty array', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: []
        }
      }
    }), arrayPush('foo', 'myField', 'myValue'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: [ 'myValue' ]
          }
        }
      })
  })

  it('should push at end', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: {
            subField: [ 'a', 'b', 'c' ]
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
    }), arrayPush('foo', 'myField.subField', 'newValue'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: {
              subField: [ 'a', 'b', 'c', 'newValue' ]
            }
          },
          fields: {
            myField: {
              subField: [
                { touched: true },
                { touched: true, visited: true },
                { touched: true },
                {}
              ]
            }
          }
        }
      })
  })
}

export default describeArrayPush
