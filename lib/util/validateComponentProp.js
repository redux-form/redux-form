'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactIs = require('react-is');

var validateComponentProp = function validateComponentProp(props, propName, componentName) {
  if (!(0, _reactIs.isValidElementType)(props[propName])) {
    return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`.');
  }
  return null;
};
exports.default = validateComponentProp;