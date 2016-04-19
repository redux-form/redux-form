import getValue from './getValue'
import isReactNative from '../isReactNative'

const createOnChange = change =>
  event => change(getValue(event, isReactNative))

export default createOnChange
