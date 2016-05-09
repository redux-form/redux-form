const DELIMITER_PATTERN = /[.\[\]]/
const isNotEmpty = token => token.length > 0

/**
 * Converts a string in dot-and-bracket notation to an array of keys
 */
const toPath = value => {
  if (value === undefined || value === null) {
    return []
  } else {
    return String(value).split(DELIMITER_PATTERN).filter(isNotEmpty)
  }
}

export default toPath
