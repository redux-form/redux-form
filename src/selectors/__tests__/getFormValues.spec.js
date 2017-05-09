import createGetFormValues from '../getFormValues'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeGetFormValues = (name, structure, expect) => {
  const getFormValues = createGetFormValues(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(getFormValues('foo')).toBeA('function')
    })

    it('should get the form values from state', () => {
      expect(
        getFormValues('foo')(
          fromJS({
            form: {
              foo: {
                values: {
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

    it('should use getFormState if provided', () => {
      expect(
        getFormValues('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                values: {
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

describeGetFormValues(
  'getFormValues.plain',
  plain,
  addExpectations(plainExpectations)
)
describeGetFormValues(
  'getFormValues.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
