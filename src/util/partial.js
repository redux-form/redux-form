/**
 * Binds the arguments to a function and returns a new function
 */
const partial = (fn, ...partials) =>
  (...args) => fn(...partials, ...args)

export default partial
