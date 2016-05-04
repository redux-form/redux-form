const createInsert = (arraySplice) =>
  (index, value) => arraySplice(index, 0, value) 

export default createInsert