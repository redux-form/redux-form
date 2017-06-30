// @flow
import getValue from './getValue'
import isReactNative from '../isReactNative'
import type { Event } from '../types'

const onChangeValue = (
  event: Event,
  {
    name,
    parse,
    normalize
  }: { name: string, parse?: Function, normalize?: Function }
) => {
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
