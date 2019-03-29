// @flow
import React from 'react'
import { isEqualWith, isNil } from 'lodash'

const isEmpty = (obj: any) => {
  return isNil(obj) || obj === '' || isNaN(obj)
}

const customizer = (obj: any, other: any) => {
  if (obj === other) return true

  if (!obj && !other) {
    return isEmpty(obj) === isEmpty(other)
  }

  if (obj && other && obj._error !== other._error) return false
  if (obj && other && obj._warning !== other._warning) return false
  if (React.isValidElement(obj) || React.isValidElement(other)) return false
}

const deepEqual = (a: any, b: any) => isEqualWith(a, b, customizer)

export default deepEqual
