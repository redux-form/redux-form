import isEvent from './isEvent'

const getSelectedValues = options => {
  const result = []
  if (options) {
    for (let index = 0; index < options.length; index++) {
      const option = options[ index ]
      if (option.selected) {
        result.push(option.value)
      }
    }
  }
  return result
}

const getValue = (event, isReactNative) => {
  if (isEvent(event)) {
    if (!isReactNative && event.nativeEvent && event.nativeEvent.text !== undefined) {
      return event.nativeEvent.text
    }
    if (isReactNative && event.nativeEvent !== undefined) {
      return event.nativeEvent.text
    }
    const { target: { type, value, checked, files }, dataTransfer } = event
    if (type === 'checkbox') {
      return checked
    }
    if (type === 'file') {
      return files || dataTransfer && dataTransfer.files
    }
    if (type === 'select-multiple') {
      return getSelectedValues(event.target.options)
    }
    return value
  }
  // not an event, so must be either our value or an object containing our value in the 'value' key
  return event && typeof event === 'object' && event.value !== undefined ?
    event.value : // extract value from { value: value } structure. https://github.com/nikgraf/belle/issues/58
    event
}

export default getValue
