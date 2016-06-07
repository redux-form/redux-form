import getValue from './getValue'
import isReactNative from '../isReactNative'

const createOnChange = (change, normalize) =>
  event => change(normalize(getValue(event, isReactNative)))

export default createOnChange
