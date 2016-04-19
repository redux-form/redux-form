/**
 * Mostly copied from https://github.com/substack/node-deep-equal
 *
 * The only change I've made, aside from making it ES6, was to force strict mode and make:
 *
 * deepEqual('', undefined) ==> true
 * deepEqual(undefined, '') ==> true
 *
 * This is necessary for an empty form, e.g. {}, to be pristine when all its values are ''
 */

const supportsArgumentsClass = (() =>
    Object.prototype.toString.call(arguments))() == '[object Arguments]'

const isArguments = supportsArgumentsClass ?
  object => Object.prototype.toString.call(object) == '[object Arguments]' :
  object => object &&
  typeof object == 'object' &&
  typeof object.length == 'number' &&
  Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
  false

const pSlice = Array.prototype.slice

const isUndefinedOrNull = value => value === null || value === undefined

const isBuffer = value =>
!(!value || typeof value !== 'object' || typeof value.length !== 'number') && !(typeof value.copy !== 'function' || typeof value.slice !== 'function') && !(value.length > 0 && typeof value[ 0 ] !== 'number')

const objEquiv = (valueA, valueB) => {
  if (isUndefinedOrNull(valueA) || isUndefinedOrNull(valueB))
    return false
  // an identical 'prototype' property.
  if (valueA.prototype !== valueB.prototype) return false
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(valueA)) {
    if (!isArguments(valueB)) {
      return false
    }
    valueA = pSlice.call(valueA)
    valueB = pSlice.call(valueB)
    return deepEqual(valueA, valueB)
  }
  if (isBuffer(valueA)) {
    if (!isBuffer(valueB)) return false
    if (valueA.length !== valueB.length) return false
    for (let i = 0; i < valueA.length; i++) {
      if (valueA[ i ] !== valueB[ i ]) return false
    }
    return true
  }
  let aKeys
  let bKeys
  try {
    aKeys = Object.keys(valueA)
    bKeys = Object.keys(valueB)
  } catch (e) {//happens when one is valueA string literal and the other isn't
    return false
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (aKeys.length != bKeys.length) return false
  //the same set of keys (although not necessarily the same order),
  aKeys.sort()
  bKeys.sort()
  //~~~cheap key test
  for (let i = aKeys.length - 1; i >= 0; i--) {
    if (aKeys[ i ] != bKeys[ i ]) return false
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (let i = aKeys.length - 1; i >= 0; i--) {
    const key = aKeys[ i ]
    if (!deepEqual(valueA[ key ], valueB[ key ])) return false
  }
  return typeof valueA === typeof valueB
}

const deepEqual = (actual, expected) => {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) return true

  if (actual === undefined && expected === '') return true
  if (actual === '' && expected === undefined) return true

  if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime()
  }

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return actual === expected
  }
  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  return objEquiv(actual, expected)
}

export default deepEqual
