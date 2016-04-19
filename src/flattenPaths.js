const isObject = value => value && typeof value === 'object'

/**
 * Flattens a deep structure into a flat map with dot syntax keys. So:
 *
 * {
 *   a: {
 *     b: {
 *       c: 'the',
 *       d: 'quick'
 *     },
 *     c: 'brown'
 *   },
 *   d: [
 *     'fox',
 *     'jumps',
 *     {
 *       e: 'over'
 *     }
 *   ]
 * }
 *
 * flattens to:
 *
 * {
 *   'a.b.c': 'the',
 *   'a.b.d': 'quick',
 *   'a.c': 'brown',
 *   'd[0]': 'fox',
 *   'd[1]': 'jumps',
 *   'd[2].e': 'over'
 * }
 *
 * @param object The current value we are evaluating
 * @param path The path to here
 * @param accumulator The accumulator where the values go
 */
const flattenPaths = (object, path = '', accumulator = {}) => {
  if (object) {
    if (Array.isArray(object)) {
      object.forEach((value, index) => {
        flattenPaths(value, path ? `${path}[${index}]` : String(index), accumulator)
      })
    } else if (isObject(object)) {
      Object.keys(object).forEach(key => {
        flattenPaths(object[ key ], path ? `${path}.${key}` : key, accumulator)
      })
    } else if (path) {
      accumulator[ path ] = object
    }
  }
  return accumulator
}

export default flattenPaths
