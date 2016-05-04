const createShift = (array, length, getIn, arraySplice) =>
  () => {
    if (array && length) {
      arraySplice(0, 1)
      return getIn(array, 0)
    }
  }

export default createShift