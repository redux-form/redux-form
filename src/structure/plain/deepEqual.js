// @flow
import { isEqualWith } from 'lodash'

const customizer = (obj: any, other: any) => {
  if (obj === other) return true
  if (
    (obj == null || obj === '' || obj === false) &&
    (other == null || other === '' || other === false)
  ) {
    return !((obj === undefined && other === false) ||
      (obj === false && other === undefined))
  }

  if (obj && other && obj._error !== other._error) return false
  if (obj && other && obj._warning !== other._warning) return false
}

const deepEqual = (a: any, b: any) => isEqualWith(a, b, customizer)

export default deepEqual
