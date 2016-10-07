const createFieldArrayProps = (getIn, name,
  {
    arrayInsert, arrayMove, arrayPop, arrayPush, arrayRemove, arrayRemoveAll, arrayShift,
    arraySplice, arraySwap, arrayUnshift, asyncError, // eslint-disable-line no-unused-vars
    dirty, length, pristine, submitError, state,
    submitFailed, submitting, // eslint-disable-line no-unused-vars
    syncError, syncWarning, value, props, ...rest
  }) => {
  const error = syncError || asyncError || submitError
  const warning = syncWarning
  return {
    fields: {
      _isFieldArray: true,
      forEach: callback => (value || []).forEach((item, index) => callback(`${name}[${index}]`, index)),
      insert: arrayInsert,
      length,
      map: callback => (value || []).map((item, index) => callback(`${name}[${index}]`, index)),
      move: arrayMove,
      name,
      pop: () => {
        arrayPop()
        return getIn(value, length - 1)
      },
      push: arrayPush,
      reduce: (callback, initial) => (value || [])
        .reduce((accumulator, item, index) => callback(accumulator, `${name}[${index}]`, index), initial),
      remove: arrayRemove,
      removeAll: arrayRemoveAll,
      shift: () => {
        arrayShift()
        return getIn(value, 0)
      },
      swap: arraySwap,
      unshift: arrayUnshift
    },
    meta: {
      dirty,
      error,
      warning,
      invalid: !!error,
      pristine,
      submitting,
      touched: !!(state && getIn(state, 'touched')),
      valid: !error
    },
    ...props,
    ...rest
  }
}

export default createFieldArrayProps
