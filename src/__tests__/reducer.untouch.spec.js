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
    }), {
      ...untouch('myField', 'myOtherField'),
      form: 'foo'
    })
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
    }), {
      ...untouch('deep.myField', 'deep.myOtherField'),
      form: 'foo'
    })
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
    }), {
      ...untouch('myFields[0]', 'myFields[1]'),
      form: 'foo'
    })
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
