const isMetaKey = key => key[0] === '_';

/**
 * Sets an error on a field deep in the tree, returning a new copy of the state
 */
const setErrors = (state, errors, destKey, asyncField) => {
  if (asyncField && state[asyncField]) state[asyncField].asyncValidating = false;
  const clear = () => {
    if (Array.isArray(state)) {
      return state.map(
        (stateItem, index) => setErrors(stateItem, errors && errors[index], destKey, asyncField)
      );
    }
    if (typeof state === 'object') {
      return Object.keys(state)
        .reduce((accumulator, key) =>
            isMetaKey(key) ? accumulator : {
              ...accumulator,
              [key]: setErrors(state[key], errors && errors[key], destKey, asyncField)
            },
          state);
    }
    return state;
  };
  if (!errors) {
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
      const copy = (state || []).map(
        (stateItem, index) => setErrors(stateItem, errors[index], destKey, asyncField)
      );
      errors.forEach(
        (errorItem, index) => copy[index] = setErrors(copy[index], errorItem, destKey, asyncField)
      );
      return copy;
    }
    return setErrors(state, errors[0], destKey);
  }
  return Object.keys(errors).reduce((accumulator, key) =>
      isMetaKey(key) ? accumulator : {
        ...accumulator,
        [key]: setErrors(state && state[key], errors[key], destKey, asyncField)
      },
    clear() || {});
};

export default setErrors;
