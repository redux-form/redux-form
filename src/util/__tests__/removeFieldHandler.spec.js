import removeFieldHandler from '../removeFieldHandler'

it('removeFieldHandler should remove any handler from FieldProps', () => {
  const fieldProps = {
    input: {
      value: 'test',
      onChange: jest.fn(),
      onBlur: jest.fn(),
      name: 'nameTest',
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
  }
  const expected = {
    value: 'test',
    meta: fieldProps.meta
  }
  expect(removeFieldHandler(fieldProps)).toEqual(expected)
})
