import createHasSubmitSucceeded from '../hasSubmitSucceeded'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeHasSubmitSucceeded = (name, structure, expect) => {
  const hasSubmitSucceeded = createHasSubmitSucceeded(structure)

  const {fromJS, getIn} = structure

  describe(name, () => {
    it('should return a function XXX', () => {
      expect(hasSubmitSucceeded('foo')).toBeA('function')
    })

    it('should return false when value not present', () => {
      expect(
        hasSubmitSucceeded('foo')(
          fromJS({
            form: {}
          })
        )
      ).toBe(false)
    })

    it('should return true when submitting', () => {
      expect(
        hasSubmitSucceeded('foo')(
          fromJS({
            form: {
              foo: {
                submitSucceeded: true
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should use getFormState if provided', () => {
      expect(
        hasSubmitSucceeded('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                submitSucceeded: true
              }
            }
          })
        )
      ).toBe(true)
    })
  })
}

describeHasSubmitSucceeded(
  'hasSubmitSucceeded.plain',
  plain,
  addExpectations(plainExpectations)
)
describeHasSubmitSucceeded(
  'hasSubmitSucceeded.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
