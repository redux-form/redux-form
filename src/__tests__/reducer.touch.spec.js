import { touch } from '../actions'

const describeTouch = (reducer, expect, { fromJS }) => () => {
  it('should mark fields as touched on touch', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'value',
          myOtherField: 'otherValue'
        }
      }
    }), {
      ...touch('myField', 'myOtherField'),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          },
          fields: {
            myField: {
              touched: true
            },
            myOtherField: {
              touched: true
            }
          }
        }
      })
  })

  it('should mark deep fields as touched on touch', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          deep: {
            myField: 'value',
            myOtherField: 'otherValue'
          }
        }
      }
    }), {
      ...touch('deep.myField', 'deep.myOtherField'),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            deep: {
              myField: 'value',
              myOtherField: 'otherValue'
            }
          },
          fields: {
            deep: {
              myField: {
                touched: true
              },
              myOtherField: {
                touched: true
              }
            }
          }
        }
      })
  })

  it('should mark array fields as touched on touch', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myFields: [ 'value', 'otherValue' ]
        }
      }
    }), {
      ...touch('myFields[0]', 'myFields[1]'),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myFields: [ 'value', 'otherValue' ]
          },
          fields: {
            myFields: [
              {
                touched: true
              },
              {
                touched: true
              }
            ]
          }
        }
      })
  })
}

export default describeTouch
