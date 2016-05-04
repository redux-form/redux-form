import { Map, Iterable, List, fromJS } from 'immutable'
import toPath from '../../util/toPath'
import deepEqual from './deepEqual'
import deleteWithPath from './deleteWithPath'
import plainGetIn from '../plain/getIn'

const structure = {
  empty: Map(),
  getIn: (state, field) => 
    Map.isMap(state) || List.isList(state) ? state.getIn(toPath(field)) : plainGetIn(state, field),
  setIn: (state, field, value) => state.setIn(toPath(field), value),
  deepEqual,
  deleteIn: (state, field) => state.deleteIn(toPath(field)),
  deleteWithPath,
  fromJS: jsValue => fromJS(jsValue, (key, value) =>
    Iterable.isIndexed(value) ? value.toList() : value.toMap()),
  size: list => list ? list.size : 0,
  splice: (list = List(), index, removeNum, value) =>
    removeNum ? list.splice(index, removeNum) : list.splice(index, 0, value)
}

export default structure
