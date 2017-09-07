// @flow
import type { ComponentType } from 'react'

const getDisplayName = (Comp: ComponentType<any>): string =>
  Comp.displayName || Comp.name || 'Component'

export default getDisplayName
