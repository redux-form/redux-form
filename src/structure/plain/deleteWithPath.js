const isObject = value => value && typeof value === 'object'

const deleteWithPath = (state, matcher, path = '') => {
  if (state === undefined) {
    return state
  }

  if (Array.isArray(state)) {
    let changed = false
    const processed = []
    state.forEach((value, index) => {
      const nextPath = `${path}[${index}]`
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
    return changed ? processed : state
  }
  if (isObject(state)) {
    let changed = false
    const processed = {}
    Object.keys(state).forEach(key => {
      const nextPath = path ? `${path}.${key}` : key
      if (matcher.test(nextPath)) {
        changed = true
      } else {
        const next = deleteWithPath(state[key], matcher, nextPath)
        if (next !== state[key]) {
          changed = true
        }
        processed[key] = next
      }
    })
    return changed ? processed : state
  }
  return state
}

export default deleteWithPath
