import createIsDirty from '../isDirty'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/__tests__/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/__tests__/expectations'

const describeIsDirty = (name, structure, setup) => {
  const isDirty = createIsDirty(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(typeof isDirty('foo')).toBe('function')
    })

    it('should return false when values not present', () => {
      expect(
        isDirty('foo')(
          fromJS({
            form: {}
          })
        )
      ).toBe(false)
    })

    it('should return false when values are pristine', () => {
      expect(
        isDirty('foo')(
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
      ).toBe(false)
    })

    it('should return true when values are dirty', () => {
      expect(
        isDirty('foo')(
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
      ).toBe(true)
    })

    it('should use getFormState if provided', () => {
      expect(
        isDirty('foo', state => getIn(state, 'someOtherSlice'))(
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
      ).toBe(true)
    })

    it('should return false if specified fields pristine', () => {
      expect(
        isDirty('foo')(
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
          }),
          'cat'
        )
      ).toBe(false)
    })

    it('should return true if specified fields dirty', () => {
      expect(
        isDirty('foo')(
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
          }),
          'cat',
          'dog'
        )
      ).toBe(true)
    })
  })
}

describeIsDirty('isDirty.plain', plain, () => expect.extend(plainExpectations))
describeIsDirty('isDirty.immutable', immutable, () =>
  expect.extend(immutableExpectations)
)
