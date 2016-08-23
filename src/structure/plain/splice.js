const splice = (array = [], index, removeNum, value) => {
  if (index < array.length) {
    if (value === undefined && !removeNum) { // inserting undefined
      const copy = [ ...array ]
      copy.splice(index, 0, null)
      copy[ index ] = undefined
      return copy
    }
    if (value != null) {
      const copy = [ ...array ]
      copy.splice(index, removeNum, value)   // removing and adding
      return copy
    }
    const copy = [ ...array ]
    copy.splice(index, removeNum)   // removing
    return copy
  }
  if (removeNum) { // trying to remove non-existant item: return original array
    return array
  }
  // trying to add outside of range: just set value
  const copy = [ ...array ]
  copy[ index ] = value
  return copy
}

export default splice
