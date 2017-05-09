import getValue from './getValue'
import isReactNative from '../isReactNative'

const onChangeValue = (event, {name, parse, normalize}) => {
  // read value from input
  let value = getValue(event, isReactNative)

  // parse value if we have a parser
  if (parse) {
    value = parse(value, name)
  }

  // normalize value
  if (normalize) {
    value = normalize(name, value)
  }

  return value
}

export default onChangeValue
