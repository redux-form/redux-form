// @flow
import type { ReactContext } from '../types'

const formatName = (
  { _reduxForm: { sectionPrefix } }: ReactContext,
  name: string
) => (sectionPrefix ? `${sectionPrefix}.${name}` : name)

export default formatName
