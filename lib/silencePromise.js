'use strict';

exports.__esModule = true;

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {
  return undefined;
};

var silencePromise = function silencePromise(promise) {
  return (0, _isPromise2.default)(promise) ? promise.then(noop, noop) : promise;
};

exports.default = silencePromise;