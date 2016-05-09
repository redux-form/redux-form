/**
 * Maps all the values in the given object through the given function and saves them, by key, to a result object
 */
const mapValues = (obj, fn) => {
  if (obj !== Object(obj)) {
    return obj
  } else {
    const acc = {}
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      acc[key] = fn(obj[key], key)
    }

    return acc
  }
}

export default mapValues
