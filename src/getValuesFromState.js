/**
 * A different version of getValues() that does not need the fields array
 */
const getValuesFromState = state => {
  if (!state) {
    return state;
  }
  const keys = Object.keys(state);
  if (!keys.length) {
    return undefined;
  }
  return keys.reduce((accumulator, key) => {
    const field = state[key];
    if (field) {
      if (field.hasOwnProperty && field.hasOwnProperty('value')) {
        if (field.value !== undefined) {
          accumulator[key] = field.value;
        }
      } else if (Array.isArray(field)) {
        accumulator[key] = field.map(arrayField => arrayField.value || getValuesFromState(arrayField));
      } else if (typeof field === 'object') {
        accumulator[key] = getValuesFromState(field);
      }
    }
    return accumulator;
  }, {});
};

export default getValuesFromState;
