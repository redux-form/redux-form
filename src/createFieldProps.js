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
    normalize, parse, pristine, props, state, submitError, submitting, value, _value, syncError,
    ...custom
  }, asyncValidate = noop) => {
  const error = syncError || asyncError || submitError
  const boundNormalize = normalize && (value => normalize(name, value))
  const boundChange = value => dispatch(change(name, value))
  const onChange = createOnChange(boundChange, {
    normalize: boundNormalize,
    parse
  })
  const fieldValue = value == null ? '' : value

  return {
    input: processProps(custom.type, {
      name,
      onBlur: createOnBlur(value => dispatch(blur(name, value)), {
        normalize: boundNormalize,
        parse,
        after: asyncValidate.bind(null, name)
      }),
      onChange,
      onDragStart: createOnDragStart(name, fieldValue),
      onDrop: createOnDrop(name, boundChange),
      onFocus: createOnFocus(name, () => dispatch(focus(name))),
      value: format ? format(fieldValue) : fieldValue
    }, _value),
    meta: {
      active: state && !!getIn(state, 'active'),
      asyncValidating,
      dirty,
      dispatch,
      error,
      invalid: !!error,
      pristine,
      submitting: !!submitting,
      touched: !!(state && getIn(state, 'touched')),
      valid: !error,
      visited: state && !!getIn(state, 'visited')
    },
    custom: { ...custom, ...props }
  }
}

export default createFieldProps
