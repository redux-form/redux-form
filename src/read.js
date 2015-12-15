/**
 * Reads any potentially deep value from an object using dot and array syntax
 */
const read = (path, object) => {
  if (!path || !object) {
    return object;
  }
  const dotIndex = path.indexOf('.');
  if (dotIndex === 0) {
    return read(path.substring(1), object);
  }
  const openIndex = path.indexOf('[');
  const closeIndex = path.indexOf(']');
  if (dotIndex >= 0 && (openIndex < 0 || dotIndex < openIndex)) {
    // iterate down object tree
    return read(path.substring(dotIndex + 1), object[path.substring(0, dotIndex)]);
  }
  if (openIndex >= 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    if (closeIndex < 0) {
      throw new Error('found [ but no ]');
    }
    const key = path.substring(0, openIndex);
    const index = path.substring(openIndex + 1, closeIndex);
    if (!index.length) {
      return object[key];
    }
    if (openIndex === 0) {
      return read(path.substring(closeIndex + 1), object[index]);
    }
    if (!object[key]) {
      return undefined;
    }
    return read(path.substring(closeIndex + 1), object[key][index]);
  }
  return object[path];
};

export default read;
