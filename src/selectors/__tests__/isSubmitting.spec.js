import createIsSubmitting from '../isSubmitting'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'


const describeIsSubmitting = (name, structure, setup) => {
  const isSubmitting = createIsSubmitting(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function XXX', () => {
      expect(typeof isSubmitting('foo')).toBe('function')
    })

    it('should return false when value not present', () => {
      expect(
        isSubmitting('foo')(
          fromJS({
            form: {}
          })
        )
      ).toBe(false)
    })

    it('should return true when submitting', () => {
      expect(
        isSubmitting('foo')(
          fromJS({
            form: {
              foo: {
                submitting: true
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should use getFormState if provided', () => {
      expect(
        isSubmitting('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                submitting: true
              }
            }
          })
        )
      ).toBe(true)
    })
  })
}

describeIsSubmitting(
  'isSubmitting.plain',
  plain,
  () => expect.extend(plainExpectations)
)
describeIsSubmitting(
  'isSubmitting.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
