import { List, Map } from 'immutable'
import { toPath } from 'lodash'

const arrayPattern = /\[(\d+)\]/

const undefinedArrayMerge = (previous, next) =>  
  next !== undefined 
    ? next 
    : previous

const mergeLists = (original, value) => 
  original && List.isList(original)
    ? original.mergeDeepWith(undefinedArrayMerge, value)
    : value

/*
 * ImmutableJS' setIn function doesn't support array (List) creation
 * so we must pre-insert all arrays in the path ahead of time.
 * 
 * Additionally we must also pre-set a dummy Map at the location
 * of an array index if there's parts that come afterwards because 
 * the setIn function uses `{}` to mark an unset value instead of 
 * undefined (which is the case for list / arrays).
 */
export default function setIn(state, field, value) {
  if (!field || typeof field !== 'string' || !arrayPattern.test(field)) {
    return state.setIn(toPath(field), value)
  }

  return state.withMutations(mutable => {
    let arraySafePath = field.split('.')
    let pathSoFar = null

    for (let partIndex in arraySafePath) {
      let part = arraySafePath[partIndex]
      let match = arrayPattern.exec(part)

      pathSoFar = pathSoFar === null ? part : `${pathSoFar}.${part}`

      if (!match) continue
 
      let arr = []
      arr[parseInt(match[1])] = partIndex + 1 >= arraySafePath.length 
        ? new Map() 
        : undefined

      mutable = mutable.updateIn(
        toPath(pathSoFar).slice(0, -1), 
        value => mergeLists(value, new List(arr)))
    }

    return mutable.setIn(toPath(field), value)
  })
}
