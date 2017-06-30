// @flow
const isEvent = (candidate: any) =>
  !!(candidate && candidate.stopPropagation && candidate.preventDefault)

export default isEvent
