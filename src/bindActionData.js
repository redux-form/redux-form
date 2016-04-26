import mapValues from './util/mapValues'

/**
 * Adds additional properties to the results of the function or map of functions passed
 */
export default function bindActionData(action, data) {
  if (typeof action === 'function') {
    return (...args) => ({
      ...action(...args),
      ...data
    })
  }
  if (typeof action === 'object') {
    return mapValues(action, value => bindActionData(value, data))
  }
  return action
}
