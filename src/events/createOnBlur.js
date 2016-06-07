import getValue from './getValue'
import isReactNative from '../isReactNative'

const createOnBlur =
  (blur, normalize, afterBlur) =>
    event => {
      const value = normalize(getValue(event, isReactNative))
      blur(value)
      if (afterBlur) {
        afterBlur(value)
      }
    }
export default createOnBlur
