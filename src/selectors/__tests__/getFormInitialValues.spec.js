import createGetFormInitialValues from '../getFormInitialValues'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeGetFormInitialValues = (name, structure, expect) => {
  const getFormInitialValues = createGetFormInitialValues(structure)

  const {fromJS, getIn} = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(getFormInitialValues('foo')).toBeA('function')
    })

    it('should get the initial form values from state', () => {
      expect(
        getFormInitialValues('foo')(
          fromJS({
            form: {
              foo: {
                initial: {
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
        getFormInitialValues('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                initial: {
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

describeGetFormInitialValues(
  'getFormInitialValues.plain',
  plain,
  addExpectations(plainExpectations)
)
describeGetFormInitialValues(
  'getFormInitialValues.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
