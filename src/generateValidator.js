import plain from './structure/plain'

const toArray = value => Array.isArray(value) ? value : [ value ]

const getError = (value, values, props, validators) => {
  for(const validator of toArray(validators)) {
    const error = validator(value, values, props)
    if(error) {
      return error
    }
  }
}

const generateValidator = (validators, { getIn }) =>
  (values, props) => {
    let errors = {}
    Object.keys(validators).forEach(name => {
      const value = getIn(values, name)
      const error = getError(value, values, props, validators[name])
      if(error) {
        errors = plain.setIn(errors, name, error)
      }
    })
    return errors
  }

export default generateValidator
