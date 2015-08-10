export function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}

export function isPristine(initial, data) {
  if (initial === data) {
    return true;
  }
  const dataKeys = Object.keys(data);
  for (let i = 0; i < dataKeys.length; i++) {
    const key = dataKeys[i];
    const value = data[key];
    const initialValue = initial[key];
    if ((value || initialValue) /* allow '' to equate to undefined or null */ &&
      value !== initialValue) {
      return false;
    }
  }
  return true;
}
