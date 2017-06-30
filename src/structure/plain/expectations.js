// @flow
import expect from 'expect'
import { isObject } from 'lodash'

const expectations = {
  toBeAMap() {
    expect.assert(
      isObject(this.actual),
      'expected %s to be an object',
      this.actual
    )
    return this
  },

  toBeAList() {
    expect.assert(
      Array.isArray(this.actual),
      'expected %s to be an array',
      this.actual
    )
    return this
  },

  toBeSize(size: number) {
    expect.assert(
      this.actual && Object.keys(this.actual).length === size,
      'expected %s to contain %s elements',
      this.actual,
      size
    )
    return this
  },

  toEqualMap(expected: Object) {
    return expect(this.actual).toEqual(expected)
  },

  toContainExactly(expected: any[]) {
    const sortedActual = this.actual.slice()
    sortedActual.sort()
    const sortedExpected = expected.slice()
    sortedExpected.sort()
    return expect(sortedActual).toEqual(sortedExpected)
  }
}

export default expectations
