import createOnBlur from './events/createOnBlur'
import createOnChange from './events/createOnChange'
import createOnDragStart from './events/createOnDragStart'
import createOnDrop from './events/createOnDrop'
import createOnFocus from './events/createOnFocus'
import partial from './util/partial'
import noop from './util/noop'

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
  return props
}

const createFieldProps = (getIn, name,
  { asyncError, blur, change, focus, initial, state, submitError, submitFailed,
    value, _value, ...rest }, syncError, initialPropValue, defaultValue = '', asyncValidate = noop) => {
  const error = syncError || asyncError || submitError
  const onChange = createOnChange(change)
  const initialValue = initial || initialPropValue
  return processProps({
    active: state && !!getIn(state, 'active'),
    dirty: value !== initialValue,
    error,
    invalid: !!error,
    name,
    onBlur: createOnBlur(blur, partial(asyncValidate, name)),
    onChange,
    onDragStart: createOnDragStart(name, value),
    onDrop: createOnDrop(name, change),
    onFocus: createOnFocus(name, focus),
    onUpdate: onChange,
    pristine: value === initialValue,
    touched: !!(state && getIn(state, 'touched')),
    valid: !error,
    value: value === undefined ? defaultValue : value,
    visited: state && !!getIn(state, 'visited'),
    ...rest
  }, _value)
}

export default createFieldProps
