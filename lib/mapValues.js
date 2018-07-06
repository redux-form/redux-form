"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = mapValues;
/**
 * Maps all the values in the given object through the given function and saves them, by key, to a result object
 */
function mapValues(obj, fn) {
  return obj ? Object.keys(obj).reduce(function (accumulator, key) {
    var _extends2;

    return _extends({}, accumulator, (_extends2 = {}, _extends2[key] = fn(obj[key], key), _extends2));
  }, {}) : obj;
}