'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _asyncValidation = require('../asyncValidation');

var _asyncValidation2 = _interopRequireDefault(_asyncValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('asyncValidation', function () {
  var field = 'myField';

  it('should throw an error if fn does not return a promise', function () {
    var fn = function fn() {
      return null;
    };
    var start = function start() {
      return null;
    };
    var stop = function stop() {
      return null;
    };
    (0, _expect2.default)(function () {
      return (0, _asyncValidation2.default)(fn, start, stop, field);
    }).toThrow(/promise/);
  });

  it('should return a promise', function () {
    var fn = function fn() {
      return Promise.resolve();
    };
    var start = function start() {
      return null;
    };
    var stop = function stop() {
      return null;
    };
    (0, _expect2.default)((0, _isPromise2.default)((0, _asyncValidation2.default)(fn, start, stop, field))).toBe(true);
  });

  it('should call start, fn, and stop on promise resolve', function () {
    var fn = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var start = (0, _expect.createSpy)();
    var stop = (0, _expect.createSpy)();
    var promise = (0, _asyncValidation2.default)(fn, start, stop, field);
    (0, _expect2.default)(fn).toHaveBeenCalled();
    (0, _expect2.default)(start).toHaveBeenCalled().toHaveBeenCalledWith(field);
    return promise.then(function () {
      (0, _expect2.default)(stop).toHaveBeenCalled();
    }, function () {
      (0, _expect2.default)(false).toBe(true); // should not get into reject branch
    });
  });

  it('should throw when promise rejected with no errors', function () {
    var fn = (0, _expect.createSpy)().andReturn(Promise.reject());
    var start = (0, _expect.createSpy)();
    var stop = (0, _expect.createSpy)();
    var promise = (0, _asyncValidation2.default)(fn, start, stop, field);
    (0, _expect2.default)(fn).toHaveBeenCalled();
    (0, _expect2.default)(start).toHaveBeenCalled().toHaveBeenCalledWith(field);
    return promise.then(function () {
      (0, _expect2.default)(false).toBe(true); // should not get into resolve branch
    }, function () {
      (0, _expect2.default)(stop).toHaveBeenCalled();
    });
  });

  it('should call start, fn, and stop on promise reject', function () {
    var errors = { foo: 'error' };
    var fn = (0, _expect.createSpy)().andReturn(Promise.reject(errors));
    var start = (0, _expect.createSpy)();
    var stop = (0, _expect.createSpy)();
    var promise = (0, _asyncValidation2.default)(fn, start, stop, field);
    (0, _expect2.default)(fn).toHaveBeenCalled();
    (0, _expect2.default)(start).toHaveBeenCalled().toHaveBeenCalledWith(field);
    return promise.then(function () {
      (0, _expect2.default)(false).toBe(true); // should not get into resolve branch
    }, function () {
      (0, _expect2.default)(stop).toHaveBeenCalled().toHaveBeenCalledWith(errors);
    });
  });
});