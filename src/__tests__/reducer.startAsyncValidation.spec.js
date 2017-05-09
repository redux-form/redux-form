import {startAsyncValidation} from '../actions'

const describeStartAsyncValidation = (reducer, expect, {fromJS}) => () => {
  it('should set asyncValidating on startAsyncValidation', () => {
    const state = reducer(
      fromJS({
        foo: {
          doesnt: 'matter',
          should: 'notchange'
        }
      }),
      startAsyncValidation('foo')
    )
    expect(state).toEqualMap({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        asyncValidating: true
      }
    })
  })

  it('should set asyncValidating with field name on startAsyncValidation', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'initialValue'
          },
          initial: {
            myField: 'initialValue'
          }
        }
      }),
      startAsyncValidation('foo', 'myField')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'initialValue'
        },
        initial: {
          myField: 'initialValue'
        },
        asyncValidating: 'myField'
      }
    })
  })
}

export default describeStartAsyncValidation
