import { setSubmitSucceeded } from '../actions'

const describeSetSubmitSucceeded = (reducer, expect, { fromJS }) => () => {
  it('should set submitSucceeded flag on submitSucceeded', () => {
    const state = reducer(fromJS({
      foo: {
        doesnt: 'matter',
        should: 'change'
      }
    }), setSubmitSucceeded('foo'))
    expect(state)
      .toEqualMap({
        foo: {
          doesnt: 'matter',
          should: 'change',
          submitSucceeded: true
        }
      })
  })

  it('should clear submitting flag on submitSucceeded', () => {
    const state = reducer(fromJS({
      foo: {
        doesnt: 'matter',
        should: 'change',
        submitting: true
      }
    }), setSubmitSucceeded('foo'))
    expect(state)
      .toEqualMap({
        foo: {
          doesnt: 'matter',
          should: 'change',
          submitSucceeded: true
        }
      })
  })

  it('should clear submitFailed flag on submitSucceeded', () => {
    const state = reducer(fromJS({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        submitting: true,
        submitFailed: true
      }
    }), setSubmitSucceeded('foo'))
    expect(state)
      .toEqualMap({
        foo: {
          doesnt: 'matter',
          should: 'notchange',
          submitSucceeded: true
        }
      })
  })

  it('should mark fields provided as touched', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          a: 'aVal',
          b: 42,
          c: true
        }
      }
    }), setSubmitSucceeded('foo', 'a', 'b', 'c'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            a: 'aVal',
            b: 42,
            c: true
          },
          fields: {
            a: {
              touched: true
            },
            b: {
              touched: true
            },
            c: {
              touched: true
            }
          },
          anyTouched: true,
          submitSucceeded: true
        }
      })
  })
}

export default describeSetSubmitSucceeded
