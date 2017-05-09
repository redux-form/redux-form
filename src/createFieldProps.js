const processProps = (type, props, _value) => {
  const {value} = props
  if (type === 'checkbox') {
    return {
      ...props,
      checked: !!value,
    }
  }
  if (type === 'radio') {
    return {
      ...props,
      checked: value === _value,
      value: _value,
    }
  }
  if (type === 'select-multiple') {
    return {
      ...props,
      value: value || [],
    }
  }
  if (type === 'file') {
    return {
      ...props,
      value: value || undefined,
    }
  }
  return props
}

const createFieldProps = (
  {getIn, toJS},
  name,
  {
    asyncError,
    asyncValidating,
    onBlur,
    onChange,
    onDrop,
    onDragStart,
    dirty,
    dispatch,
    onFocus,
    form,
    format,
    initial,
    parse, // eslint-disable-line no-unused-vars
    pristine,
    props,
    state,
    submitError,
    submitFailed,
    submitting,
    syncError,
    syncWarning,
    validate, // eslint-disable-line no-unused-vars
    value,
    _value,
    warn, // eslint-disable-line no-unused-vars
    ...custom
  }
) => {
  const error = syncError || asyncError || submitError
  const warning = syncWarning

  const formatFieldValue = (value, format) => {
    if (format === null) {
      return value
    }
    const defaultFormattedValue = value == null ? '' : value
    return format ? format(value, name) : defaultFormattedValue
  }

  const formattedFieldValue = formatFieldValue(value, format)

  return {
    input: processProps(
      custom.type,
      {
        name,
        onBlur,
        onChange,
        onDragStart,
        onDrop,
        onFocus,
        value: formattedFieldValue,
      },
      _value
    ),
    meta: {
      ...toJS(state),
      active: !!(state && getIn(state, 'active')),
      asyncValidating,
      autofilled: !!(state && getIn(state, 'autofilled')),
      dirty,
      dispatch,
      error,
      form,
      initial,
      warning,
      invalid: !!error,
      pristine,
      submitting: !!submitting,
      submitFailed: !!submitFailed,
      touched: !!(state && getIn(state, 'touched')),
      valid: !error,
      visited: !!(state && getIn(state, 'visited')),
    },
    custom: {...custom, ...props},
  }
}

export default createFieldProps
