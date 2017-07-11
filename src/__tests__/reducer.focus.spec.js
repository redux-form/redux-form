import actions from '../actions'
const { focus } = actions

const describeFocus = (reducer, expect, { fromJS }) => () => {
  it('should set visited on focus and update active with no previous state', () => {
    const state = reducer(undefined, focus('foo', 'myField'))
    expect(state).toEqualMap({
      foo: {
        fields: {
          myField: {
            visited: true,
            active: true
          }
        },
        active: 'myField'
      }
    })
  })

  it('should set visited on focus and update active on deep field with no previous state', () => {
    const state = reducer(undefined, focus('foo', 'myField.subField'))
    expect(state).toEqualMap({
      foo: {
        fields: {
          myField: {
            subField: {
              visited: true,
              active: true
            }
          }
        },
        active: 'myField.subField'
      }
    })
  })

  it('should set visited on focus and update current with previous state', () => {
    const state = reducer(
      fromJS({
        foo: {
          values: {
            myField: 'initialValue'
          },
          initial: {
            myField: 'initialValue'
          },
          fields: {
            myField: {},
            otherField: {
              visited: true,
              active: true
            }
          },
          active: 'otherField'
        }
      }),
      focus('foo', 'myField')
    )
    expect(state).toEqualMap({
      foo: {
        values: {
          myField: 'initialValue'
        },
        initial: {
          myField: 'initialValue'
        },
        fields: {
          otherField: {
            visited: true
          },
          myField: {
            visited: true,
            active: true
          }
        },
        active: 'myField'
      }
    })
  })
}

export default describeFocus
