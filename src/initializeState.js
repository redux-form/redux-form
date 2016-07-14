import {makeFieldValue} from './fieldValue';

const makeEntry = (value, previousValue, overwriteValues) => {
  if (value === undefined && previousValue === undefined) return makeFieldValue({});
  return makeFieldValue({
    initial: value,
    value: overwriteValues ? value : previousValue
  });
};

/**
 * Sets the initial values into the state and returns a new copy of the state
 */
const initializeState = (values, fields, state = {}, overwriteValues = true) => {
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
    const result = { ...dest } || {};
    if (dotIndex >= 0 && (openIndex < 0 || dotIndex < openIndex)) {
      // is dot notation
      const key = path.substring(0, dotIndex);
      result[ key ] = src[ key ] && initializeField(path.substring(dotIndex + 1), src[ key ], result[ key ] || {});
    } else if (openIndex >= 0 && (dotIndex < 0 || openIndex < dotIndex)) {
      // is array notation
      if (closeIndex < 0) {
        throw new Error(`found '[' but no ']': '${path}'`);
      }
      const key = path.substring(0, openIndex);
      const srcArray = src[ key ];
      const destArray = result[ key ];
      const rest = path.substring(closeIndex + 1);
      if (Array.isArray(srcArray)) {
        if (rest.length) {
          // need to keep recursing
          result[ key ] = srcArray.map((srcValue, srcIndex) =>
            initializeField(rest, srcValue, destArray && destArray[ srcIndex ]));
        } else {
          result[ key ] = srcArray.map((srcValue, srcIndex) =>
            makeEntry(srcValue, destArray && destArray[ srcIndex ] && destArray[ srcIndex ].value, overwriteValues));
        }
      } else {
        result[ key ] = [];
      }
    } else {
      result[ path ] = makeEntry(src && src[ path ], dest && dest[ path ] && dest[ path ].value, overwriteValues);
    }
    return result;
  };
  return fields.reduce((accumulator, field) => initializeField(field, values, accumulator), { ...state });
};

export default initializeState;
