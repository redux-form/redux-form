import expect from 'expect'
import deepEqual from 'deep-equal'
import { Map, List, Iterable, fromJS } from 'immutable'

const deepEqualValues = (a, b) => {
  if (Iterable.isIterable(a)) {
    if (Iterable.isIterable(b)) {
      return a.count() === b.count() &&
        a.every((value, key) => deepEqualValues(value, b.get(key)))
    }
    return false
  }
  return deepEqual(a, b) // neither are immutable iterables
}

const api = {
  toBeAList() {
    expect.assert(
      List.isList(this.actual),
      'expected %s to be an immutable list',
      this.actual
    )
    return this
  },

  toBeAMap() {
    expect.assert(
      Map.isMap(this.actual),
      'expected %s to be an immutable map',
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
      this.actual,
      fromJS(expected)
    )
    return this
  }
}

export default api
