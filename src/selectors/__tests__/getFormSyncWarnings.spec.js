import createGetFormSyncErrors from '../getFormSyncWarnings'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'


const describeGetFormSyncErrors = (name, structure, setup) => {
  const getFormSyncWarnings = createGetFormSyncErrors(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(typeof createGetFormSyncErrors('foo')).toBe('function')
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
  () => expect.extend(plainExpectations)
)
describeGetFormSyncErrors(
  'getFormSyncWarnings.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
