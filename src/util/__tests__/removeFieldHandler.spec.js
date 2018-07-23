import { removeFieldHandlers, removeFieldsHandlers } from '../removeHandlers'

describe('removeHandlers', () => {
  const createFieldProp = name => ({
    input: {
      value: 'value',
      onChange: jest.fn(),
      onBlur: jest.fn(),
      name,
      onDrop: jest.fn(),
      onDragStart: jest.fn(),
      onFocus: jest.fn()
    },
    meta: {
      active: false,
      asyncValidating: false,
      autofilled: false,
      dirty: false,
      dispatch: jest.fn(),
      form: 'formTest',
      invalid: false,
      pristine: true,
      submitting: false,
      submitFailed: false,
      touched: false,
      valid: false,
      visited: false
    }
  })

  const checkForRemoveHandlers = field => {
    expect(field).not.toHaveProperty('onChange')
    expect(field).not.toHaveProperty('onBlur')
    expect(field).not.toHaveProperty('onDrop')
    expect(field).not.toHaveProperty('onDragStart')
    expect(field).not.toHaveProperty('onFocus')
    expect(field).not.toHaveProperty('dispatch')
  }

  describe('removeFieldHandlers', () => {
    const field = createFieldProp('test')
    const result = removeFieldHandlers(field)

    it('should remove all handlers from FieldProps', () => {
      checkForRemoveHandlers(result)
    })

    it('should send input attributes in result', () => {
      expect(result.value).toBe('value')
      expect(result.name).toBe('test')
    })

    it('should send meta attributes in result', () => {
      const { dispatch, ...meta } = field.meta
      expect(result).toEqual(expect.objectContaining(meta))
    })
  })

  describe('removeFieldsHandlers', () => {
    it('should return fields with the handlers removed', () => {
      const fields = {
        fieldA: createFieldProp('fieldA'),
        fieldB: createFieldProp('fieldB'),
        names: ['fieldA', 'fieldB']
      }

      const result = removeFieldsHandlers(fields)
      expect(result).toHaveProperty('fieldA')
      checkForRemoveHandlers(result.fieldA)
      expect(result).toHaveProperty('fieldB')
      checkForRemoveHandlers(result.fieldB)
    })

    it('should only return fields which are inside names array', () => {
      const fields = {
        fieldA: createFieldProp('fieldA'),
        fieldB: createFieldProp('fieldB'),
        names: ['fieldA']
      }

      const result = removeFieldsHandlers(fields)
      expect(result).toHaveProperty('fieldA')
      expect(result).not.toHaveProperty('fieldB')
    })

    it('should remove field if name exists but field not', () => {
      const fields = {
        fieldA: createFieldProp('fieldA'),
        names: ['fieldA', 'fieldB']
      }

      const result = removeFieldsHandlers(fields)
      expect(result).toHaveProperty('fieldA')
      expect(result).not.toHaveProperty('fieldB')
    })

    it('should returns fields with nested form prefix', () => {
      const fields = {
        fieldA: createFieldProp('asd.fieldA'),
        names: ['asd.fieldA']
      }

      const result = removeFieldsHandlers(fields)
      expect(result).toHaveProperty(['asd.fieldA'])
    })
  })
})
