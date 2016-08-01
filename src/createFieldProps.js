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
    asyncError, asyncValidating, blur, change, defaultValue = '', dirty, focus, format, normalize,
    parse, pristine, props, state, submitError, value, _value, syncError, ...custom
  }, asyncValidate = noop) => {
  const error = syncError || asyncError || submitError
  const onChange = createOnChange(change, { normalize, parse })
  const fieldValue = value == null ? defaultValue : value

  return {
    input: processProps(custom.type, {
      name,
      onBlur: createOnBlur(blur, { normalize, parse, after: asyncValidate.bind(null, name) }),
      onChange,
      onDragStart: createOnDragStart(name, fieldValue),
      onDrop: createOnDrop(name, change),
      onFocus: createOnFocus(name, focus),
      value: format ? format(fieldValue) : fieldValue
    }, _value),
    meta: {
      active: state && !!getIn(state, 'active'),
      asyncValidating,
      dirty,
      error,
      invalid: !!error,
      pristine,
      touched: !!(state && getIn(state, 'touched')),
      valid: !error,
      visited: state && !!getIn(state, 'visited')
    },
    ...props,
    ...custom
  }
}

export default createFieldProps
