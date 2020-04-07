// @flow
import deepEqual from 'deep-equal'
import { Map, List, Iterable, fromJS } from 'immutable'

const deepEqualValues = (a: any, b: any) => {
  if (Iterable.isIterable(a)) {
    return (
      Iterable.isIterable(b) &&
      a.count() === b.count() &&
      a.every((value, key) => deepEqualValues(value, b.get(key)))
    )
  }
  return deepEqual(a, b) // neither are immutable collections
}

const api = {
  toBeAMap(actual: any) {
    const pass = Map.isMap(actual)
    return {
      pass: pass,
      message: () => `toBeAMap expected ${actual} to be an immutable Map`
    }
  },

  toBeAList(actual: any) {
    const pass = List.isList(actual)
    return {
      pass,
      message: () => `toBeAList expected ${actual} to be an immutable List`
    }
  },

  toBeSize(actual: any, size: number) {
    const pass = Iterable.isIterable(actual) && actual.count() === size
    return {
      pass,
      message: () => `toBeSize expected ${actual} to contain ${size} elements`
    }
  },

  toEqualMap(actual: any, expected: Object) {
    const pass = deepEqualValues(actual, fromJS(expected))
    return {
      pass,
      message: () =>
        this.utils.matcherHint('.toEqualMap') +
        '\n\n' +
        `Expected value to equal map:\n` +
        `  ${this.utils.printExpected(fromJS(expected))}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(actual)}`
    }
  },

  toContainExactly(actual: any[], expected: any[]) {
    const expectedItems = expected.map(expectedItem => fromJS(expectedItem))
    const pass =
      actual.length === expected.length &&
      actual.every(actualItem =>
        expectedItems.some(expectedItem => deepEqualValues(actualItem, expectedItem))
      )

    return {
      pass,
      message: () =>
        this.utils.matcherHint('.toContainExactly') +
        '\n\n' +
        `Expected value to contain:\n` +
        `  ${this.utils.printExpected(fromJS(expected))}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(actual)}`
    }
  }
}

export default api
