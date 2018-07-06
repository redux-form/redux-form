'use strict';

exports.__esModule = true;
exports.default = isValid;
function isValid(error) {
  if (Array.isArray(error)) {
    return error.reduce(function (valid, errorValue) {
      return valid && isValid(errorValue);
    }, true);
  }
  if (error && typeof error === 'object') {
    return Object.keys(error).reduce(function (valid, key) {
      return valid && isValid(error[key]);
    }, true);
  }
  return !error;
}