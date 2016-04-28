import createOnBlur from './events/createOnBlur'
import createOnChange from './events/createOnChange'
import createOnDragStart from './events/createOnDragStart'
import createOnDrop from './events/createOnDrop'
import createOnFocus from './events/createOnFocus'
import partial from './util/partial'
import noop from './util/noop'

const createFieldArrayProps = (getIn, name,
  {
    asyncError, blur, change, focus, initial, state, submitError, submitFailed,
    value, _value, ...rest
  }, syncError, initialPropValue, defaultValue = '', asyncValidate = noop) => {
  const error = syncError || asyncError || submitError
  const onChange = createOnChange(change)
  const initialValue = initial || initialPropValue
  return {
    array: {
      push: null,
      pop: null,
      shift: null,
      unshift: null,
      map: null,
      length: null,
      forEach: null,
      ...rest
    }
  }
}

export default createFieldArrayProps
