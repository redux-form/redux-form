import { Map, Iterable, fromJS } from 'immutable'
import toPath from '../../util/toPath'
import deepEqual from './deepEqual'
import deleteWithPath from './deleteWithPath'
import plainGetIn from '../plain/getIn'

const structure = {
  empty: Map(),
  getIn: (state, field) => Map.isMap(state) ? state.getIn(toPath(field)) : plainGetIn(state, field),
  setIn: (state, field, value) => state.setIn(toPath(field), value),
  deepEqual,
  deleteIn: (state, field) => state.deleteIn(toPath(field)),
  deleteWithPath,
  fromJS: jsValue => fromJS(jsValue, (key, value) =>
    Iterable.isIndexed(value) ? value.toList() : value.toMap())
}

export default structure
