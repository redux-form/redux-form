import createGetFormSubmitErrors from '../getFormSubmitErrors'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeGetFormSubmitErrors = (name, structure, expect) => {
  const getFormSubmitErrors = createGetFormSubmitErrors(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(createGetFormSubmitErrors('foo')).toBeA('function')
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

describeGetFormSubmitErrors(
  'getFormSubmitErrors.plain',
  plain,
  addExpectations(plainExpectations)
)
describeGetFormSubmitErrors(
  'getFormSubmitErrors.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
