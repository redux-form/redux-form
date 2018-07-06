'use strict';

exports.__esModule = true;
exports.untouch = exports.touch = exports.swapArrayValues = exports.submitFailed = exports.stopSubmit = exports.stopAsyncValidation = exports.startSubmit = exports.startAsyncValidation = exports.reset = exports.removeArrayValue = exports.initialize = exports.focus = exports.destroy = exports.change = exports.blur = exports.autofill = exports.addArrayValue = undefined;

var _actionTypes = require('./actionTypes');

var addArrayValue = exports.addArrayValue = function addArrayValue(path, value, index, fields) {
  return { type: _actionTypes.ADD_ARRAY_VALUE, path: path, value: value, index: index, fields: fields };
};

var autofill = exports.autofill = function autofill(field, value) {
  return { type: _actionTypes.AUTOFILL, field: field, value: value };
};

var blur = exports.blur = function blur(field, value) {
  return { type: _actionTypes.BLUR, field: field, value: value };
};

var change = exports.change = function change(field, value) {
  return { type: _actionTypes.CHANGE, field: field, value: value };
};

var destroy = exports.destroy = function destroy() {
  return { type: _actionTypes.DESTROY };
};

var focus = exports.focus = function focus(field) {
  return { type: _actionTypes.FOCUS, field: field };
};

var initialize = exports.initialize = function initialize(data, fields) {
  var overwriteValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!Array.isArray(fields)) {
    throw new Error('must provide fields array to initialize() action creator');
  }
  return { type: _actionTypes.INITIALIZE, data: data, fields: fields, overwriteValues: overwriteValues };
};

var removeArrayValue = exports.removeArrayValue = function removeArrayValue(path, index) {
  return { type: _actionTypes.REMOVE_ARRAY_VALUE, path: path, index: index };
};

var reset = exports.reset = function reset() {
  return { type: _actionTypes.RESET };
};

var startAsyncValidation = exports.startAsyncValidation = function startAsyncValidation(field) {
  return { type: _actionTypes.START_ASYNC_VALIDATION, field: field };
};

var startSubmit = exports.startSubmit = function startSubmit() {
  return { type: _actionTypes.START_SUBMIT };
};

var stopAsyncValidation = exports.stopAsyncValidation = function stopAsyncValidation(errors) {
  return { type: _actionTypes.STOP_ASYNC_VALIDATION, errors: errors };
};

var stopSubmit = exports.stopSubmit = function stopSubmit(errors) {
  return { type: _actionTypes.STOP_SUBMIT, errors: errors };
};

var submitFailed = exports.submitFailed = function submitFailed() {
  return { type: _actionTypes.SUBMIT_FAILED };
};

var swapArrayValues = exports.swapArrayValues = function swapArrayValues(path, indexA, indexB) {
  return { type: _actionTypes.SWAP_ARRAY_VALUES, path: path, indexA: indexA, indexB: indexB };
};

var touch = exports.touch = function touch() {
  for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
    fields[_key] = arguments[_key];
  }

  return { type: _actionTypes.TOUCH, fields: fields };
};

var untouch = exports.untouch = function untouch() {
  for (var _len2 = arguments.length, fields = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fields[_key2] = arguments[_key2];
  }

  return { type: _actionTypes.UNTOUCH, fields: fields };
};