import { Iterable } from 'immutable'

import isEqualWith from 'lodash/isEqualWith'

const customizer = (obj, other) => {
  if (obj === undefined && other === '') return true
  if (obj === '' && other === undefined) return true

  if (Iterable.isIterable(obj) && Iterable.isIterable(other)) {
    return obj.count() === other.count() && obj.every((value, key) => {
      return isEqualWith(value, other.get(key), customizer)
    })
  }

  return void 0
}

const deepEqualValues = (a, b) => {
  return isEqualWith(a, b, customizer)
}

export default deepEqualValues
