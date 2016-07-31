const splice = (array = [], index, removeNum, value) => {
  const copy = [ ...array ]
  if (removeNum) {
    copy.splice(index, removeNum)   // removing
  } else {
    if(index < copy.length) {
      copy.splice(index, 0, value)  // adding
    } else {
      copy[index] = value           // outside range, so just set it
    }
  }
  return copy
}

export default splice
