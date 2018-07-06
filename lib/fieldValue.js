'use strict';

exports.__esModule = true;
exports.makeFieldValue = makeFieldValue;
exports.isFieldValue = isFieldValue;
var flag = '_isFieldValue';
var isObject = function isObject(object) {
  return typeof object === 'object';
};

function makeFieldValue(object) {
  if (object && isObject(object)) {
    Object.defineProperty(object, flag, { value: true });
  }
  return object;
}

function isFieldValue(object) {
  return !!(object && isObject(object) && object[flag]);
}