import { updateSyncErrors } from '../actions'

const describeUpdateSyncErrors = (reducer, expect, { fromJS, setIn }) => () => {
  it('should update sync errors', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'value',
          myOtherField: 'otherValue'
        }
      }
    }), updateSyncErrors('foo', {
      myField: 'myField error',
      myOtherField: 'myOtherField error'
    }))
    expect(state)
      .toEqual(setIn(fromJS({
        foo: {
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          }
        }
      }),
        'foo.syncErrors',
        {
          myField: 'myField error',
          myOtherField: 'myOtherField error'
        }))
  })

  it('should update complex sync errors', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'value',
          myOtherField: 'otherValue'
        }
      }
    }), updateSyncErrors('foo', {
      myField: { complex: true, text: 'myField error' },
      myOtherField: { complex: true, text: 'myOtherField error' }
    }))
    expect(state)
      .toEqual(setIn(fromJS({
        foo: {
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          }
        }
      }),
        'foo.syncErrors',
        {
          myField: { complex: true, text: 'myField error' },
          myOtherField: { complex: true, text: 'myOtherField error' }
        }))
  })

  it('should clear sync errors', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'value',
          myOtherField: 'otherValue'
        },
        syncErrors: {
          myField: 'myField error',
          myOtherField: 'myOtherField error'
        }
      }
    }), updateSyncErrors('foo', {}))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          }
        }
      })
  })
}

export default describeUpdateSyncErrors
