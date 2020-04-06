// @flow
import { toPath } from 'lodash'

const setInWithPath = (
  state: Object | Array<any>,
  value: any,
  path: string[],
  pathIndex: number
): Object | Array<any> => {
  if (pathIndex >= path.length) {
    return value
  }

  const first = path[pathIndex]
  const firstState = state && (Array.isArray(state) ? state[Number(first)] : state[first])
  const next = setInWithPath(firstState, value, path, pathIndex + 1)

  if (!state) {
    if (isNaN(first)) {
      return { [first]: next }
    }
    const initialized = []
    initialized[parseInt(first, 10)] = next
    return initialized
  }

  if (Array.isArray(state)) {
    const copy = [].concat(state)
    copy[parseInt(first, 10)] = next
    return copy
  }

  return {
    ...state,
    [first]: next
  }
}

const setIn = (state: Object | Array<any>, field: string, value: any) =>
  setInWithPath(state, value, toPath(field), 0)

export default setIn
