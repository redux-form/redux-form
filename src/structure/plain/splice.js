const splice = (array = [], index, removeNum, value) => {
  if (index < array.length) {
    if (value != null) {
      const copy = [ ...array ]
      copy.splice(index, removeNum, value)   // removing and adding
      return copy
    } else {
      const copy = [ ...array ]
      copy.splice(index, removeNum)   // removing
      return copy
    }
  }
  if (value != null) {
    const copy = [ ...array ]
    copy[index] = value
    return copy
  }
  return array
}

export default splice
