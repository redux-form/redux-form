const flag = '_isFieldValue';
const isObject = object => typeof object === 'object';

export function makeFieldValue(object) {
  if (object && isObject(object)) {
    Object.defineProperty(object, flag, {value: true});
  }
  return object;
}

export function isFieldValue(object) {
  return !!(object && isObject(object) && object[flag]);
}
