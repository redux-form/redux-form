import { setSubmitFailed } from '../actions'

const describeSetSubmitFailed = (reducer, expect, { fromJS }) => () => {
  it('should set submitFailed flag on submitFailed', () => {
    const state = reducer(fromJS({
      foo: {
        doesnt: 'matter',
        should: 'notchange'
      }
    }), {
      ...setSubmitFailed(),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          doesnt: 'matter',
          should: 'notchange',
          submitFailed: true
        }
      })
  })

  it('should clear submitting flag on submitFailed', () => {
    const state = reducer(fromJS({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitting: true
      }
    }), {
      ...setSubmitFailed(),
      form: 'foo'
    })
    expect(state)
      .toEqualMap({
        foo: {
          doesnt: 'matter',
          should: 'notchange',
          submitFailed: true
        }
      })
  })
}

export default describeSetSubmitFailed
