/**
 * Converts a string in dot-and-bracket notation to an array of keys
 */
const toPath = value =>
  value === undefined ? [] : String(value).split(/[.\[\]]/).filter(token => token.length)

export default toPath
