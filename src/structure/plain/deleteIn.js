import toPath from '../../util/toPath'

const deleteInWithPath = (state, first, ...rest) => {
  if (state === undefined || first === undefined) {
    return state
  }
  if (rest.length) {
    if (Array.isArray(state)) {
      if (first < state.length) {
        const copy = [ ...state ]
        copy[first] = deleteInWithPath(state && state[ first ], ...rest)
        return copy
      }
      return state
    }
    if (first in state) {
      return {
        ...state,
        [first]: deleteInWithPath(state && state[ first ], ...rest)
      }
    }
    return state
  }
  if (Array.isArray(state)) {
    if (isNaN(first)) {
      throw new Error('Cannot delete non-numerical index from an array')
    }
    if (first < state.length) {
      const copy = [ ...state ]
      copy.splice(first, 1)
      return copy
    }
    return state
  }
  if (first in state) {
    const copy = { ...state }
    delete copy[ first ]
    return copy
  }
  return state
}

const deleteIn = (state, field) => deleteInWithPath(state, ...toPath(field))

export default deleteIn
