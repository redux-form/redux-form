// @flow
import { List, Map } from 'immutable'
import { toPath } from 'lodash'
import type { Map as ImmutableMap, List as ImmutableList } from 'immutable'

const arrayPattern = /\[(\d+)\]/

const undefinedArrayMerge = (previous, next) =>
  next !== undefined ? next : previous

const mergeLists = (originalList, value) => {
  if (originalList && List.isList(originalList)) {
    return originalList
      .map((originalListValue, index) =>
        undefinedArrayMerge(value.get(index), originalListValue)
      )
      .concat(value.slice(originalList.size))
  }

  return value
}

const assureComplexProps = (state, path) => {
  for (let pathPart = 1; pathPart < path.length; ++pathPart) {
    const nextPart = path.slice(0, pathPart)
    if (state.getIn(nextPart) == null) {
      return state.setIn(nextPart, new Map())
    }
  }
  return state
}
/*
 * ImmutableJS' setIn function doesn't support array (List) creation
 * so we must pre-insert all arrays in the path ahead of time.
 * 
 * Additionally we must also pre-set a dummy Map at the location
 * of an array index if there's parts that come afterwards because 
 * the setIn function uses `{}` to mark an unset value instead of 
 * undefined (which is the case for list / arrays).
 */
export default function setIn(
  state: ImmutableMap<string, *> | ImmutableList<*>,
  field: string,
  value: any
) {
  const path = toPath(field)

  if (!field || typeof field !== 'string' || !arrayPattern.test(field)) {
    const newState = assureComplexProps(state, path)
    return newState.setIn(path, value)
  }

  return state.withMutations(mutable => {
    for (let pathIndex = 0; pathIndex < path.length - 1; ++pathIndex) {
      const nextPart = path[pathIndex + 1]
      if (isNaN(nextPart)) {
        continue
      }

      mutable = mutable.updateIn(path.slice(0, pathIndex + 1), value =>
        mergeLists(value, new List().set(parseInt(nextPart, 10), new Map()))
      )
    }

    return mutable.setIn(path, value)
  })
}
