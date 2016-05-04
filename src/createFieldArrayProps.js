import createInsert from './arrays/insert'
import createPop from './arrays/pop'
import createPush from './arrays/push'
import createRemove from './arrays/remove'
import createShift from './arrays/shift'
import createUnshift from './arrays/unshift'

const createFieldArrayProps = (deepEqual, getIn, size, name,
  {
    arraySplice, arraySwap, asyncError, initial, state,
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
    insert: createInsert(arraySplice),
    invalid: !!error,
    length,
    map: callback => (array || []).map((item, index) => callback(`${name}[${index}]`, index)),
    pop: createPop(array, length, getIn, arraySplice),
    pristine,
    push: createPush(length, arraySplice),
    remove: createRemove(arraySplice),
    shift: createShift(array, length, getIn, arraySplice),
    swap: arraySwap,
    unshift: createUnshift(arraySplice),
    valid: !error,
    ...rest
  }
}

export default createFieldArrayProps
