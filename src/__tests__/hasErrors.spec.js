import createHasErrors from '../hasErrors'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeHasErrors = (name, structure, expect) => {
  const { fromJS, getIn, setIn } = structure
  const hasErrors = createHasErrors(structure)

  describe(name, () => {
    it('should return false for falsy values', () => {
      expect(hasErrors(undefined)).toBe(false)
      expect(hasErrors(null)).toBe(false)
      expect(hasErrors('')).toBe(false)
      expect(hasErrors(0)).toBe(false)
      expect(hasErrors(false)).toBe(false)
    })

    it('should return false for empty structures', () => {
      expect(hasErrors(fromJS({}))).toBe(false)
      expect(hasErrors(fromJS([]))).toBe(false)
    })

    it('should return structures filled with undefined values', () => {
      expect(hasErrors(fromJS({
        foo: undefined,
        bar: undefined
      }))).toBe(false)
      expect(hasErrors(fromJS([
        undefined,
        undefined
      ]))).toBe(false)
    })

    it('should return false for deeply nested structures with undefined values', () => {
      expect(hasErrors(fromJS({
        nested: {
          myArrayField: [
            undefined,
            undefined
          ]
        }
      }))).toBe(false)
      expect(hasErrors(fromJS({
        nested: {
          deeper: {
            foo: undefined,
            bar: undefined
          }
        }
      }))).toBe(false)
    })

    it('should return true for non-empty strings', () => {
      expect(hasErrors('dog')).toBe(true)
      expect(hasErrors(true)).toBe(false)
      expect(hasErrors(42)).toBe(false)
    })

    it('should return true for an empty array with a string error under _error key', () => {
      const errors = setIn(fromJS([]), '_error', 'oh no!')
      if(getIn(errors, '_error') === 'oh no!') {
        // cannot work for Immutable Lists because you can not set a value under a string key
        expect(hasErrors(errors)).toBe(true)
      }
    })

    it('should return true for an empty array with an object error under _error key', () => {
      const errors = setIn(fromJS([]), '_error', { complex: 'error' })
      if(getIn(errors, '_error')) {
        // cannot work for Immutable Lists because you can not set a value under a string key
        expect(hasErrors(errors)).toBe(true)
      }
    })
  })
}

describeHasErrors('hasErrors.plain', plain, addExpectations(plainExpectations))
describeHasErrors('hasErrors.immutable', immutable, addExpectations(immutableExpectations))

