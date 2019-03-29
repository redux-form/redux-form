// @flow
import { Iterable } from 'immutable'

import { isEqualWith, isNil } from 'lodash'

const isEmpty = (obj: any) => {
  return isNil(obj) || obj === '' || isNaN(obj)
}

const customizer = (obj: any, other: any) => {
  if (obj === other) return true
  if (!obj && !other) {
    return isEmpty(obj) === isEmpty(other)
  }

  if (Iterable.isIterable(obj) && Iterable.isIterable(other)) {
    return (
      obj.count() === other.count() &&
      obj.every((value, key) => {
        return other.has(key) && isEqualWith(value, other.get(key), customizer)
      })
    )
  }

  return void 0
}

const deepEqual = (a: any, b: any) => isEqualWith(a, b, customizer)

export default deepEqual
