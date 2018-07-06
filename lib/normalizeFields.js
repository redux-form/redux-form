'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = normalizeFields;

var _fieldValue = require('./fieldValue');

function extractKey(field) {
  var dotIndex = field.indexOf('.');
  var openIndex = field.indexOf('[');
  var closeIndex = field.indexOf(']');

  if (openIndex > 0 && closeIndex !== openIndex + 1) {
    throw new Error('found [ not followed by ]');
  }

  var isArray = openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex);
  var key = void 0;
  var nestedPath = void 0;

  if (isArray) {
    key = field.substring(0, openIndex);
    nestedPath = field.substring(closeIndex + 1);

    if (nestedPath[0] === '.') {
      nestedPath = nestedPath.substring(1);
    }
  } else if (dotIndex > 0) {
    key = field.substring(0, dotIndex);
    nestedPath = field.substring(dotIndex + 1);
  } else {
    key = field;
  }

  return { isArray: isArray, key: key, nestedPath: nestedPath };
}

function normalizeField(field, fullFieldPath, state, previousState, values, previousValues, normalizers) {
  if (field.isArray) {
    if (field.nestedPath) {
      var array = state && state[field.key] || [];
      var previousArray = previousState && previousState[field.key] || [];
      var nestedField = extractKey(field.nestedPath);

      return array.map(function (nestedState, i) {
        nestedState[nestedField.key] = normalizeField(nestedField, fullFieldPath, nestedState, previousArray[i], values, previousValues, normalizers);

        return nestedState;
      });
    }

    var _normalizer = normalizers[fullFieldPath];

    var result = _normalizer(state && state[field.key], previousState && previousState[field.key], values, previousValues);
    return field.isArray ? result && result.map(_fieldValue.makeFieldValue) : result;
  } else if (field.nestedPath) {
    var nestedState = state && state[field.key] || {};
    var _nestedField = extractKey(field.nestedPath);

    nestedState[_nestedField.key] = normalizeField(_nestedField, fullFieldPath, nestedState, previousState && previousState[field.key], values, previousValues, normalizers);

    return nestedState;
  }

  var finalField = state && state[field.key] || {};
  var normalizer = normalizers[fullFieldPath];

  finalField.value = normalizer(finalField.value, previousState && previousState[field.key] && previousState[field.key].value, values, previousValues);

  return (0, _fieldValue.makeFieldValue)(finalField);
}

function normalizeFields(normalizers, state, previousState, values, previousValues) {
  var newState = Object.keys(normalizers).reduce(function (accumulator, field) {
    var extracted = extractKey(field);

    accumulator[extracted.key] = normalizeField(extracted, field, state, previousState, values, previousValues, normalizers);

    return accumulator;
  }, {});

  return _extends({}, state, newState);
}