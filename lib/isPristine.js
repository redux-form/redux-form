'use strict';

exports.__esModule = true;
exports.default = isPristine;
function isPristine(initial, data) {
  if (initial === data) {
    return true;
  }
  if (typeof initial === 'boolean' || typeof data === 'boolean') {
    return initial === data;
  } else if (initial instanceof Date && data instanceof Date) {
    return initial.getTime() === data.getTime();
  } else if (initial && typeof initial === 'object') {
    if (!data || typeof data !== 'object') {
      return false;
    }
    var initialKeys = Object.keys(initial);
    var dataKeys = Object.keys(data);
    if (initialKeys.length !== dataKeys.length) {
      return false;
    }
    for (var index = 0; index < dataKeys.length; index++) {
      var key = dataKeys[index];
      if (!isPristine(initial[key], data[key])) {
        return false;
      }
    }
  } else if (initial || data) {
    // allow '' to equate to undefined or null
    return initial === data;
  }
  return true;
}