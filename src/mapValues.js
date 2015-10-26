/**
 * Maps all the values in the given object through the given function and saves them, by key, to a result object
 */
export default function mapValues(obj, fn) {
  return obj ? Object.keys(obj).reduce((accumulator, key) => ({
    ...accumulator,
    [key]: fn(obj[key], key)
  }), {}) : obj;
}
