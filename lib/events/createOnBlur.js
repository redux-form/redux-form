'use strict';

exports.__esModule = true;

var _getValue = require('./getValue');

var _getValue2 = _interopRequireDefault(_getValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createOnBlur = function createOnBlur(name, blur, isReactNative, afterBlur) {
  return function (event) {
    var value = (0, _getValue2.default)(event, isReactNative);
    blur(name, value);
    if (afterBlur) {
      afterBlur(name, value);
    }
  };
};
exports.default = createOnBlur;