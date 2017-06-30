// @flow
import plain from './structure/plain'
import type { Structure } from './types'

export type Validator = { (values: any, props: Object): Object }

const toArray = value => (Array.isArray(value) ? value : [value])

const getError = (
  value: any,
  values: Object,
  props: Object,
  validators: any
) => {
  const array = toArray(validators)
  for (let i = 0; i < array.length; i++) {
    const error = array[i](value, values, props)
    if (error) {
      return error
    }
  }
}

const generateValidator = (
  validators: Object,
  { getIn }: Structure<*, *>
): Validator => (values: any, props: Object) => {
  let errors = {}
  Object.keys(validators).forEach(name => {
    const value = getIn(values, name)
    const error = getError(value, values, props, validators[name])
    if (error) {
      errors = plain.setIn(errors, name, error)
    }
  })
  return errors
}

export default generateValidator
