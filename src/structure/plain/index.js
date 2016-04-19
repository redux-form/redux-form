import getIn from './getIn'
import setIn from './setIn'
import deepEqual from './deepEqual'
import deleteIn from './deleteIn'
import deleteWithPath from './deleteWithPath'

const structure = {
  empty: {},
  getIn,
  setIn,
  deepEqual,
  deleteIn,
  deleteWithPath,
  fromJS: value => value
}

export default structure
