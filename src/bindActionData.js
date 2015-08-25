import mapValues from './mapValues';

/**
 * Adds additional properties to the results of the function or map of functions passed
 */
export default function bindActionData(action, data) {
  return typeof action === 'function' ? (...args) => ({
    ...action(...args),
    ...data
  }) : mapValues(action, value => bindActionData(value, data));
}
