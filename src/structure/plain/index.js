import splice from './splice'
import getIn from './getIn'
import setIn from './setIn'
import deleteIn from './deleteIn'
import deleteWithPath from './deleteWithPath'

import isEqual from 'lodash/isEqual'

const structure = {
  empty: {},
  getIn,
  setIn,
  deepEqual: isEqual,
  deleteIn,
  deleteWithPath,
  fromJS: value => value,
  size: array => array ? array.length : 0,
  splice
}

export default structure
