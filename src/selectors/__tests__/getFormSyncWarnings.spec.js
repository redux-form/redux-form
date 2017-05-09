import createGetFormSyncErrors from '../getFormSyncWarnings'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeGetFormSyncErrors = (name, structure, expect) => {
  const getFormSyncWarnings = createGetFormSyncErrors(structure)

  const {fromJS, getIn} = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(createGetFormSyncErrors('foo')).toBeA('function')
    })

    it('should get the form values from state', () => {
      expect(
        getFormSyncWarnings('foo')(
          fromJS({
            form: {
              foo: {
                syncWarnings: {
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

    it('should return undefined if there are no syncWarnings', () => {
      expect(
        getFormSyncWarnings('foo')(
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
        getFormSyncWarnings('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                syncWarnings: {
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

describeGetFormSyncErrors(
  'getFormSyncWarnings.plain',
  plain,
  addExpectations(plainExpectations)
)
describeGetFormSyncErrors(
  'getFormSyncWarnings.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
