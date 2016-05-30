const createFieldArrayProps = (getIn, size, name,
  {
    arrayInsert, arrayPop, arrayPush, arrayRemove, arrayShift,
    arraySplice, arraySwap, arrayUnshift, asyncError, dirty, pristine, state,
    submitError, submitFailed, value, ...rest
  }, syncError) => {
  const error = syncError || asyncError || submitError
  const length = size(value)
  return {
    fields: {
      dirty,
      error,
      forEach: callback => (value || []).forEach((item, index) => callback(`${name}[${index}]`, index)),
      insert: arrayInsert,
      invalid: !!error,
      length,
      map: callback => (value || []).map((item, index) => callback(`${name}[${index}]`, index)),
      pop: () => {
        arrayPop()
        return getIn(value, length - 1)
      },
      pristine,
      push: arrayPush,
      remove: arrayRemove,
      shift: () => {
        arrayShift()
        return getIn(value, 0)
      },
      swap: arraySwap,
      unshift: arrayUnshift,
      valid: !error
    },
    ...rest
  }
}

export default createFieldArrayProps
