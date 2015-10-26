export default function isValid(error) {
  if (Array.isArray(error)) {
    return error.reduce((valid, errorValue) => valid && isValid(errorValue), true);
  }
  if (error && typeof error === 'object') {
    return Object.keys(error).reduce((valid, key) => valid && isValid(error[key]), true);
  }
  return !error;
}
