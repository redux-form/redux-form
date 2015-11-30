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
    if (closeIndex < 0) {
      throw new Error('found [ but no ]');
    }
    const key = path.substring(0, openIndex);
    const index = path.substring(openIndex + 1, closeIndex);
    const array = object[key] || [];
    const rest = path.substring(closeIndex + 1);
    if (rest.length) {
      const dest = array[index] || {};
      const arrayCopy = [...array];
      arrayCopy[index] = write(rest, value, dest);
      return {
        ...(object || {}),
        [key]: arrayCopy
      };
    }
    if (openIndex === 0) {   // object is an array
      const objectArrayCopy = [...object];
      objectArrayCopy[index] = write(rest, value, object[index]);
      return objectArrayCopy;
    }
    const copy = [...(object[key] || [])];
    copy[index] = typeof value === 'function' ? value(copy[index]) : value;
    return {
      ...(object || {}),
      [key]: copy
    };
  }
  return {
    ...object,
    [path]: typeof value === 'function' ? value(object[path]) : value
  };
};

export default write;
