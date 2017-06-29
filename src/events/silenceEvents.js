// @flow
import silenceEvent from './silenceEvent'

const silenceEvents = (fn: Function) => (event: any, ...args: Array<any>) =>
  silenceEvent(event) ? fn(...args) : fn(event, ...args)

export default silenceEvents
