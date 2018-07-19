// @flow
import splice from './splice'
import getIn from './getIn'
import setIn from './setIn'
import deepEqual from './deepEqual'
import deleteIn from './deleteIn'
import keys from './keys'
import type { Structure } from '../../types'

const structure: Structure<Object, Array<*>> = {
  allowsArrayErrors: true,
  empty: {},
  emptyList: [],
  getIn,
  setIn,
  deepEqual,
  deleteIn,
  forEach: (items, callback) => items.forEach(callback),
  fromJS: value => value,
  keys,
  size: array => (array ? array.length : 0),
  some: (items, callback) => items.some(callback),
  splice,
  equals: (a, b) => b.every(val => ~a.indexOf(val)),
  orderChanged: (a, b) => b.some((val, index) => val !== a[index]),
  toJS: value => value
}

export default structure
