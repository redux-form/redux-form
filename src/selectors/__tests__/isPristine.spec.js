import createIsPristine from '../isPristine'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'


const describeIsPristine = (name, structure, setup) => {
  const isPristine = createIsPristine(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(typeof isPristine('foo')).toBe('function')
    })

    it('should return true when values not present', () => {
      expect(
        isPristine('foo')(
          fromJS({
            form: {}
          })
        )
      ).toBe(true)
    })

    it('should return true when values are pristine', () => {
      expect(
        isPristine('foo')(
          fromJS({
            form: {
              foo: {
                initial: {
                  dog: 'Snoopy',
                  cat: 'Garfield'
                },
                values: {
                  dog: 'Snoopy',
                  cat: 'Garfield'
                }
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should return true when values are dirty', () => {
      expect(
        isPristine('foo')(
          fromJS({
            form: {
              foo: {
                initial: {
                  dog: 'Snoopy',
                  cat: 'Garfield'
                },
                values: {
                  dog: 'Odie',
                  cat: 'Garfield'
                }
              }
            }
          })
        )
      ).toBe(false)
    })

    it('should use getFormState if provided', () => {
      expect(
        isPristine('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                initial: {
                  dog: 'Snoopy',
                  cat: 'Garfield'
                },
                values: {
                  dog: 'Odie',
                  cat: 'Garfield'
                }
              }
            }
          })
        )
      ).toBe(false)
    })
  })
}

describeIsPristine(
  'isPristine.plain',
  plain,
  () => expect.extend(plainExpectations)
)
describeIsPristine(
  'isPristine.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
