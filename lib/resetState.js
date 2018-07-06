'use strict';

exports.__esModule = true;

var _fieldValue = require('./fieldValue');

var reset = function reset(value) {
  return (0, _fieldValue.makeFieldValue)(value === undefined || value && value.initial === undefined ? {} : { initial: value.initial, value: value.initial });
};

/**
 * Sets the initial values into the state and returns a new copy of the state
 */
var resetState = function resetState(values) {
  return values ? Object.keys(values).reduce(function (accumulator, key) {
    var value = values[key];
    if (Array.isArray(value)) {
      accumulator[key] = value.map(function (item) {
        return (0, _fieldValue.isFieldValue)(item) ? reset(item) : resetState(item);
      });
    } else if (value) {
      if ((0, _fieldValue.isFieldValue)(value)) {
        accumulator[key] = reset(value);
      } else if (typeof value === 'object' && value !== null) {
        accumulator[key] = resetState(value);
      } else {
        accumulator[key] = value;
      }
    }
    return accumulator;
  }, {}) : values;
};

exports.default = resetState;