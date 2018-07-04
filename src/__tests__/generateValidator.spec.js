import generateValidator from '../generateValidator'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/__tests__/expectations'

const describeGenerateValidator = (name, structure, setup) => {
  const { fromJS } = structure
  const required = value => (value == null ? 'Required' : undefined)
  const minValue = min => value =>
    value && value < min ? 'Too low' : undefined
  const withProps = (value, values, props) =>
    props.valid ? undefined : 'Invalid'
  const withName = validatorName => (value, values, props, name) =>
    validatorName === name ? undefined : 'Invalid name'

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      const validator = generateValidator({}, structure)
      expect(typeof validator).toBe('function')
    })

    it('should always pass validation when no validators given', () => {
      const validator = generateValidator({}, structure)
      expect(validator(fromJS({}))).toEqual({})
      expect(
        validator(
          fromJS({
            foo: 42,
            bar: 43
          })
        )
      ).toEqual({})
    })

    it('should validate simple fields', () => {
      const requiredSpy = jest.fn(required)
      const minValueSpy = jest.fn(minValue(4))
      const validator = generateValidator(
        {
          foo: requiredSpy,
          bar: minValueSpy
        },
        structure
      )

      expect(requiredSpy).not.toHaveBeenCalled()
      expect(minValueSpy).not.toHaveBeenCalled()

      const values1 = fromJS({})
      const result = validator(values1)
      expect(requiredSpy).toHaveBeenCalled()
      expect(requiredSpy).toHaveBeenCalledTimes(1)
      expect(requiredSpy.mock.calls[0][0]).toBe(undefined)
      expect(requiredSpy.mock.calls[0][1]).toEqual(values1)
      expect(minValueSpy).toHaveBeenCalled()
      expect(minValueSpy).toHaveBeenCalledTimes(1)
      expect(minValueSpy.mock.calls[0][0]).toBe(undefined)
      expect(minValueSpy.mock.calls[0][1]).toEqual(values1)
      expect(result).toEqual({
        foo: 'Required'
      })

      const values2 = fromJS({
        foo: 'Hello',
        bar: 3
      })
      const result2 = validator(values2)
      expect(requiredSpy).toHaveBeenCalledTimes(2)
      expect(requiredSpy.mock.calls[1][0]).toBe('Hello')
      expect(requiredSpy.mock.calls[1][1]).toEqual(values2)
      expect(minValueSpy).toHaveBeenCalledTimes(2)
      expect(minValueSpy.mock.calls[1][0]).toBe(3)
      expect(minValueSpy.mock.calls[1][1]).toEqual(values2)
      expect(result2).toEqual({
        bar: 'Too low'
      })

      const values3 = fromJS({
        foo: 'Hello',
        bar: 4
      })
      const result3 = validator(values3)
      expect(requiredSpy).toHaveBeenCalledTimes(3)
      expect(requiredSpy.mock.calls[2][0]).toBe('Hello')
      expect(requiredSpy.mock.calls[2][1]).toEqual(values3)
      expect(minValueSpy).toHaveBeenCalledTimes(3)
      expect(minValueSpy.mock.calls[2][0]).toBe(4)
      expect(minValueSpy.mock.calls[2][1]).toEqual(values3)
      expect(result3).toEqual({})
    })

    it('allows validation to refer to props', () => {
      const withPropsSpy = jest.fn(withProps)
      const props1 = { valid: false }
      const props2 = { valid: true }
      const validator = generateValidator({ foo: withPropsSpy }, structure)

      expect(withPropsSpy).not.toHaveBeenCalled()

      const values = fromJS({})
      const result1 = validator(values, props1)
      expect(withPropsSpy).toHaveBeenCalled()
      expect(withPropsSpy).toHaveBeenCalledTimes(1)
      expect(withPropsSpy.mock.calls[0][0]).toBe(undefined)
      expect(withPropsSpy.mock.calls[0][1]).toEqual(values)
      expect(withPropsSpy.mock.calls[0][2]).toEqual(props1)
      expect(result1).toEqual({
        foo: 'Invalid'
      })

      const result2 = validator(values, props2)
      expect(withPropsSpy).toHaveBeenCalledTimes(2)
      expect(withPropsSpy.mock.calls[1][0]).toBe(undefined)
      expect(withPropsSpy.mock.calls[1][1]).toEqual(values)
      expect(withPropsSpy.mock.calls[1][2]).toEqual(props2)
      expect(result2).toEqual({})
    })

    it('allows validation to refer to field name', () => {
      const name = 'foobar'
      const withNameSpy = jest.fn(withName(name))
      const validator = generateValidator({ [name]: withNameSpy }, structure)

      expect(withNameSpy).not.toHaveBeenCalled()

      const values = fromJS({})
      const result1 = validator(values)
      expect(withNameSpy).toHaveBeenCalled()
      expect(withNameSpy).toHaveBeenCalledTimes(1)
      expect(withNameSpy.mock.calls[0][0]).toBe(undefined)
      expect(withNameSpy.mock.calls[0][1]).toEqual(values)
      expect(withNameSpy.mock.calls[0][2]).toEqual(undefined)
      expect(withNameSpy.mock.calls[0][3]).toEqual(name)
      expect(result1).toEqual({})
    })

    it('should validate deep fields', () => {
      const requiredSpy = jest.fn(required)
      const minValueSpy = jest.fn(minValue(4))
      const validator = generateValidator(
        {
          'deep.foo': requiredSpy,
          'even.deeper.bar': minValueSpy
        },
        structure
      )

      expect(requiredSpy).not.toHaveBeenCalled()
      expect(minValueSpy).not.toHaveBeenCalled()

      const result = validator(fromJS({}))
      expect(requiredSpy).toHaveBeenCalled()
      expect(requiredSpy).toHaveBeenCalledTimes(1)
      expect(requiredSpy.mock.calls[0][0]).toBe(undefined)
      expect(requiredSpy.mock.calls[0][1]).toEqual(fromJS({}))
      expect(minValueSpy).toHaveBeenCalled()
      expect(minValueSpy).toHaveBeenCalledTimes(1)
      expect(minValueSpy.mock.calls[0][0]).toBe(undefined)
      expect(minValueSpy.mock.calls[0][1]).toEqual(fromJS({}))
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
      expect(requiredSpy).toHaveBeenCalledTimes(2)
      expect(requiredSpy.mock.calls[1][0]).toBe('Hello')
      expect(requiredSpy.mock.calls[1][1]).toEqual(values2)
      expect(minValueSpy).toHaveBeenCalledTimes(2)
      expect(minValueSpy.mock.calls[1][0]).toBe(3)
      expect(minValueSpy.mock.calls[1][1]).toEqual(values2)
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
      expect(requiredSpy).toHaveBeenCalledTimes(3)
      expect(requiredSpy.mock.calls[2][0]).toBe('Hello')
      expect(requiredSpy.mock.calls[2][1]).toEqual(values3)
      expect(minValueSpy).toHaveBeenCalledTimes(3)
      expect(minValueSpy.mock.calls[2][0]).toBe(4)
      expect(minValueSpy.mock.calls[2][1]).toEqual(values3)
      expect(result3).toEqual({})
    })

    it('should accept multiple validators', () => {
      const requiredSpy = jest.fn(required)
      const minValueSpy = jest.fn(minValue(4))
      const validator = generateValidator(
        {
          foo: [requiredSpy, minValueSpy]
        },
        structure
      )

      expect(requiredSpy).not.toHaveBeenCalled()
      expect(minValueSpy).not.toHaveBeenCalled()

      const values1 = fromJS({})
      const result1 = validator(values1)
      expect(requiredSpy).toHaveBeenCalled()
      expect(requiredSpy).toHaveBeenCalledTimes(1)
      expect(requiredSpy.mock.calls[0][0]).toBe(undefined)
      expect(requiredSpy.mock.calls[0][1]).toEqual(values1)
      expect(minValueSpy).not.toHaveBeenCalled() // because required errored
      expect(result1).toEqual({
        foo: 'Required'
      })

      const values2 = fromJS({ foo: '3' })
      const result2 = validator(values2)
      expect(requiredSpy).toHaveBeenCalledTimes(2)
      expect(requiredSpy.mock.calls[1][0]).toBe('3')
      expect(requiredSpy.mock.calls[1][1]).toEqual(values2)
      expect(minValueSpy).toHaveBeenCalled()
      expect(minValueSpy).toHaveBeenCalledTimes(1)
      expect(minValueSpy.mock.calls[0][0]).toBe('3')
      expect(minValueSpy.mock.calls[0][1]).toEqual(values2)
      expect(result2).toEqual({
        foo: 'Too low'
      })

      const values3 = fromJS({ foo: '4' })
      const result3 = validator(values3)
      expect(requiredSpy).toHaveBeenCalledTimes(3)
      expect(requiredSpy.mock.calls[2][0]).toBe('4')
      expect(requiredSpy.mock.calls[2][1]).toEqual(values3)
      expect(minValueSpy).toHaveBeenCalledTimes(2)
      expect(minValueSpy.mock.calls[1][0]).toBe('4')
      expect(minValueSpy.mock.calls[1][1]).toEqual(values3)
      expect(result3).toEqual({})
    })
  })
}

describeGenerateValidator('generateValidator.plain', plain, () =>
  expect.extend(plainExpectations)
)
describeGenerateValidator('generateValidator.immutable', immutable, () =>
  expect.extend(immutableExpectations)
)
