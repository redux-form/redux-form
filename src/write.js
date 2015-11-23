const write = (path, value, object) => {
  const dotIndex = path.indexOf('.');
  if (dotIndex === 0) {
    write(path.substring(1), value, object);
  }
  const openIndex = path.indexOf('[');
  const closeIndex = path.indexOf(']');
  if (dotIndex >= 0 && (openIndex < 0 || dotIndex < openIndex)) {
    const key = path.substring(0, dotIndex);
    if (!object[key]) {
      object[key] = {};
    }
    write(path.substring(dotIndex + 1), value, object[key]);
  } else if (openIndex >= 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    if (closeIndex < 0) {
      throw new Error('found [ but no ]');
    }
    const key = path.substring(0, openIndex);
    const index = path.substring(openIndex + 1, closeIndex);
    if (!object[key]) {
      object[key] = [];
    }
    const rest = path.substring(closeIndex + 1);
    if (rest.length) {
      if (!object[key][index]) {
        object[key][index] = {};
      }
      write(rest, value, object[key][index]);
    } else if (openIndex === 0) {
      write(rest, value, object[index]);
    } else {
      object[key][index] = value;
    }
  } else {
    object[path] = value;
  }
};

export default write;