const createPop = (array, length, getIn, arraySplice) =>
  () => {
    if (array && length) {
      arraySplice(length - 1, 1)
      return getIn(array, length - 1)
    }
  }

export default createPop