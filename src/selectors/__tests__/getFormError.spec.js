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
                syncFormWideError: 'Wow'
              }
            }
          })
        )
      ).toBe('Wow')
    })

    it('should return async error when it is presented', () => {
      expect(
        getFormError('foo')(
          fromJS({
            form: {
              foo: {
                asyncFormWideError: 'Wow'
              }
            }
          })
        )
      ).toBe('Wow')
    })

    it('should return submit error when it is presented', () => {
      expect(
        getFormError('foo')(
          fromJS({
            form: {
              foo: {
                submitFormWideError: 'Wow'
              }
            }
          })
        )
      ).toBe('Wow')
    })

    it('should prioritize async error to submit error when it is presented', () => {
      expect(
        getFormError('foo')(
          fromJS({
            form: {
              foo: {
                asyncFormWideError: 'Wow (async)',
                submitFormWideError: 'Wow (submit)'
              }
            }
          })
        )
      ).toBe('Wow (async)')
    })

    it('should prioritize sync error when it is presented', () => {
      expect(
        getFormError('foo')(
          fromJS({
            form: {
              foo: {
                syncFormWideError: 'Wow (sync)',
                asyncFormWideError: 'Wow (async)',
                submitFormWideError: 'Wow (submit)'
              }
            }
          })
        )
      ).toBe('Wow (sync)')
    })

    it('should return undefined when error is not presented', () => {
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
                syncFormWideError: 'Wow (sync)',
                asyncFormWideError: 'Wow (async)',
                submitFormWideError: 'Wow (submit)'
              }
            }
          })
        )
      ).toBe('Wow (sync)')
    })
  })
}

describeGetFormError('getFormError.plain', plain, () =>
  expect.extend(plainExpectations)
)
describeGetFormError('getFormError.immutable', immutable, () =>
  expect.extend(immutableExpectations)
)
