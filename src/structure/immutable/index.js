import { Map, Iterable, List, fromJS } from 'immutable'
import { toPath } from 'lodash'
import deepEqual from './deepEqual'
import keys from './keys'
import setIn from './setIn'
import splice from './splice'
import plainGetIn from '../plain/getIn'

const emptyList = List()

const structure = {
  empty: Map(),
  emptyList,
  getIn: (state, field) =>
    Map.isMap(state) || List.isList(state) ? state.getIn(toPath(field)) : plainGetIn(state, field),
  setIn,
  deepEqual,
  deleteIn: (state, field) => state.deleteIn(toPath(field)),
  fromJS: jsValue => fromJS(jsValue, (key, value) =>
    Iterable.isIndexed(value) ? value.toList() : value.toMap()),
  keys,
  size: list => list ? list.size : 0,
  some: (iterable, callback) => Iterable.isIterable(iterable) ? iterable.some(callback) : false,
  splice,
  toJS: value => Iterable.isIterable(value) ? value.toJS() : value
}

export default structure
