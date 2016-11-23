const processProps = (type, props, _value) => {
  const { value } = props
  if (type === 'checkbox') {
    return {
      ...props,
      checked: !!value
    }
  }
  if (type === 'radio') {
    return {
      ...props,
      checked: value === _value,
      value: _value
    }
  }
  if (type === 'select-multiple') {
    return {
      ...props,
      value: value || []
    }
  }
  if (type === 'file') {
    return {
      ...props,
      value: undefined
    }
  }
  return props
}

const createFieldProps = (getIn, name,
  {
    asyncError, asyncValidating, onBlur, onChange, onDrop, onDragStart, dirty, dispatch, onFocus, format,
    pristine, props, state, submitError, submitting, value,
    _value, syncError, syncWarning, ...custom
  }) => {
  const error = syncError || asyncError || submitError
  const warning = syncWarning
  const fieldValue = value == null ? '' : value

  return {
    input: processProps(custom.type, {
      name,
      onBlur,
      onChange,
      onDragStart,
      onDrop,
      onFocus,
      value: format ? format(fieldValue, name) : fieldValue
    }, _value),
    meta: {
      ...state,
      active: !!(state && getIn(state, 'active')),
      asyncValidating,
      autofilled: !!(state && getIn(state, 'autofilled')),
      dirty,
      dispatch,
      error,
      warning,
      invalid: !!error,
      pristine,
      submitting: !!submitting,
      touched: !!(state && getIn(state, 'touched')),
      valid: !error,
      visited: !!(state && getIn(state, 'visited'))
    },
    custom: { ...custom, ...props }
  }
}

export default createFieldProps
