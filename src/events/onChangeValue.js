import getValue from './getValue'
import isReactNative from '../isReactNative'

const onChangeValue = (event, { parse, normalize }) => {
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

  return value
}

export default onChangeValue
