import createHasSubmitSucceeded from '../hasSubmitSucceeded'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/__tests__/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/__tests__/expectations'


const describeHasSubmitSucceeded = (name, structure, setup) => {
  const hasSubmitSucceeded = createHasSubmitSucceeded(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function XXX', () => {
      expect(typeof hasSubmitSucceeded('foo')).toBe('function')
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
  () => expect.extend(plainExpectations)
)
describeHasSubmitSucceeded(
  'hasSubmitSucceeded.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
