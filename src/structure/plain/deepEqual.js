// @flow
import React from 'react'
import { isEqualWith } from 'lodash'

const customizer = (obj: any, other: any) => {
  if (obj === other) return true

  if (!obj && !other) {
    const objIsEmpty = obj === null || obj === undefined || obj === ''
    const otherIsEmpty = other === null || other === undefined || other === ''
    return objIsEmpty === otherIsEmpty
  }

  if (obj && other && obj._error !== other._error) return false
  if (obj && other && obj._warning !== other._warning) return false
  if (React.isValidElement(obj) || React.isValidElement(other)) return false
}

const deepEqual = (a: any, b: any) => isEqualWith(a, b, customizer)

export default deepEqual
