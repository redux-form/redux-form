import { toPath } from 'lodash'

const createDeleteInWithCleanUp = ({ deepEqual, empty, getIn, deleteIn, setIn }) => {

  const deleteInWithCleanUp = (state, path) => {
    if(path[path.length - 1] === ']') { // array path
      const pathTokens = toPath(path)
      pathTokens.pop()
      const parent = getIn(state, pathTokens.join('.'))
      return parent ? setIn(state, path, undefined) : state
    }
    const result = deleteIn(state, path)
    const dotIndex = path.lastIndexOf('.')
    if (dotIndex > 0) {
      const parentPath = path.substring(0, dotIndex)
      const parent = getIn(result, parentPath)
      if (deepEqual(parent, empty)) {
        return deleteInWithCleanUp(result, parentPath)
      }
    }
    return result
  }

  return deleteInWithCleanUp
}

export default createDeleteInWithCleanUp
