export default function isValid(error) {
  if (Array.isArray(error)) {
    return error.reduce((valid, errorValue) => valid && isValid(errorValue), true);
  }
  return !error;
}
