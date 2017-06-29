// @flow
import { toPath } from 'lodash'

const getIn = (state: Object | Array<*>, field: string): any => {
  if (!state) {
    return state
  }

  const path: string[] = toPath(field)
  const length = path.length
  if (!length) {
    return undefined
  }

  let result: any = state
  for (let i = 0; i < length && result; ++i) {
    result = result[path[i]]
  }

  return result
}

export default getIn
