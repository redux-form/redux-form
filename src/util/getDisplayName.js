// @flow
const getDisplayName = (Comp: ReactClass<*>): string =>
  Comp.displayName || Comp.name || 'Component'

export default getDisplayName
