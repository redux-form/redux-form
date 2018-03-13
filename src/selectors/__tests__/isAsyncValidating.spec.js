import createIsAsyncValidating from '../isAsyncValidating'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/__tests__/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/__tests__/expectations'

const describeIsAsyncValidating = (name, structure, setup) => {
  const isAsyncValidating = createIsAsyncValidating(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function XXX', () => {
      expect(typeof isAsyncValidating('foo')).toBe('function')
    })

    it('should return false when value not present', () => {
      expect(
        isAsyncValidating('foo')(
          fromJS({
            form: {}
          })
        )
      ).toBe(false)
    })

    it('should return true when asynchronously validating', () => {
      expect(
        isAsyncValidating('foo')(
          fromJS({
            form: {
              foo: {
                asyncValidating: true
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should use getFormState if provided', () => {
      expect(
        isAsyncValidating('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                asyncValidating: true
              }
            }
          })
        )
      ).toBe(true)
    })
  })
}

describeIsAsyncValidating('isAsyncValidating.plain', plain, () =>
  expect.extend(plainExpectations)
)
describeIsAsyncValidating('isAsyncValidating.immutable', immutable, () =>
  expect.extend(immutableExpectations)
)
