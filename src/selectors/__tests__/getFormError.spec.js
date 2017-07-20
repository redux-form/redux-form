import plain from '../../structure/plain'
import immutable from '../../structure/immutable'
import addExpectations from '../../__tests__/addExpectations'
import plainExpectations from '../../structure/plain/expectations'
import createGetFormError from '../getFormError'
import immutableExpectations from '../../structure/immutable/expectations'

const describeGetFormError = (name, structure, expect) => {
  const getFormError = createGetFormError(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(createGetFormError('foo')).toBeA('function')
    })

    it('should get the form value from state', () => {
      expect(
        getFormError('foo')(
          fromJS({
            form: {
              foo: {
                _error: 'scary form error'
              }
            }
          })
        )
      ).toEqualMap('scary form error')
    })

    it('should return undefined if there is no form error', () => {
      expect(
        getFormError('foo')(
          fromJS({
            form: {
              foo: {}
            }
          })
        )
      ).toEqual(undefined)
    })

    it('should use getFormState if provided', () => {
      expect(
        getFormError('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                _error: 'big form error'
              }
            }
          })
        )
      ).toEqualMap('big form error')
    })
  })
}

describeGetFormError(
  'selector.getFormError.plain',
  plain,
  addExpectations(plainExpectations)
)
describeGetFormError(
  'selector.getFormError.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
