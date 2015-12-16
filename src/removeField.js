const without = (object, key) => {
  const copy = {...object};
  delete copy[key];
  return copy;
};

const removeField = (fields, path) => {
  const dotIndex = path.indexOf('.');
  const openIndex = path.indexOf('[');
  const closeIndex = path.indexOf(']');
  if (openIndex > 0 && closeIndex !== openIndex + 1) {
    throw new Error('found [ not followed by ]');
  }
  if (openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    // array field
    const key = path.substring(0, openIndex);
    if (!Array.isArray(fields[key])) {
      return without(fields, key);
    }
    let rest = path.substring(closeIndex + 1);
    if (rest[0] === '.') {
      rest = rest.substring(1);
    }
    if (rest) {
      const copy = [];
      fields[key].forEach((item, index) => {
        const result = removeField(item, rest);
        if (Object.keys(result).length) {
          copy[index] = result;
        }
      });
      return copy.length ? {
        ...fields,
        [key]: copy
      } : without(fields, key);
    }
    return without(fields, key);
  }
  if (dotIndex > 0) {
    // subobject field
    const key = path.substring(0, dotIndex);
    const rest = path.substring(dotIndex + 1);
    if (!fields[key]) {
      return fields;
    }
    const result = removeField(fields[key], rest);
    return Object.keys(result).length ? {
      ...fields,
      [key]: removeField(fields[key], rest)
    } : without(fields, key);
  }
  return without(fields, path);
};

export default removeField;
