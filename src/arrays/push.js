const createPush = (length, arraySplice) =>
  (value = null) => arraySplice(length, 0, value) 

export default createPush