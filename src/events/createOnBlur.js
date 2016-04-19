import getValue from './getValue'
import isReactNative from '../isReactNative'

const createOnBlur =
  (blur, afterBlur) =>
    event => {
      const value = getValue(event, isReactNative)
      blur(value)
      if (afterBlur) {
        afterBlur(value)
      }
    }
export default createOnBlur
