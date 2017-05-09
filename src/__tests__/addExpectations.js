import expect from 'expect'

/**
 * Takes expectations and extends expect with them. Cannot use expect.extends due to the
 * asynchronous nature of the tests.
 * @param expectations Expectations to add
 */
const addExpectations = expectations => {
  const decorate = dest => {
    const wrap = (value, key) => {
      if (typeof value === 'function' && key !== 'actual') {
        dest[key] = (...params) => decorate(value.apply(dest, params))
      }
    }
    for (let key in dest) {
      if (Object.prototype.hasOwnProperty.call(dest, key)) {
        wrap(dest[key], key)
      }
    }
    for (let key in expectations) {
      if (Object.prototype.hasOwnProperty.call(expectations, key)) {
        wrap(expectations[key], key)
      }
    }
    return dest
  }
  return (...params) => decorate(expect(...params))
}

export default addExpectations
