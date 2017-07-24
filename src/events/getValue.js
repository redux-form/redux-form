// @flow
import isEvent from './isEvent'
import type { Event } from '../types'

const getSelectedValues = options => {
  const result = []
  if (options) {
    for (let index = 0; index < options.length; index++) {
      const option = options[index]
      if (option.selected) {
        result.push(option.value)
      }
    }
  }
  return result
}

const getValue = (event: Event, isReactNative: ?boolean) => {
  if (isEvent(event)) {
    if (
      !isReactNative &&
      event.nativeEvent &&
      event.nativeEvent.text !== undefined
    ) {
      return event.nativeEvent.text
    }
    if (isReactNative && event.nativeEvent !== undefined) {
      return event.nativeEvent.text
    }
    const detypedEvent: any = event
    const {
      target: { type, value, checked, files },
      dataTransfer
    } = detypedEvent
    if (type === 'checkbox') {
      return checked || ''
    }
    if (type === 'file') {
      return files || (dataTransfer && dataTransfer.files)
    }
    if (type === 'select-multiple') {
      return getSelectedValues(event.target.options)
    }
    return value
  }
  return event
}

export default getValue
