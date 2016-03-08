const normalizeMax = (value, previousValue, allValues, previousAllValues) => {
  if (allValues.min !== previousAllValues.min) {
    // min changed
    if (value === undefined || Number(allValues.min) > Number(value)) {
      return allValues.min;
    }
  }
  return value;
};

export default normalizeMax;
