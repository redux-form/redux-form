import createGetFormValues from '../getFormValues'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/__tests__/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/__tests__/expectations'

const describeGetFormValues = (name, structure, setup) => {
  const getFormValues = createGetFormValues(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(typeof getFormValues('foo')).toBe('function')
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

describeGetFormValues('getFormValues.plain', plain, () =>
  expect.extend(plainExpectations)
)
describeGetFormValues('getFormValues.immutable', immutable, () =>
  expect.extend(immutableExpectations)
)
