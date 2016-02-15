const getValue = (field, state, dest) => {
  const dotIndex = field.indexOf('.');
  const openIndex = field.indexOf('[');
  const closeIndex = field.indexOf(']');
  if (openIndex > 0 && closeIndex !== openIndex + 1) {
    throw new Error('found [ not followed by ]');
  }
  if (openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    // array field
    const key = field.substring(0, openIndex);
    let rest = field.substring(closeIndex + 1);
    if (rest[0] === '.') {
      rest = rest.substring(1);
    }
    const array = state && state[key] || [];
    if (rest) {
      if (!dest[key]) {
        dest[key] = [];
      }
      array.forEach((item, index) => {
        if (!dest[key][index]) {
          dest[key][index] = {};
        }
        getValue(rest, item, dest[key][index]);
      });
    } else {
      dest[key] = array.map(item => item && item.value);
    }
  } else if (dotIndex > 0) {
    // subobject field
    const key = field.substring(0, dotIndex);
    const rest = field.substring(dotIndex + 1);
    if (!dest[key]) {
      dest[key] = {};
    }
    getValue(rest, state && state[key] || {}, dest[key]);
  } else {
    dest[field] = state[field] && state[field].value;
  }
};

const getValues = (fields, state) =>
  fields.reduce((accumulator, field) => {
    getValue(field, state, accumulator);
    return accumulator;
  }, {});

export default getValues;
