const makeEntry = value => value === undefined ? {} : {initial: value, value};
/**
 * Sets the initial values into the state and returns a new copy of the state
 */
const initializeState = values =>
  Object.keys(values).reduce((accumulator, key) => {
    const value = values[key];
    if (Array.isArray(value)) {
      accumulator[key] = value.map(item => typeof item === 'object' ? initializeState(item) : makeEntry(item));
    } else if (typeof value === 'object') {
      accumulator[key] = initializeState(value);
    } else {
      accumulator[key] = makeEntry(value);
    }
    return accumulator;
  }, {});

export default initializeState;
