const createFieldArrayProps = (getIn, size, name,
  {
    arrayInsert, arrayMove, arrayPop, arrayPush, arrayRemove, arrayRemoveAll, arrayShift,
    arraySplice, arraySwap, arrayUnshift, asyncError, // eslint-disable-line no-unused-vars
    dirty, pristine, submitError, submitFailed, submitting, // eslint-disable-line no-unused-vars
    syncError, value, props, ...rest
  }) => {
  const error = syncError || asyncError || submitError
  const length = size(value)
  return {
    fields: {
      _isFieldArray: true,
      forEach: callback => (value || []).forEach((item, index) => callback(`${name}[${index}]`, index)),
      insert: arrayInsert,
      length,
      map: callback => (value || []).map((item, index) => callback(`${name}[${index}]`, index)),
      move: arrayMove,
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
      invalid: !!error,
      pristine,
      submitting,
      valid: !error
    },
    ...props,
    ...rest
  }
}

export default createFieldArrayProps
