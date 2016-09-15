import { Iterable } from 'immutable'

import { isEqualWith } from 'lodash'

const customizer = (obj, other) => {
  if (obj == other) return true
  if ((obj == null || obj === '' || obj === false) &&
    (other == null || other === '' || other === false)) return true

  if (Iterable.isIterable(obj) && Iterable.isIterable(other)) {
    return obj.count() === other.count() && obj.every((value, key) => {
      return isEqualWith(value, other.get(key), customizer)
    })
  }

  return void 0
}

const deepEqual = (a, b) => isEqualWith(a, b, customizer)

export default deepEqual
