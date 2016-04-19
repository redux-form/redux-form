import { Iterable } from 'immutable'
import every from 'lodash.every'

const deepEqualValues = (a, b) => {
  if (a === undefined && b === '') return true
  if (a === '' && b === undefined) return true
  if (Iterable.isIterable(a)) {
    if (Iterable.isIterable(b)) {
      return a.count() === b.count() &&
        a.every((value, key) => deepEqualValues(value, b.get(key)))
    }
    return false
  }
  if (!a || !b || typeof a != 'object' && typeof b != 'object') {
    return a === b
  }
  return every(a, (value, key) => deepEqualValues(value, b[key]))
}

export default deepEqualValues
