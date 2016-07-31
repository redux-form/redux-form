import createOnBlur from './events/createOnBlur'
import createOnChange from './events/createOnChange'
import createOnDragStart from './events/createOnDragStart'
import createOnDrop from './events/createOnDrop'
import createOnFocus from './events/createOnFocus'
import { noop } from 'lodash'

const processProps = (props, _value) => {
  const { type, value, ...rest } = props
  if (type === 'checkbox') {
    return {
      ...rest,
      checked: !!value,
      type
    }
  }
  if (type === 'radio') {
    return {
      ...rest,
      checked: value === _value,
      type,
      value: _value
    }
  }
  if (type === 'select-multiple') {
    return {
      ...rest,
      type,
      value: value || []
    }
  }
  if (type === 'file') {
    return {
      ...rest,
      type,
      value: undefined
    }
  }
  return props
}

const createFieldProps = (getIn, name,
  {
    asyncError, asyncValidating, blur, change, defaultValue = '', dirty, focus, format, normalize,
    parse, pristine, props, state, submitError, value, _value, syncError, ...rest
  }, asyncValidate = noop) => {
  const error = syncError || asyncError || submitError
  const onChange = createOnChange(change, { normalize, parse })
  const fieldValue = value == null ? defaultValue : value
  const input = processProps({
    name,
    onBlur: createOnBlur(blur, { normalize, parse, after: asyncValidate.bind(null, name) }),
    onChange,
    onDragStart: createOnDragStart(name, fieldValue),
    onDrop: createOnDrop(name, change),
    onFocus: createOnFocus(name, focus),
    value: format ? format(fieldValue) : fieldValue,
    ...props,
    ...rest
  }, _value)
  return {
    active: state && !!getIn(state, 'active'),
    asyncValidating,
    dirty,
    error,
    invalid: !!error,
    input,
    pristine,
    touched: !!(state && getIn(state, 'touched')),
    valid: !error,
    visited: state && !!getIn(state, 'visited')
  }
}

export default createFieldProps
