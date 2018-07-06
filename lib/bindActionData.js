'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = bindActionData;

var _mapValues = require('./mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Adds additional properties to the results of the function or map of functions passed
 */
function bindActionData(action, data) {
  if (typeof action === 'function') {
    return function () {
      return _extends({}, action.apply(undefined, arguments), data);
    };
  }
  if (typeof action === 'object') {
    return (0, _mapValues2.default)(action, function (value) {
      return bindActionData(value, data);
    });
  }
  return action;
}