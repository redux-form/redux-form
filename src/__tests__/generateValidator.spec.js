import { createSpy } from 'expect'
import generateValidator from '../generateValidator'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeGenerateValidator = (name, structure, expect) => {
  const { fromJS } = structure
  const required = value => value == null ? 'Required' : undefined
  const minValue = min => value => value && value < min ? 'Too low' : undefined

  describe(name, () => {
    it('should return a function', () => {
      const validator = generateValidator({}, structure)
      expect(validator).toBeA('function')
    })

    it('should always pass validation when no validators given', () => {
      const validator = generateValidator({}, structure)
      expect(validator(fromJS({}))).toEqual({})
      expect(validator(fromJS({
        foo: 42,
        bar: 43
      }))).toEqual({})
    })

    it('should validate simple fields', () => {
      const requiredSpy = createSpy(required).andCallThrough()
      const minValueSpy = createSpy(minValue(4)).andCallThrough()
      const validator = generateValidator({
        foo: requiredSpy,
        bar: minValueSpy
      }, structure)

      expect(requiredSpy).toNotHaveBeenCalled()
      expect(minValueSpy).toNotHaveBeenCalled()

      const values1 = fromJS({})
      const result = validator(values1)
      expect(requiredSpy).toHaveBeenCalled()
      expect(requiredSpy.calls.length).toBe(1)
      expect(requiredSpy.calls[ 0 ].arguments[ 0 ]).toBe(undefined)
      expect(requiredSpy.calls[ 0 ].arguments[ 1 ]).toEqual(values1)
      expect(minValueSpy).toHaveBeenCalled()
      expect(minValueSpy.calls.length).toBe(1)
      expect(minValueSpy.calls[ 0 ].arguments[ 0 ]).toBe(undefined)
      expect(minValueSpy.calls[ 0 ].arguments[ 1 ]).toEqual(values1)
      expect(result).toEqual({
        foo: 'Required'
      })

      const values2 = fromJS({
        foo: 'Hello',
        bar: 3
      })
      const result2 = validator(values2)
      expect(requiredSpy.calls.length).toBe(2)
      expect(requiredSpy.calls[ 1 ].arguments[ 0 ]).toBe('Hello')
      expect(requiredSpy.calls[ 1 ].arguments[ 1 ]).toEqual(values2)
      expect(minValueSpy.calls.length).toBe(2)
      expect(minValueSpy.calls[ 1 ].arguments[ 0 ]).toBe(3)
      expect(minValueSpy.calls[ 1 ].arguments[ 1 ]).toEqual(values2)
      expect(result2).toEqual({
        bar: 'Too low'
      })

      const values3 = fromJS({
        foo: 'Hello',
        bar: 4
      })
      const result3 = validator(values3)
      expect(requiredSpy.calls.length).toBe(3)
      expect(requiredSpy.calls[ 2 ].arguments[ 0 ]).toBe('Hello')
      expect(requiredSpy.calls[ 2 ].arguments[ 1 ]).toEqual(values3)
      expect(minValueSpy.calls.length).toBe(3)
      expect(minValueSpy.calls[ 2 ].arguments[ 0 ]).toBe(4)
      expect(minValueSpy.calls[ 2 ].arguments[ 1 ]).toEqual(values3)
      expect(result3).toEqual({})
    })

    it('should validate deep fields', () => {
      const requiredSpy = createSpy(required).andCallThrough()
      const minValueSpy = createSpy(minValue(4)).andCallThrough()
      const validator = generateValidator({
        'deep.foo': requiredSpy,
        'even.deeper.bar': minValueSpy
      }, structure)

      expect(requiredSpy).toNotHaveBeenCalled()
      expect(minValueSpy).toNotHaveBeenCalled()

      const result = validator(fromJS({}))
      expect(requiredSpy).toHaveBeenCalled()
      expect(requiredSpy.calls.length).toBe(1)
      expect(requiredSpy.calls[ 0 ].arguments[ 0 ]).toBe(undefined)
      expect(requiredSpy.calls[ 0 ].arguments[ 1 ]).toEqual(fromJS({}))
      expect(minValueSpy).toHaveBeenCalled()
      expect(minValueSpy.calls.length).toBe(1)
      expect(minValueSpy.calls[ 0 ].arguments[ 0 ]).toBe(undefined)
      expect(minValueSpy.calls[ 0 ].arguments[ 1 ]).toEqual(fromJS({}))
      expect(result).toEqual({
        deep: {
          foo: 'Required'
        }
      })

      const values2 = fromJS({
        deep: {
          foo: 'Hello'
        },
        even: {
          deeper: {
            bar: 3
          }
        }
      })
      const result2 = validator(values2)
      expect(requiredSpy.calls.length).toBe(2)
      expect(requiredSpy.calls[ 1 ].arguments[ 0 ]).toBe('Hello')
      expect(requiredSpy.calls[ 1 ].arguments[ 1 ]).toEqual(values2)
      expect(minValueSpy.calls.length).toBe(2)
      expect(minValueSpy.calls[ 1 ].arguments[ 0 ]).toBe(3)
      expect(minValueSpy.calls[ 1 ].arguments[ 1 ]).toEqual(values2)
      expect(result2).toEqual({
        even: {
          deeper: {
            bar: 'Too low'
          }
        }
      })

      const values3 = fromJS({
        deep: {
          foo: 'Hello'
        },
        even: {
          deeper: {
            bar: 4
          }
        }
      })
      const result3 = validator(values3)
      expect(requiredSpy.calls.length).toBe(3)
      expect(requiredSpy.calls[ 2 ].arguments[ 0 ]).toBe('Hello')
      expect(requiredSpy.calls[ 2 ].arguments[ 1 ]).toEqual(values3)
      expect(minValueSpy.calls.length).toBe(3)
      expect(minValueSpy.calls[ 2 ].arguments[ 0 ]).toBe(4)
      expect(minValueSpy.calls[ 2 ].arguments[ 1 ]).toEqual(values3)
      expect(result3).toEqual({})
    })

    it('should accept multiple validators', () => {
      const requiredSpy = createSpy(required).andCallThrough()
      const minValueSpy = createSpy(minValue(4)).andCallThrough()
      const validator = generateValidator({
        foo: [ requiredSpy, minValueSpy ]
      }, structure)

      expect(requiredSpy).toNotHaveBeenCalled()
      expect(minValueSpy).toNotHaveBeenCalled()

      const values1 = fromJS({})
      const result1 = validator(values1)
      expect(requiredSpy).toHaveBeenCalled()
      expect(requiredSpy.calls.length).toBe(1)
      expect(requiredSpy.calls[ 0 ].arguments[ 0 ]).toBe(undefined)
      expect(requiredSpy.calls[ 0 ].arguments[ 1 ]).toEqual(values1)
      expect(minValueSpy).toNotHaveBeenCalled() // because required errored
      expect(result1).toEqual({
        foo: 'Required'
      })

      const values2 = fromJS({ foo: '3' })
      const result2 = validator(values2)
      expect(requiredSpy.calls.length).toBe(2)
      expect(requiredSpy.calls[ 1 ].arguments[ 0 ]).toBe('3')
      expect(requiredSpy.calls[ 1 ].arguments[ 1 ]).toEqual(values2)
      expect(minValueSpy).toHaveBeenCalled()
      expect(minValueSpy.calls.length).toBe(1)
      expect(minValueSpy.calls[ 0 ].arguments[ 0 ]).toBe('3')
      expect(minValueSpy.calls[ 0 ].arguments[ 1 ]).toEqual(values2)
      expect(result2).toEqual({
        foo: 'Too low'
      })

      const values3 = fromJS({ foo: '4' })
      const result3 = validator(values3)
      expect(requiredSpy.calls.length).toBe(3)
      expect(requiredSpy.calls[ 2 ].arguments[ 0 ]).toBe('4')
      expect(requiredSpy.calls[ 2 ].arguments[ 1 ]).toEqual(values3)
      expect(minValueSpy.calls.length).toBe(2)
      expect(minValueSpy.calls[ 1 ].arguments[ 0 ]).toBe('4')
      expect(minValueSpy.calls[ 1 ].arguments[ 1 ]).toEqual(values3)
      expect(result3).toEqual({})
    })
  })
}

describeGenerateValidator('generateValidator.plain', plain, addExpectations(plainExpectations))
describeGenerateValidator('generateValidator.immutable', immutable, addExpectations(immutableExpectations))
