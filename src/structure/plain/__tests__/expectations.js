// @flow
import { isEqual, isObject } from 'lodash'
import { matcherHint, printReceived, printExpected } from 'jest-matcher-utils'

const expectations = {
  toBeAMap(actual: any) {
    const pass = isObject(actual)
    return {
      pass,
      message: () => `expected ${actual} to be an object`
    }
  },

  toBeAList(actual: any) {
    const pass = Array.isArray(actual)
    return {
      pass,
      message: () => `expected ${actual} to be an array`
    }
  },

  toBeSize(actual: any, size: number) {
    const pass = actual && Object.keys(actual).length === size
    return {
      pass,
      message: () => `expected ${actual} to contain ${size} elements`
    }
  },

  toEqualMap(actual: any, expected: Object) {
    const pass = isEqual(actual, expected)
    return {
      pass,
      message: () =>
        matcherHint('.toEqualMap') +
        '\n\n' +
        `Expected value to equal:\n` +
        `  ${printExpected(expected)}\n` +
        `Received:\n` +
        `  ${printReceived(actual)}`
    }
  },

  toContainExactly(actual: any, expected: any[]) {
    const sortedActual = actual.slice()
    sortedActual.sort()
    const sortedExpected = expected.slice()
    sortedExpected.sort()

    const pass = this.equals(sortedActual, sortedExpected)
    return {
      pass,
      message: () =>
        matcherHint('.toContainExactly') +
        '\n\n' +
        `Expected value to contain:\n` +
        `  ${printExpected(sortedExpected)}\n` +
        `Received:\n` +
        `  ${printReceived(sortedActual)}`
    }
  }
}

export default expectations
