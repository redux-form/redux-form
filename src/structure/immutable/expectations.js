import expect from 'expect'
import deepEqual from 'deep-equal'
import { Map, List, Iterable, fromJS } from 'immutable'

const deepEqualValues = (a, b) => {
  if (Iterable.isIterable(a)) {
    return (
      Iterable.isIterable(b) &&
      a.count() === b.count() &&
      a.every((value, key) => deepEqualValues(value, b.get(key)))
    )
  }
  return deepEqual(a, b) // neither are immutable iterables
}

const api = {
  toBeAMap() {
    expect.assert(
      Map.isMap(this.actual),
      'expected %s to be an immutable Map',
      this.actual
    )
    return this
  },

  toBeAList() {
    expect.assert(
      List.isList(this.actual),
      'expected %s to be an immutable List',
      this.actual
    )
    return this
  },

  toBeSize(size) {
    expect.assert(
      Iterable.isIterable(this.actual) && this.actual.count() === size,
      'expected %s to contain %s elements',
      this.actual,
      size
    )
    return this
  },

  toEqualMap(expected) {
    expect.assert(
      deepEqualValues(this.actual, fromJS(expected)),
      'expected...\n%s\n...but found...\n%s',
      fromJS(expected),
      this.actual
    )
    return this
  },

  toContainExactly(expected) {
    const expectedItems = expected.map(expectedItem => fromJS(expectedItem))
    expect.assert(
      this.actual.count() === expected.length &&
        this.actual.every(actualItem =>
          expectedItems.some(expectedItem =>
            deepEqualValues(actualItem, expectedItem)
          )
        ),
      'expected...\n%s\n...but found...\n%s',
      this.actual,
      expected
    )
    return this
  }
}

export default api
