import { destroy } from '../actions'

const describeDestroy = (reducer, expect, { fromJS, setIn }) => () => {
  it('should destroy form state', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        },
        active: 'myField'
      },
      otherThing: { 
        touchThis: false
      }
    }), destroy('foo'))
    expect(state)
      .toEqualMap({
        otherThing: {
          touchThis: false
        }
      })
  })
}

export default describeDestroy
