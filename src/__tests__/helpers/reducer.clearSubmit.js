import actions from '../../actions'
const { clearSubmit } = actions

const describeClearSubmit = (reducer, expect, { fromJS }) => () => {
  it('should do nothing on clear submit with no previous state', () => {
    const state = reducer(undefined, clearSubmit('foo'))
    expect(state).toEqualMap({
      foo: {}
    })
  })

  it('should clear triggerSubmit with previous state', () => {
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
          active: 'otherField',
          triggerSubmit: true
        }
      }),
      clearSubmit('foo')
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
        active: 'otherField'
      }
    })
  })
}

export default describeClearSubmit
