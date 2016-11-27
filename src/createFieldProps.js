import createOnBlur from './events/createOnBlur'
import createOnChange from './events/createOnChange'
import createOnDragStart from './events/createOnDragStart'
import createOnDrop from './events/createOnDrop'
import createOnFocus from './events/createOnFocus'
import { noop } from 'lodash'

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
    asyncError, asyncValidating, blur, change, dirty, dispatch, focus, format,
    normalize, parse, pristine, props, state, submitError, submitting, value,
    _value, syncError, syncWarning, ...custom
  }, asyncValidate = noop) => {
  const error = syncError || asyncError || submitError
  const warning = syncWarning
  const boundParse = parse && (value => parse(value, name))
  const boundNormalize = normalize && (value => normalize(name, value))
  const boundChange = value => dispatch(change(name, value))
  const onChange = createOnChange(boundChange, {
    normalize: boundNormalize,
    parse: boundParse
  })

  const formatFieldValue = (value, format) => {
    if (format === null) {
      return value
    }
    const defaultFormattedValue = value == null ? '' : value
    return format ? format(value, name) : defaultFormattedValue
  }

  const formattedFieldValue = formatFieldValue(value, format)

  return {
    input: processProps(custom.type, {
      name,
      onBlur: createOnBlur(value => dispatch(blur(name, value)), {
        normalize: boundNormalize,
        parse: boundParse,
        after: asyncValidate.bind(null, name)
      }),
      onChange,
      onDragStart: createOnDragStart(name, formattedFieldValue),
      onDrop: createOnDrop(name, boundChange),
      onFocus: createOnFocus(name, () => dispatch(focus(name))),
      value: formattedFieldValue
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
