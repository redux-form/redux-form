import { arrayInsert } from '../actions'

const describeArrayInsert = (reducer, expect, { fromJS }) => () => {
  it('should work with empty state', () => {
    const state = reducer(undefined, arrayInsert('foo', 'myField', 0, 'myValue'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: [ 'myValue' ]
          }
        }
      })
  })

  it('should insert at beginning', () => {
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
    }), arrayInsert('foo', 'myField.subField', 0, 'newValue'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: {
              subField: [ 'newValue', 'a', 'b', 'c' ]
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

  it('should insert at end', () => {
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
    }), arrayInsert('foo', 'myField.subField', 3, 'newValue'))
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

  it('should insert in middle', () => {
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
    }), arrayInsert('foo', 'myField.subField', 1, 'newValue'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: {
              subField: [ 'a', 'newValue', 'b', 'c' ]
            }
          },
          fields: {
            myField: {
              subField: [
                { touched: true },
                {},
                { touched: true, visited: true },
                { touched: true }
              ]
            }
          }
        }
      })
  })
}

export default describeArrayInsert
