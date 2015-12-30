import {isFieldValue, makeFieldValue} from './fieldValue';

const reset = value =>
  makeFieldValue(value === undefined || (value && value.initial === undefined)
    ? {}
    : {initial: value.initial, value: value.initial});

/**
 * Sets the initial values into the state and returns a new copy of the state
 */
const resetState = values =>
  values ? Object.keys(values).reduce((accumulator, key) => {
    const value = values[key];
    if (Array.isArray(value)) {
      accumulator[key] = value.map(item => isFieldValue(item) ? reset(item) : resetState(item));
    } else if (value) {
      if (isFieldValue(value)) {
        accumulator[key] = reset(value);
      } else if (typeof value === 'object' && value !== null) {
        accumulator[key] = resetState(value);
      } else {
        accumulator[key] = value;
      }
    }
    return accumulator;
  }, {}) : values;

export default resetState;
