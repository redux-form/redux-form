import {setSubmitFailed} from '../actions'

const describeSetSubmitFailed = (reducer, expect, {fromJS}) => () => {
  it('should set submitFailed flag on submitFailed', () => {
    const state = reducer(
      fromJS({
        foo: {
          doesnt: 'matter',
          should: 'notchange',
        },
      }),
      setSubmitFailed('foo')
    )
    expect(state).toEqualMap({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitFailed: true,
      },
    })
  })

  it('should clear submitting flag on submitFailed', () => {
    const state = reducer(
      fromJS({
        foo: {
          doesnt: 'matter',
          should: 'notchange',
          submitting: true,
        },
      }),
      setSubmitFailed('foo')
    )
    expect(state).toEqualMap({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitFailed: true,
      },
    })
  })

  it('should clear submitSucceeded flag on submitFailed', () => {
    const state = reducer(
      fromJS({
        foo: {
          doesnt: 'matter',
          should: 'notchange',
          submitting: true,
          submitSucceeded: true,
        },
      }),
      setSubmitFailed('foo')
    )
    expect(state).toEqualMap({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitFailed: true,
      },
    })
  })

  it('should mark fields provided as touched', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            a: 'aVal',
            b: 42,
            c: true,
          },
        },
      }),
      setSubmitFailed('foo', 'a', 'b', 'c')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          a: 'aVal',
          b: 42,
          c: true,
        },
        fields: {
          a: {
            touched: true,
          },
          b: {
            touched: true,
          },
          c: {
            touched: true,
          },
        },
        anyTouched: true,
        submitFailed: true,
      },
    })
  })
}

export default describeSetSubmitFailed
