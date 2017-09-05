// @flow
import * as React from 'react'

const getDisplayName = (Comp: React.ComponentType<any>): string =>
  Comp.displayName || Comp.name || 'Component'

export default getDisplayName
