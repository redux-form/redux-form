import createGetFormError from '../getFormError'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/__tests__/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/__tests__/expectations'

const describeGetFormError = (name, structure, setup) => {
  const getFormError = createGetFormError(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(typeof getFormError('foo')).toBe('function')
    })

    it('should return error when it is presented', () => {
      expect(
        getFormError('foo')(
          fromJS({
            form: {
              foo: {
                error: 'Wow'
              }
            }
          })
        )
      ).toBe('Wow')
    })

    it('should return undefined when it is not presented', () => {
      expect(
        getFormError('foo')(
          fromJS({
            form: {}
          })
        )
      ).toBe(undefined)
    })

    it('should use getFormState if provided', () => {
      expect(
        getFormError('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                error: 'Wow'
              }
            }
          })
        )
      ).toBe('Wow')
    })
  })
}

describeGetFormError('getFormError.plain', plain, () =>
  expect.extend(plainExpectations)
)
describeGetFormError('getFormError.immutable', immutable, () =>
  expect.extend(immutableExpectations)
)
