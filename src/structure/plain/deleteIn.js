import { toPath } from 'lodash'

const deleteInWithPath = (state, first, ...rest) => {
  if (state === undefined || first === undefined) {
    return state
  }
  if (rest.length) {
    if (Array.isArray(state)) {
      if (first < state.length) {
        const result = deleteInWithPath(state && state[ first ], ...rest)
        if (result !== state[ first ]) {
          const copy = [ ...state ]
          copy[ first ] = result
          return copy
        }
      }
      return state
    }
    if (typeof state === 'object' && first in state) {
      const result = deleteInWithPath(state && state[ first ], ...rest)
      return state[ first ] === result ? state : {
        ...state,
        [first]: result
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
