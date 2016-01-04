/**
 * A different version of getValues() that does not need the fields array
 */
const hasValue = field => field !== undefined && field.hasOwnProperty && field.hasOwnProperty('value') && field.value !== undefined;

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
      if (hasValue(field) && (field.value === null || !hasValue(field.value))) {
        accumulator[key] = field.value;
      } else if (Array.isArray(field)) {
        accumulator[key] = field.map(arrayField => {
          if (hasValue(arrayField) && !hasValue(arrayField.value)) {
            return arrayField.value;
          }
          return getValuesFromState(arrayField);
        });
      } else if (typeof field === 'object') {
        const result = getValuesFromState(field);

        if (result && Object.keys(result).length > 0) {
          accumulator[key] = result;
        }
      }
    }
    return accumulator;
  }, {});
};

export default getValuesFromState;
