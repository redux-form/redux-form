const createFieldArrayProps = (getIn, size, name,
  {
    arrayInsert, arrayMove, arrayPop, arrayPush, arrayRemove, arrayRemoveAll, arrayShift,
    arraySplice, arraySwap, arrayUnshift, asyncError, // eslint-disable-line no-unused-vars
    dirty, pristine, submitError, submitFailed, // eslint-disable-line no-unused-vars
    syncError, value, props, ...rest
  }) => {
  const error = syncError || asyncError || submitError
  const length = size(value)
  return {
    fields: {
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
      valid: !error
    },
    ...props,
    ...rest
  }
}

export default createFieldArrayProps
