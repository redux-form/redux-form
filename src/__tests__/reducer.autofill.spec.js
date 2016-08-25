import { autofill, change } from '../actions'

const describeBlur = (reducer, expect, { fromJS }) => () => {
  it('should set value on autofill with empty state', () => {
    const state = reducer(undefined, autofill('foo', 'myField', 'myValue'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'myValue'
          },
          fields: {
            myField: {
              autofilled: true
            }
          }
        }
      })
  })

  it('should overwrite value on autofill', () => {
    const state = reducer(fromJS({
      foo: {
        anyTouched: true,
        values: {
          myField: 'before'
        },
        fields: {
          myField: {
            touched: true
          }
        }
      }
    }), autofill('foo', 'myField', 'after'))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'after'
          },
          fields: {
            myField: {
              touched: true,
              autofilled: true
            }
          }
        }
      })
  })

  it('should set value on change and remove autofilled', () => {
    const state = reducer(fromJS({
      foo: {
        anyTouched: true,
        values: {
          myField: 'autofilled value'
        },
        fields: {
          myField: {
            autofilled: true,
            touched: true
          }
        }
      }
    }), change('foo', 'myField', 'after change', true))
    expect(state)
      .toEqualMap({
        foo: {
          anyTouched: true,
          values: {
            myField: 'after change'
          },
          fields: {
            myField: {
              touched: true
            }
          }
        }
      })
  })
}

export default describeBlur
