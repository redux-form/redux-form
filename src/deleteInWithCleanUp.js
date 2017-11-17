// @flow
import { toPath } from 'lodash'
import type { Structure } from './types'

function createDeleteInWithCleanUp<DIM, DIL>({
  deepEqual,
  empty,
  getIn,
  deleteIn,
  setIn
}: Structure<DIM, DIL>) {
  const deleteInWithCleanUp = (state: DIM | DIL, path: string): DIM | DIL => {
    let initialValuesPath = null

    if (path.startsWith('values')) {
      initialValuesPath = path.replace('values', 'initial')
    }

    if (path[path.length - 1] === ']') {
      // array path
      const pathTokens = toPath(path)
      pathTokens.pop()
      const parent = getIn(state, pathTokens.join('.'))
      return parent ? setIn(state, path) : state
    }

    let result: DIM | DIL = state

    const initialValueComparison = initialValuesPath ? (getIn(state, initialValuesPath) === undefined) : true

    if (getIn(state, path) !== undefined && initialValueComparison) {
      result = deleteIn(state, path)
    }

    const dotIndex = path.lastIndexOf('.')
    if (dotIndex > 0) {
      const parentPath = path.substring(0, dotIndex)
      if (parentPath[parentPath.length - 1] !== ']') {
        const parent = getIn(result, parentPath)
        if (deepEqual(parent, empty)) {
          return deleteInWithCleanUp(result, parentPath)
        }
      }
    }
    return result
  }

  return deleteInWithCleanUp
}

export default createDeleteInWithCleanUp
