const normalizeMin = (value, previousValue, allValues, previousAllValues) => {
  if (allValues.max !== previousAllValues.max) {
    // max changed
    if (value === undefined || Number(allValues.max) < Number(value)) {
      return allValues.max
    }
  }
  return value
}

export default normalizeMin
