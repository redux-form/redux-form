import splice from './splice'
import getIn from './getIn'
import setIn from './setIn'
import deepEqual from './deepEqual'
import deleteIn from './deleteIn'
import keys from './keys'

const structure = {
  allowsArrayErrors: true,
  empty: {},
  emptyList: [],
  getIn,
  setIn,
  deepEqual,
  deleteIn,
  fromJS: value => value,
  keys,
  size: array => array ? array.length : 0,
  splice,
  toJS: value => value
}

export default structure
