// @flow
import { isCollection } from 'immutable'

import { isEqualWith } from 'lodash'

const customizer = (obj: any, other: any) => {
  if (obj === other) return true
  if (!obj && !other) {
    const objIsEmpty = obj === null || obj === undefined || obj === ''
    const otherIsEmpty = other === null || other === undefined || other === ''
    return objIsEmpty === otherIsEmpty
  }

  if (isCollection(obj) && isCollection(other)) {
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
