import { arrayRemove } from '../actions'

const describeArrayRemove = (reducer, expect, { fromJS }) => () => {
  it('should remove from beginning', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: {
            subField: [ 'a', 'b', 'c', 'd' ]
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
    }), arrayRemove('foo', 'myField.subField', 0))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: {
              subField: [ 'b', 'c', 'd' ]
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

  it('should remove from end', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: {
            subField: [ 'a', 'b', 'c', 'd' ]
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
    }), arrayRemove('foo', 'myField.subField', 3))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: {
              subField: [ 'a', 'b', 'c' ]
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

  it('should remove from middle', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: {
            subField: [ 'a', 'b', 'c', 'd' ]
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
    }), arrayRemove('foo', 'myField.subField', 1))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: {
              subField: [ 'a', 'c', 'd' ]
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
          }
        }
      })
  })
}

export default describeArrayRemove
