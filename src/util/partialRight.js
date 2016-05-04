/**
 * Binds the arguments to a function and returns a new function
 */
const partialRight = (fn, ...partials) =>
  (...args) => fn(...args, ...partials)

export default partialRight
