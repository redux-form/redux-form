export default function isPristine(initial, data) {
  if (initial === data) {
    return true;
  }
  if (initial && typeof initial === 'object') {
    if (!data || typeof data !== 'object') {
      return false;
    }
    const dataKeys = Object.keys(data);
    for (let index = 0; index < dataKeys.length; index++) {
      const key = dataKeys[index];
      if (!isPristine(initial[key], data[key])) {
        return false;
      }
    }
  } else if (initial || data) { // allow '' to equate to undefined or null
    return initial === data;
  }
  return true;
}
