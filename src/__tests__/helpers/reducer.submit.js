import actions from '../../actions'
const { submit } = actions

const describeSubmit = (reducer, expect, { fromJS }) => () => {
  it('should set triggerSubmit with no previous state', () => {
    const state = reducer(undefined, submit('foo'))
    expect(state).toEqualMap({
      foo: {
        triggerSubmit: true
      }
    })
  })

  it('should set triggerSubmit with previous state', () => {
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
      submit('foo')
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
          myField: {},
          otherField: {
            visited: true,
            active: true
          }
        },
        active: 'otherField',
        triggerSubmit: true
      }
    })
  })
}

export default describeSubmit
