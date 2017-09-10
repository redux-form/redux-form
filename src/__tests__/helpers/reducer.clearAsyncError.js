import actions from '../../actions'
const { clearAsyncError } = actions

const describeClearAsyncError = (reducer, expect, { fromJS }) => () => {
  it('should do nothing on clear submit with no previous state', () => {
    const state = reducer(undefined, clearAsyncError('foo'))
    expect(state).toEqualMap({
      foo: {}
    })
  })

  it('should clear async errors with previous state', () => {
    const state = reducer(
      fromJS({
        myForm: {
          asyncErrors: {
            foo: 'some validation message here',
            baar: 'second validation message'
          }
        }
      }),
      clearAsyncError('myForm', 'foo')
    )
    expect(state).toEqualMap({
      myForm: {
        asyncErrors: {
          baar: 'second validation message'
        }
      }
    })
  })
}

export default describeClearAsyncError
