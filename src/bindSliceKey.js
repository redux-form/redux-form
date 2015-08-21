/**
 * Adds a 'key' property to the results of the function or map of functions passed
 */
export default function bindSliceKey(action, key) {
  return typeof action === 'function' ? (...args) => ({
    ...action(...args),
    key: key
  }) : Object.keys(action).reduce((accumulator, i) => {
    accumulator[i] = bindSliceKey(action[i], key);
    return accumulator;
  }, {});
}
