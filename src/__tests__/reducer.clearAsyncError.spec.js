import { clearAsyncError } from '../actions'

const describeClearAsyncError = (reducer, expect, { fromJS }) => () => {
  it('should do nothing on clear submit with no previous state', () => {
    const state = reducer(undefined, clearAsyncError('foo'))
    expect(state)
      .toEqualMap({
        foo: {}
      })
  })

  it('should clear async errors with previous state', () => {
    const state = reducer(fromJS({
      foo: {
        asyncErrors: {
          foo: 'some validation message here',
          baar: 'second validation message'
        }
      }
    }), clearAsyncError('foo'))
    expect(state)
      .toEqualMap({
        foo: {
          asyncErrors: {
            baar: 'second validation message'
          }
        }
      })
  })
}

export default describeClearAsyncError
