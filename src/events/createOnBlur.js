import getValue from './getValue'
import isEvent from './isEvent'
import isReactNative from '../isReactNative'

const createOnBlur =
  (blur, { after, normalize, parse } = {}) =>
    event => {
      // read value from input
      let value = getValue(event, isReactNative)
      let newValue
      let changed = false
      let distanceFromEnd = -1
      let validInputTypes = [ 'text', 'search', 'url', 'tel', 'password' ]
      // get distance between caret and end of original value
      if (isEvent(event) && validInputTypes.indexOf(event.target.type) !== -1) {
        distanceFromEnd = value.length - event.target.selectionEnd
      }

      // parse value if we have a parser
      if (parse) {
        newValue = parse(value)
        if (newValue !== value) {
          changed = true
          value = newValue
        }
      }

      // normalize value
      if (normalize) {
        newValue = normalize(value)
        if (newValue !== value) {
          changed = true
          value = newValue
        }
      }

      // move caret to appropriate position if value has changed
      if (changed && distanceFromEnd !== -1) {
        event.persist()
        setTimeout(() => event.target.selectionStart = event.target.selectionEnd = value.length - distanceFromEnd)
      }

      // dispatch blur action
      blur(value)

      // call after callback
      if (after) {
        after(value)
      }
    }

export default createOnBlur
