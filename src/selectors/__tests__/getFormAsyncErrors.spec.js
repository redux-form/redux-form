import createGetFormAsyncErrors from '../getFormAsyncErrors'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'


const describeGetFormAsyncErrors = (name, structure, setup) => {
  const getFormAsyncErrors = createGetFormAsyncErrors(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(createGetFormAsyncErrors('foo')).toBeA('function')
    })

    it('should get the form values from state', () => {
      expect(
        getFormAsyncErrors('foo')(
          fromJS({
            form: {
              foo: {
                asyncErrors: {
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

    it('should return undefined if there are no asyncErrors', () => {
      expect(
        getFormAsyncErrors('foo')(
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
        getFormAsyncErrors('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                asyncErrors: {
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

describeGetFormAsyncErrors(
  'getFormAsyncErrors.plain',
  plain,
  () => expect.extend(plainExpectations)
)
describeGetFormAsyncErrors(
  'getFormAsyncErrors.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
