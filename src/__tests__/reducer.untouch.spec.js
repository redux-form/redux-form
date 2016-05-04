import { untouch } from '../actions'

const describeUntouch = (reducer, expect, { fromJS }) => () => {
  it('should unmark fields as touched on untouch', () => {
    const state = reducer(fromJS({
      foo: {
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
    }), untouch('foo', 'myField', 'myOtherField'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          },
          fields: {
            myField: {},
            myOtherField: {}
          }
        }
      })
  })

  it('should unmark deep fields as touched on untouch', () => {
    const state = reducer(fromJS({
      foo: {
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
    }), untouch('foo', 'deep.myField', 'deep.myOtherField'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            deep: {
              myField: 'value',
              myOtherField: 'otherValue'
            }
          },
          fields: {
            deep: {
              myField: {},
              myOtherField: {}
            }
          }
        }
      })
  })

  it('should unmark array fields as touched on untouch', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myFields: [ 'value', 'otherValue' ]
        },
        fields: {
          myFields: [
            { touched: true },
            { touched: true }
          ]
        }
      }
    }), untouch('foo', 'myFields[0]', 'myFields[1]'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myFields: [ 'value', 'otherValue' ]
          },
          fields: {
            myFields: [ {}, {} ]
          }
        }
      })
  })
}

export default describeUntouch
