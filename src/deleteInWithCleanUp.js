// @flow
import { toPath } from 'lodash'
import type { Structure } from './types'

type ShouldDelete<SDM, SDL> = (
  structure: Structure<SDM, SDL>
) => (state: SDM | SDL, path: string) => boolean

function createCreateDeleteInWithCleanUp<DIM, DIL>(
  structure: Structure<DIM, DIL>
) {
  const shouldDeleteDefault: ShouldDelete<DIM, DIL> = structure => (
    state,
    path
  ) => structure.getIn(state, path) !== undefined

  const { deepEqual, empty, getIn, deleteIn, setIn } = structure

  return (
    shouldDelete: ShouldDelete<DIM, DIL> = shouldDeleteDefault
  ): DIM | DIL => {
    const deleteInWithCleanUp = (state: DIM | DIL, path: string): DIM | DIL => {
      if (path[path.length - 1] === ']') {
        // array path
        const pathTokens = toPath(path)
        pathTokens.pop()
        const parent = getIn(state, pathTokens.join('.'))
        return parent ? setIn(state, path) : state
      }

      let result: DIM | DIL = state

      if (shouldDelete(structure)(state, path)) {
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
}

export default createCreateDeleteInWithCleanUp
