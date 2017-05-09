import createGetFormNames from '../getFormNames'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeGetFormNames = (name, structure, expect) => {
  const getFormNames = createGetFormNames(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(getFormNames()).toBeA('function')
    })

    it('should get the form names from state', () => {
      expect(
        getFormNames()(
          fromJS({
            form: {
              foo: {
                values: {
                  dog: 'Snoopy',
                  cat: 'Garfield'
                }
              },
              bar: {
                values: {
                  dog: 'Fido',
                  cat: 'Whiskers'
                }
              }
            }
          })
        )
      ).toEqualMap(['foo', 'bar'])
    })

    it('should use getFormState if provided', () => {
      expect(
        getFormNames(state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                values: {
                  dog: 'Snoopy',
                  cat: 'Garfield'
                }
              },
              bar: {
                values: {
                  dog: 'Fido',
                  cat: 'Whiskers'
                }
              }
            }
          })
        )
      ).toEqualMap(['foo', 'bar'])
    })
  })
}

describeGetFormNames(
  'getFormNames.plain',
  plain,
  addExpectations(plainExpectations)
)
describeGetFormNames(
  'getFormNames.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
