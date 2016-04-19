import toPath from 'lodash.topath'

const getInWithPath = (state, first, ...rest) => {
  if(!state) {
    return state
  }
  const next = state[first]
  return rest.length ? getInWithPath(next, ...rest) : next
}

const getIn = (state, field) => getInWithPath(state, ...toPath(field))

export default getIn
