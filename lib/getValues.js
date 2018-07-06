'use strict';

exports.__esModule = true;
/**
 * Given a state[field], get the value.
 *  Fallback to .initialValue when .value is undefined to prevent double render/initialize cycle.
 *  See {@link https://github.com/erikras/redux-form/issues/621}.
 */
var itemToValue = function itemToValue(_ref) {
  var value = _ref.value,
      initialValue = _ref.initialValue;
  return typeof value !== 'undefined' ? value : initialValue;
};

var getValue = function getValue(field, state, dest) {
  var dotIndex = field.indexOf('.');
  var openIndex = field.indexOf('[');
  var closeIndex = field.indexOf(']');
  if (openIndex > 0 && closeIndex !== openIndex + 1) {
    throw new Error('found [ not followed by ]');
  }
  if (openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    // array field
    var key = field.substring(0, openIndex);
    var rest = field.substring(closeIndex + 1);
    if (rest[0] === '.') {
      rest = rest.substring(1);
    }
    var array = state && state[key] || [];
    if (rest) {
      if (!dest[key]) {
        dest[key] = [];
      }
      array.forEach(function (item, index) {
        if (!dest[key][index]) {
          dest[key][index] = {};
        }
        getValue(rest, item, dest[key][index]);
      });
    } else {
      dest[key] = array.map(itemToValue);
    }
  } else if (dotIndex > 0) {
    // subobject field
    var _key = field.substring(0, dotIndex);
    var _rest = field.substring(dotIndex + 1);
    if (!dest[_key]) {
      dest[_key] = {};
    }
    getValue(_rest, state && state[_key] || {}, dest[_key]);
  } else {
    dest[field] = state[field] && itemToValue(state[field]);
  }
};

var getValues = function getValues(fields, state) {
  return fields.reduce(function (accumulator, field) {
    getValue(field, state, accumulator);
    return accumulator;
  }, {});
};

exports.default = getValues;