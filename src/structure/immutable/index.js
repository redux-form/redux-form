// @flow
import type { List as ImmutableList, Map as ImmutableMap } from 'immutable'
import { fromJS, Iterable, List, Map } from 'immutable'
import { toPath } from 'lodash'
import type { Structure } from '../../types'
import plainGetIn from '../plain/getIn'
import deepEqual from './deepEqual'
import keys from './keys'
import setIn from './setIn'
import splice from './splice'

const structure: Structure<ImmutableMap<string, any>, ImmutableList<any>> = {
  allowsArrayErrors: false,
  empty: Map(),
  emptyList: List(),
  getIn: (state: ImmutableMap<string, any> | ImmutableList<any>, field: string) =>
    Iterable.isIterable(state) ? state.getIn(toPath(field)) : plainGetIn(state, field),
  setIn,
  deepEqual,
  deleteIn: (state: ImmutableMap<string, any> | ImmutableList<any>, field: string) =>
    state.deleteIn(toPath(field)),
  forEach: (items, callback) => {
    items.forEach(callback)
  },
  fromJS: jsValue =>
    fromJS(jsValue, (key, value) => (Iterable.isIndexed(value) ? value.toList() : value.toMap())),
  keys,
  size: list => (list ? list.size : 0),
  some: (items, callback) => items.some(callback),
  splice,
  equals: (a, b) => (b.equals(a) ? true : b.toSet().equals(a.toSet())),
  orderChanged: (a, b) => b.some((val, index) => val !== a.get(index)),
  toJS: value => (Iterable.isIterable(value) ? value.toJS() : value)
}

export default structure
