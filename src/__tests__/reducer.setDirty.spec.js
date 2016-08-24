import { setDirty } from '../actions'

const describeSetDirty = (reducer, expect, { fromJS }) => () => {
  it('should set setDirty to true', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'initialValue'
        }
      }
    }), setDirty('foo'))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'initialValue'
          },
          setDirty: true
        }
      })
  })
}

export default describeSetDirty
