import { arraySplice } from '../actions'

const describeArraySplice = (reducer, expect, { fromJS }) => () => {
  it('should work with empty state', () => {
    const state = reducer(undefined, arraySplice('foo', 'myField', 0, 0, 'myValue'))
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
    }), arraySplice('foo', 'myField.subField', 0, 0, 'newValue'))
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
    }), arraySplice('foo', 'myField.subField', 3, 0, 'newValue'))
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
    }), arraySplice('foo', 'myField.subField', 1, 0, 'newValue'))
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
    }), arraySplice('foo', 'myField.subField', 0, 1))
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
    }), arraySplice('foo', 'myField.subField', 3, 1))
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
    }), arraySplice('foo', 'myField.subField', 1, 1))
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

export default describeArraySplice
