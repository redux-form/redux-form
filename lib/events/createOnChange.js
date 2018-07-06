'use strict';

exports.__esModule = true;

var _getValue = require('./getValue');

var _getValue2 = _interopRequireDefault(_getValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createOnChange = function createOnChange(name, change, isReactNative) {
  return function (event) {
    return change(name, (0, _getValue2.default)(event, isReactNative));
  };
};
exports.default = createOnChange;