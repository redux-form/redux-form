/*
 * Checks if `value` is `null` or `undefined`.
 */
export default function isNil(value) {
  return value == null; // eslint-disable-line eqeqeq
}
