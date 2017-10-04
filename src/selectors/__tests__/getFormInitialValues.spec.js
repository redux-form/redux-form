import createGetFormInitialValues from '../getFormInitialValues'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/__tests__/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/__tests__/expectations'


const describeGetFormInitialValues = (name, structure, setup) => {
  const getFormInitialValues = createGetFormInitialValues(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(typeof getFormInitialValues('foo')).toBe('function')
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
  () => expect.extend(plainExpectations)
)
describeGetFormInitialValues(
  'getFormInitialValues.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
