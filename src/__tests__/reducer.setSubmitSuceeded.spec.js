import actions from '../actions'
const { setSubmitSucceeded } = actions

const describeSetSubmitSucceeded = (reducer, expect, { fromJS }) => () => {
  it('should set submitSucceeded flag on submitSucceeded', () => {
    const state = reducer(
      fromJS({
        foo: {
          doesnt: 'matter',
          should: 'change'
        }
      }),
      setSubmitSucceeded('foo')
    )
    expect(state).toEqualMap({
      foo: {
        doesnt: 'matter',
        should: 'change',
        submitSucceeded: true
      }
    })
  })

  it('should clear submitting flag on submitSucceeded', () => {
    const state = reducer(
      fromJS({
        foo: {
          doesnt: 'matter',
          should: 'change',
          submitting: true
        }
      }),
      setSubmitSucceeded('foo')
    )
    expect(state).toEqualMap({
      foo: {
        doesnt: 'matter',
        should: 'change',
        submitSucceeded: true,
        submitting: true
      }
    })
  })

  it('should clear submitFailed flag on submitSucceeded', () => {
    const state = reducer(
      fromJS({
        foo: {
          doesnt: 'matter',
          should: 'notchange',
          submitting: true,
          submitFailed: true
        }
      }),
      setSubmitSucceeded('foo')
    )
    expect(state).toEqualMap({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitSucceeded: true,
        submitting: true
      }
    })
  })
}

export default describeSetSubmitSucceeded
