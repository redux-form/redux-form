const isMetaKey = key => key[0] === '_';

/**
 * Sets an error on a field deep in the tree, returning a new copy of the state
 */
const setErrors = (state, errors, destKey) => {
  const clear = () => {
    if (Array.isArray(state)) {
      return state.map((stateItem, index) => setErrors(stateItem, errors && errors[index], destKey));
    }
    if (state && typeof state === 'object') {
      return Object.keys(state)
        .reduce((accumulator, key) =>
            isMetaKey(key) ? accumulator : {
              ...accumulator,
              [key]: setErrors(state[key], errors && errors[key], destKey)
            },
          state);
    }
    return state;
  };
  if (!errors) {
    if (!state) {
      return state;
    }
    if (state[destKey]) {
      const copy = {...state};
      delete copy[destKey];
      return copy;
    }
    return clear();
  }
  if (typeof errors === 'string') {
    return {
      ...state,
      [destKey]: errors // must be actual error
    };
  }
  if (Array.isArray(errors)) {
    if (!state || Array.isArray(state)) {
      const copy = (state || []).map((stateItem, index) => setErrors(stateItem, errors[index], destKey));
      errors.forEach((errorItem, index) => copy[index] = setErrors(copy[index], errorItem, destKey));
      return copy;
    }
    return setErrors(state, errors[0], destKey);  // use first error
  }
  const errorKeys = Object.keys(errors);
  if (!errorKeys.length && !state) {
    return state;
  }
  return errorKeys.reduce((accumulator, key) =>
      isMetaKey(key) ? accumulator : {
        ...accumulator,
        [key]: setErrors(state && state[key], errors[key], destKey)
      },
    clear() || {});
};

export default setErrors;
