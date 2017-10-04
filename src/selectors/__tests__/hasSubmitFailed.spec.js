import createHasSubmitFailed from '../hasSubmitFailed'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/__tests__/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/__tests__/expectations'


const describeHasSubmitFailed = (name, structure, setup) => {
  const hasSubmitFailed = createHasSubmitFailed(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function XXX', () => {
      expect(typeof hasSubmitFailed('foo')).toBe('function')
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
  () => expect.extend(plainExpectations)
)
describeHasSubmitFailed(
  'hasSubmitFailed.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
