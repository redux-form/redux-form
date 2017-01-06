import splice from './splice'
import getIn from './getIn'
import setIn from './setIn'
import deepEqual from './deepEqual'
import deleteIn from './deleteIn'
import keys from './keys'
import { some } from 'lodash'

const structure = {
  empty: {},
  emptyList: [],
  getIn,
  setIn,
  deepEqual,
  deleteIn,
  fromJS: value => value,
  keys,
  size: array => array ? array.length : 0,
  some,
  splice,
  toJS: value => value
}

export default structure
