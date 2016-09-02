import { toPath } from 'lodash'

const getInWithPath = (state, first, ...rest) => {
  if(!state) {
    return state
  }
  const next = state[first]
  return rest.length ? getInWithPath(next, ...rest) : next
}

const getIn = (state, field) => {
  if (!state) {
    return state
  }

  const path = toPath(field)
  const length = path.length

  if (length > 3) {
    return getInWithPath(state, ...path)
  }

  let result = state
  if (!length || !result) {
    return undefined
  }

  result = result[path[0]]
  if (length === 1 || !result) {
    return result
  }

  result = result[path[1]]
  if (length === 2 || !result) {
    return result
  }

  result = result[path[2]]

  return result
}

export default getIn
