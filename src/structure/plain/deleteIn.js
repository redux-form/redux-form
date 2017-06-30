// @flow
import { toPath } from 'lodash'

function deleteInWithPath<T: Object | Array<*>>(
  state: ?T,
  first: ?string,
  ...rest: string[]
): ?T {
  if (
    state === undefined ||
    state === null ||
    first === undefined ||
    first === null
  ) {
    return state
  }
  if (rest.length) {
    if (Array.isArray(state)) {
      if (isNaN(first)) {
        throw new Error(
          `Must access array elements with a number, not "${String(first)}".`
        )
      }
      const firstIndex = Number(first)
      if (firstIndex < state.length) {
        const result = deleteInWithPath(state && state[firstIndex], ...rest)
        if (result !== state[firstIndex]) {
          const copy = [...state]
          copy[firstIndex] = result
          return copy
        }
      }
      return state
    }
    if (first in state) {
      const result = deleteInWithPath(state && state[first], ...rest)
      return state[first] === result
        ? state
        : {
            ...state,
            [first]: result
          }
    }
    return state
  }
  if (Array.isArray(state)) {
    if (isNaN(first)) {
      throw new Error(
        `Cannot delete non-numerical index from an array. Given: "${String(
          first
        )}`
      )
    }
    const firstIndex = Number(first)
    if (firstIndex < state.length) {
      const copy = [...state]
      copy.splice(firstIndex, 1)
      return copy
    }
    return state
  }
  if (first in state) {
    const copy = { ...state }
    delete copy[first]
    return copy
  }
  return state
}

const deleteIn = (
  state: Object | Array<*>,
  field: string
): ?(Object | Array<*>) => deleteInWithPath(state, ...toPath(field))

export default deleteIn
