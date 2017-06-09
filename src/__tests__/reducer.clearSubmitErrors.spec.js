import { clearSubmitErrors } from '../actions'

const describeClearSubmitErrors = (reducer, expect, { fromJS }) => () => {
  it('should do nothing on clear submit errors with no previous state', () => {
    const state = reducer(undefined, clearSubmitErrors('foo'))
    expect(state).toEqualMap({
      foo: {}
    })
  })

  it('should clear submit errors with previous state', () => {
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
          submitErrors: {
            some: 'error'
          },
          active: 'otherField',
          triggerSubmit: true
        }
      }),
      clearSubmitErrors('foo')
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

export default describeClearSubmitErrors
