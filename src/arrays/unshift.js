const createUnshift = arraySplice =>
  value => arraySplice(0, 0, value)

export default createUnshift