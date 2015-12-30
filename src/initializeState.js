import {makeFieldValue} from './fieldValue';

const updateEntry = (entry, value) => {
  if (entry && entry.value !== undefined) {
    return makeFieldValue({initial: value, value: entry.value});
  }
  return makeFieldValue(value === undefined ? {} : {initial: value, value});
};

/**
 * Sets the initial values into the state and returns a new copy of the state
 */
const initializeState = (values, fields, state = {}) => {
  if (!fields) {
    throw new Error('fields must be passed when initializing state');
  }
  if (!values || !fields.length) {
    return state;
  }
  const initializeField = (path, src, dest) => {
    const dotIndex = path.indexOf('.');
    if (dotIndex === 0) {
      return initializeField(path.substring(1), src, dest);
    }
    const openIndex = path.indexOf('[');
    const closeIndex = path.indexOf(']');
    const result = dest || {};
    if (dotIndex >= 0 && (openIndex < 0 || dotIndex < openIndex)) {
      // is dot notation
      const key = path.substring(0, dotIndex);
      result[key] = src[key] && initializeField(path.substring(dotIndex + 1), src[key], result[key] || {});
    } else if (openIndex >= 0 && (dotIndex < 0 || openIndex < dotIndex)) {
      // is array notation
      if (closeIndex < 0) {
        throw new Error(`found '[' but no ']': '${path}'`);
      }
      const key = path.substring(0, openIndex);
      const srcArray = src[key];
      const destArray = result[key];
      const rest = path.substring(closeIndex + 1);
      if (Array.isArray(srcArray)) {
        if (rest.length) {
          // need to keep recursing
          result[key] = srcArray.map((srcValue, srcIndex) =>
            initializeField(rest, srcValue, destArray && destArray[srcIndex]));
        } else {
          result[key] = srcArray.map((srcValue, srcIndex) =>
            updateEntry(destArray && destArray[srcIndex], srcValue));
        }
      } else {
        result[key] = updateEntry(destArray, srcArray);
      }
    } else {
      result[path] = updateEntry(result[path], src && src[path]);
    }
    return result;
  };
  return fields.reduce((accumulator, field) => initializeField(field, values, accumulator), {...state});
};

export default initializeState;
