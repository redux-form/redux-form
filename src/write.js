/**
 * Writes any potentially deep value from an object using dot and array syntax,
 * and returns a new copy of the object.
 */
const write = (path, value, object) => {
  const dotIndex = path.indexOf('.');
  if (dotIndex === 0) {
    return write(path.substring(1), value, object);
  }
  const openIndex = path.indexOf('[');
  const closeIndex = path.indexOf(']');
  if (dotIndex >= 0 && (openIndex < 0 || dotIndex < openIndex)) {
    // is dot notation
    const key = path.substring(0, dotIndex);
    return {
      ...object,
      [key]: write(path.substring(dotIndex + 1), value, object[key] || {})
    };
  }
  if (openIndex >= 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    // is array notation
    if (closeIndex < 0) {
      throw new Error('found [ but no ]');
    }
    const key = path.substring(0, openIndex);
    const index = path.substring(openIndex + 1, closeIndex);
    const array = object[key] || [];
    const rest = path.substring(closeIndex + 1);
    if (index) {
      // indexed array
      if (rest.length) {
        // need to keep recursing
        const dest = array[index] || {};
        const arrayCopy = [...array];
        arrayCopy[index] = write(rest, value, dest);
        return {
          ...(object || {}),
          [key]: arrayCopy
        };
      }
      const copy = [...array];
      copy[index] = typeof value === 'function' ? value(copy[index]) : value;
      return {
        ...(object || {}),
        [key]: copy
      };
    }
    // indexless array
    if (rest.length) {
      // need to keep recursing
      if ((!array || !array.length) && typeof value === 'function') {
        return object;  // don't even set a value under [key]
      }
      const arrayCopy = array.map(dest => write(rest, value, dest));
      return {
        ...(object || {}),
        [key]: arrayCopy
      };
    }
    let result;
    if (Array.isArray(value)) {
      result = value;
    } else if (object[key]) {
      result = array.map(dest => typeof value === 'function' ? value(dest) : value);
    } else if (typeof value === 'function') {
      return object;  // don't even set a value under [key]
    } else {
      result = value;
    }
    return {
      ...(object || {}),
      [key]: result
    };
  }
  return {
    ...object,
    [path]: typeof value === 'function' ? value(object[path]) : value
  };
};

export default write;
