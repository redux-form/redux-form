export default function isPristine(initial, data) {
  if (initial === data) {
    return true;
  }
  if (initial && typeof initial === 'object') {
    if (!data || typeof data !== 'object') {
      return false;
    }
    const dataKeys = Object.keys(data);
    for (let i = 0; i < dataKeys.length; i++) {
      const key = dataKeys[i];
      if (!isPristine(initial[key], data[key])) {
        return false;
      }
    }
  } else if (initial || data) { // allow '' to equate to undefined or null
    return initial === data;
  }
  return true;
}
