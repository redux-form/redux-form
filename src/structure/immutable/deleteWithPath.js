import { Map, List } from 'immutable'

const deleteWithPath = (state, matcher, path = '') => {
  if (state === undefined) {
    return state
  }

  if (List.isList(state)) {
    let changed = false
    let processed = []
    state.forEach((value, index) => {
      const nextPath = path ? `${path}[${index}]` : String(index)
      if (matcher.test(nextPath)) {
        changed = true
      } else {
        const next = deleteWithPath(value, matcher, nextPath)
        if (next !== value) {
          changed = true
        }
        processed.push(next)
      }
    })
    return changed ? List(processed) : state
  }
  if (Map.isMap(state)) {
    let changed = false
    const processed = {}
    state.forEach((value, key) => {
      const nextPath = path ? `${path}.${key}` : key
      if (matcher.test(nextPath)) {
        changed = true
      } else {
        const next = deleteWithPath(value, matcher, nextPath)
        if (next !== value) {
          changed = true
        }
        processed[ key ] = next
      }
    })
    return changed ? Map(processed) : state
  }
  return state
}

export default deleteWithPath
