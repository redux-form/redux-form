import actions from '../actions'
const { updateSyncWarnings } = actions

const describeUpdateSyncWarnings = (
  reducer,
  expect,
  { fromJS, setIn }
) => () => {
  it('should update sync warnings', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          }
        }
      }),
      updateSyncWarnings('foo', {
        myField: 'myField warning',
        myOtherField: 'myOtherField warning'
      })
    )
    expect(state).toEqual(
      setIn(
        fromJS({
          foo: {
            values: {
              myField: 'value',
              myOtherField: 'otherValue'
            }
          }
        }),
        'foo.syncWarnings',
        {
          myField: 'myField warning',
          myOtherField: 'myOtherField warning'
        }
      )
    )
  })

  it('should update form-wide warning', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          }
        }
      }),
      updateSyncWarnings(
        'foo',
        {
          myField: 'myField warning'
        },
        'form wide warning'
      )
    )
    expect(state).toEqualMap(
      setIn(
        fromJS({
          foo: {
            values: {
              myField: 'value',
              myOtherField: 'otherValue'
            },
            warning: 'form wide warning'
          }
        }),
        'foo.syncWarnings',
        {
          myField: 'myField warning'
        }
      )
    )
  })

  it('should update complex sync warnings', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          }
        }
      }),
      updateSyncWarnings('foo', {
        myField: { complex: true, text: 'myField warning' },
        myOtherField: { complex: true, text: 'myOtherField warning' }
      })
    )
    expect(state).toEqual(
      setIn(
        fromJS({
          foo: {
            values: {
              myField: 'value',
              myOtherField: 'otherValue'
            }
          }
        }),
        'foo.syncWarnings',
        {
          myField: { complex: true, text: 'myField warning' },
          myOtherField: { complex: true, text: 'myOtherField warning' }
        }
      )
    )
  })

  it('should clear sync warnings', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'value',
            myOtherField: 'otherValue'
          },
          syncWarnings: {
            myField: 'myField warning',
            myOtherField: 'myOtherField warning'
          }
        }
      }),
      updateSyncWarnings('foo', {})
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'value',
          myOtherField: 'otherValue'
        }
      }
    })
  })
}

export default describeUpdateSyncWarnings
