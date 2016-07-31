import getValue from './getValue'
import isReactNative from '../isReactNative'

const createOnBlur =
  (blur, { after, normalize, parse } = {}) =>
    event => {
      // read value from input
      let value = getValue(event, isReactNative)

      // parse value if we have a parser
      if (parse) {
        value = parse(value)
      }

      // normalize value
      if (normalize) {
        value = normalize(value)
      }

      // dispatch blur action
      blur(value)

      // call after callback
      if (after) {
        after(value)
      }
    }

export default createOnBlur
