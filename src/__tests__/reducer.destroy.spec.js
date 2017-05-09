import {destroy} from '../actions'

const describeDestroy = (reducer, expect, {fromJS}) => () => {
  it('should destroy form state', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'initialValue',
          },
          active: 'myField',
        },
        otherThing: {
          touchThis: false,
        },
      }),
      destroy('foo')
    )
    expect(state).toEqualMap({
      otherThing: {
        touchThis: false,
      },
    })
  })

  it('should destroy form state for multiple forms', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'fooInitialValue',
          },
          active: 'myFooField',
        },
        bar: {
          values: {
            myField: 'barInitialValue',
          },
          active: 'myBarField',
        },
        otherThing: {
          touchThis: false,
        },
      }),
      destroy('foo', 'bar')
    )
    expect(state).toEqualMap({
      otherThing: {
        touchThis: false,
      },
    })
  })
}

export default describeDestroy
