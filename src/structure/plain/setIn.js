import { toPath } from 'lodash'

const setInWithPath = (state, value, first, ...rest) => {
  if (first === undefined) {
    return value
  }
  const next = setInWithPath(state && state[first], value, ...rest)
  if (!state) {
    const initialized = isNaN(first) ? {} : []
    initialized[first] = next
    return initialized
  }
  if (Array.isArray(state)) {
    const copy = [ ...state ]
    copy[first] = next
    return copy
  }
  return {
    ...state,
    [first]: next
  }
}

const setIn = (state, field, value) => setInWithPath(state, value, ...toPath(field))

export default setIn
