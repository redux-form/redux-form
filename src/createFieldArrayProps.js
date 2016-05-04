const createFieldArrayProps = (deepEqual, getIn, size, name,
  {
    arrayInsert, arrayPop, arrayPush, arrayRemove, arrayShift,
    arraySplice, arraySwap, arrayUnshift, asyncError, initial, state,
    submitError, submitFailed, value, ...rest
  }, syncError, initialPropValue) => {
  const error = syncError || asyncError || submitError
  const initialValue = initial || initialPropValue
  const array = value || initialValue
  const pristine = deepEqual(value, initialValue)
  const length = size(array)
  return {
    dirty: !pristine,
    error,
    forEach: callback => (array || []).forEach((item, index) => callback(`${name}[${index}]`, index)),
    insert: arrayInsert,
    invalid: !!error,
    length,
    map: callback => (array || []).map((item, index) => callback(`${name}[${index}]`, index)),
    pop: () => {
      arrayPop()
      return getIn(array, length - 1)
    },
    pristine,
    push: arrayPush,
    remove: arrayRemove,
    shift: () => {
      arrayShift()
      return getIn(array, 0)
    },
    swap: arraySwap,
    unshift: arrayUnshift,
    valid: !error,
    ...rest
  }
}

export default createFieldArrayProps
