import createGetFormSubmitErrors from '../getFormSubmitErrors'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/__tests__/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/__tests__/expectations'

const describeGetFormSubmitErrors = (name, structure, setup) => {
  const getFormSubmitErrors = createGetFormSubmitErrors(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(typeof createGetFormSubmitErrors('foo')).toBe('function')
    })

    it('should get the form values from state', () => {
      expect(
        getFormSubmitErrors('foo')(
          fromJS({
            form: {
              foo: {
                submitErrors: {
                  dog: 'Snoopy',
                  cat: 'Garfield'
                }
              }
            }
          })
        )
      ).toEqualMap({
        dog: 'Snoopy',
        cat: 'Garfield'
      })
    })

    it('should return undefined if there are no submitErrors', () => {
      expect(
        getFormSubmitErrors('foo')(
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
        getFormSubmitErrors('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                submitErrors: {
                  dog: 'Snoopy',
                  cat: 'Garfield'
                }
              }
            }
          })
        )
      ).toEqualMap({
        dog: 'Snoopy',
        cat: 'Garfield'
      })
    })
  })
}

describeGetFormSubmitErrors('getFormSubmitErrors.plain', plain, () =>
  expect.extend(plainExpectations)
)
describeGetFormSubmitErrors('getFormSubmitErrors.immutable', immutable, () =>
  expect.extend(immutableExpectations)
)
