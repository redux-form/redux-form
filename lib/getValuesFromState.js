'use strict';

exports.__esModule = true;

var _fieldValue = require('./fieldValue');

/**
 * A different version of getValues() that does not need the fields array
 */
var getValuesFromState = function getValuesFromState(state) {
  if (!state) {
    return state;
  }
  var keys = Object.keys(state);
  if (!keys.length) {
    return undefined;
  }
  return keys.reduce(function (accumulator, key) {
    var field = state[key];
    if (field) {
      if ((0, _fieldValue.isFieldValue)(field)) {
        if (field.value !== undefined) {
          accumulator[key] = field.value;
        }
      } else if (Array.isArray(field)) {
        accumulator[key] = field.map(function (arrayField) {
          return (0, _fieldValue.isFieldValue)(arrayField) ? arrayField.value : getValuesFromState(arrayField);
        });
      } else if (typeof field === 'object') {
        var result = getValuesFromState(field);

        if (result && Object.keys(result).length > 0) {
          accumulator[key] = result;
        }
      }
    }
    return accumulator;
  }, {});
};

exports.default = getValuesFromState;