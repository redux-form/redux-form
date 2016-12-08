import plain from './structure/plain'

const toArray = value => Array.isArray(value) ? value : [ value ]

const getError = (value, values, validators) => {
  for(const validator of toArray(validators)) {
    const error = validator(value, values)
    if(error) {
      return error
    }
  }
}

const generateValidator = (validators, { getIn }) =>
  values => {
    let errors = {}
    Object.keys(validators).forEach(name => {
      const value = getIn(values, name)
      const error = getError(value, values, validators[name])
      if(error) {
        errors = plain.setIn(errors, name, error)
      }
    })
    return errors
  }

export default generateValidator
