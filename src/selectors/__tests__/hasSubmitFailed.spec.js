import createHasSubmitFailed from '../hasSubmitFailed'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeHasSubmitFailed = (name, structure, expect) => {
  const hasSubmitFailed = createHasSubmitFailed(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    it('should return a function XXX', () => {
      expect(hasSubmitFailed('foo')).toBeA('function')
    })

    it('should return false when value not present', () => {
      expect(
        hasSubmitFailed('foo')(
          fromJS({
            form: {}
          })
        )
      ).toBe(false)
    })

    it('should return true when submitting', () => {
      expect(
        hasSubmitFailed('foo')(
          fromJS({
            form: {
              foo: {
                submitFailed: true
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should use getFormState if provided', () => {
      expect(
        hasSubmitFailed('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                submitFailed: true
              }
            }
          })
        )
      ).toBe(true)
    })
  })
}

describeHasSubmitFailed(
  'hasSubmitFailed.plain',
  plain,
  addExpectations(plainExpectations)
)
describeHasSubmitFailed(
  'hasSubmitFailed.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
