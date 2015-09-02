export default function isValid(error) {
  if ( !Array.isArray(error) ) {
    return !error;
  }
  return error.reduce(( valid, errorValue ) => valid && !errorValue, true);
}
