/**
 * Returns true of the predicate is true for every (value, key) pair in the Object or array
 */
export default function every(object, predicate) {
  if(!object) {
    return true
  }
  if(Array.isArray(object)) {
    return !object.length || object.every(predicate)
  }
  const keys = Object.keys(object)
  return !keys.length || keys.every(key => predicate(object[key], key, object))
}
