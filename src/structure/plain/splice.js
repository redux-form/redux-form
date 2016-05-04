const splice = (array = [], index, removeNum, value) => {
  const copy = [...array]
  if(removeNum) {
    copy.splice(index, removeNum) // removing
  } else {
    copy.splice(index, 0, value)  // adding
  }
  return copy
}

export default splice
