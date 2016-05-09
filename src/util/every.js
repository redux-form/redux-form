/**
 * Returns true of the predicate is true for every (value, key) pair in the Object or array
 */
export default function every(object, predicate) {
  if (object !== Object(object)) {
    return true
  }

  if (Array.isArray(object)) {
    return !object.length || object.every(predicate)
  }

  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!predicate(object[key], key, object)) {
      return false
    }
  }

  return true
}
