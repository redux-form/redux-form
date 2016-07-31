import { Map, Iterable, List, fromJS } from 'immutable'
import { toPath } from 'lodash'
import deepEqual from './deepEqual'
import plainGetIn from '../plain/getIn'

const structure = {
  empty: Map(),
  getIn: (state, field) => 
    Map.isMap(state) || List.isList(state) ? state.getIn(toPath(field)) : plainGetIn(state, field),
  setIn: (state, field, value) => state.setIn(toPath(field), value),
  deepEqual,
  deleteIn: (state, field) => state.deleteIn(toPath(field)),
  fromJS: jsValue => fromJS(jsValue, (key, value) =>
    Iterable.isIndexed(value) ? value.toList() : value.toMap()),
  size: list => list ? list.size : 0,
  some: (iterable, callback) => Iterable.isIterable(iterable) ? iterable.some(callback) : false,
  splice: (list = List.isList(list) || List(), index, removeNum, value) => {
    if(removeNum) {
      return list.splice(index, removeNum)  // removing
    }
    if(index < list.size) {
      return list.splice(index, 0, value)   // inserting
    }
    return list.set(index, value)         // inserting after end of list
  }
}

export default structure
