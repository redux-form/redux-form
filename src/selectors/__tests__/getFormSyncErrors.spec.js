import createGetFormSyncErrors from '../getFormSyncErrors'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'


const describeGetFormSyncErrors = (name, structure, setup) => {
  const getFormSyncErrors = createGetFormSyncErrors(structure)

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
        getFormSyncErrors('foo')(
          fromJS({
            form: {
              foo: {
                syncErrors: {
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

    it('should return undefined if there are no syncErrors', () => {
      expect(
        getFormSyncErrors('foo')(
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
        getFormSyncErrors('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                syncErrors: {
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
  'getFormSyncErrors.plain',
  plain,
  () => expect.extend(plainExpectations)
)
describeGetFormSyncErrors(
  'getFormSyncErrors.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
