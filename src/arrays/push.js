const createPush = (length, arraySplice) =>
  value => arraySplice(length, 0, value) 

export default createPush
