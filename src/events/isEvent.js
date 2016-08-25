const isEvent = candidate => !!(candidate && candidate.stopPropagation && candidate.preventDefault)

export default isEvent
