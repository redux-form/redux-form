import silenceEvent from './silenceEvent'

const silenceEvents = fn => (event, ...args) =>
  silenceEvent(event) ? fn(...args) : fn(event, ...args)

export default silenceEvents
