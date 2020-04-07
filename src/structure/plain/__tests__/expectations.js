// @flow
import { isEqual, isObject } from 'lodash'

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
        this.utils.matcherHint('.toEqualMap') +
        '\n\n' +
        `Expected value to equal:\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(actual)}`
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
        this.utils.matcherHint('.toContainExactly') +
        '\n\n' +
        `Expected value to contain:\n` +
        `  ${this.utils.printExpected(sortedExpected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(sortedActual)}`
    }
  }
}

export default expectations
