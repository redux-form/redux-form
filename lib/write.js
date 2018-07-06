'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Writes any potentially deep value from an object using dot and array syntax,
 * and returns a new copy of the object.
 */
var write = function write(path, value, object) {
  var _extends7;

  var dotIndex = path.indexOf('.');
  if (dotIndex === 0) {
    return write(path.substring(1), value, object);
  }
  var openIndex = path.indexOf('[');
  var closeIndex = path.indexOf(']');
  if (dotIndex >= 0 && (openIndex < 0 || dotIndex < openIndex)) {
    var _extends2;

    // is dot notation
    var key = path.substring(0, dotIndex);
    return _extends({}, object, (_extends2 = {}, _extends2[key] = write(path.substring(dotIndex + 1), value, object[key] || {}), _extends2));
  }
  if (openIndex >= 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    var _extends6;

    // is array notation
    if (closeIndex < 0) {
      throw new Error('found [ but no ]');
    }
    var _key = path.substring(0, openIndex);
    var index = path.substring(openIndex + 1, closeIndex);
    var array = object[_key] || [];
    var rest = path.substring(closeIndex + 1);
    if (index) {
      var _extends4;

      // indexed array
      if (rest.length) {
        var _extends3;

        // need to keep recursing
        var dest = array[index] || {};
        var arrayCopy = [].concat(array);
        arrayCopy[index] = write(rest, value, dest);
        return _extends({}, object || {}, (_extends3 = {}, _extends3[_key] = arrayCopy, _extends3));
      }
      var copy = [].concat(array);
      copy[index] = typeof value === 'function' ? value(copy[index]) : value;
      return _extends({}, object || {}, (_extends4 = {}, _extends4[_key] = copy, _extends4));
    }
    // indexless array
    if (rest.length) {
      var _extends5;

      // need to keep recursing
      if ((!array || !array.length) && typeof value === 'function') {
        return object; // don't even set a value under [key]
      }
      var _arrayCopy = array.map(function (dest) {
        return write(rest, value, dest);
      });
      return _extends({}, object || {}, (_extends5 = {}, _extends5[_key] = _arrayCopy, _extends5));
    }
    var result = void 0;
    if (Array.isArray(value)) {
      result = value;
    } else if (object[_key]) {
      result = array.map(function (dest) {
        return typeof value === 'function' ? value(dest) : value;
      });
    } else if (typeof value === 'function') {
      return object; // don't even set a value under [key]
    } else {
      result = value;
    }
    return _extends({}, object || {}, (_extends6 = {}, _extends6[_key] = result, _extends6));
  }
  return _extends({}, object, (_extends7 = {}, _extends7[path] = typeof value === 'function' ? value(object[path]) : value, _extends7));
};

exports.default = write;