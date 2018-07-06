'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _handleSubmit = require('../handleSubmit');

var _handleSubmit2 = _interopRequireDefault(_handleSubmit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('handleSubmit', function () {

  it('should stop if sync validation fails', function () {
    var _expect$toHaveBeenCal;

    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = (0, _expect.createSpy)().andReturn(69);
    var touch = (0, _expect.createSpy)();
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var submitFailed = (0, _expect.createSpy)();
    var onSubmitSuccess = (0, _expect.createSpy)();
    var onSubmitFail = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)();
    var validate = (0, _expect.createSpy)().andReturn({ foo: 'error' });
    var props = {
      fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    (0, _expect2.default)((0, _handleSubmit2.default)(submit, values, props, asyncValidate)).toBe(undefined);

    (_expect$toHaveBeenCal = (0, _expect2.default)(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal, fields);
    (0, _expect2.default)(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
    (0, _expect2.default)(asyncValidate).toNotHaveBeenCalled();
    (0, _expect2.default)(submit).toNotHaveBeenCalled();
    (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(submitFailed).toHaveBeenCalled();
    (0, _expect2.default)(onSubmitSuccess).toNotHaveBeenCalled();
    (0, _expect2.default)(onSubmitFail).toHaveBeenCalled();
  });

  it('should stop and return rejected promise if sync validation fails and returnRejectedSubmitPromise', function (done) {
    var _expect$toHaveBeenCal2;

    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var errorValue = { foo: 'error' };
    var submit = (0, _expect.createSpy)().andReturn(69);
    var touch = (0, _expect.createSpy)();
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var submitFailed = (0, _expect.createSpy)();
    var onSubmitSuccess = (0, _expect.createSpy)();
    var onSubmitFail = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)();
    var validate = (0, _expect.createSpy)().andReturn(errorValue);
    var props = {
      fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate, returnRejectedSubmitPromise: true
    };

    var result = (0, _handleSubmit2.default)(submit, values, props, asyncValidate);
    (0, _expect2.default)((0, _isPromise2.default)(result)).toBe(true);

    (_expect$toHaveBeenCal2 = (0, _expect2.default)(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal2, fields);
    (0, _expect2.default)(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
    (0, _expect2.default)(asyncValidate).toNotHaveBeenCalled();
    (0, _expect2.default)(submit).toNotHaveBeenCalled();
    (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(submitFailed).toHaveBeenCalled();
    (0, _expect2.default)(onSubmitSuccess).toNotHaveBeenCalled();
    (0, _expect2.default)(onSubmitFail).toHaveBeenCalled();
    result.then(function () {
      (0, _expect2.default)(false).toBe(true); // should not be in resolve branch
    }, function (error) {
      (0, _expect2.default)(error).toBe(errorValue);
      done();
    });
  });

  it('should return result of sync submit', function () {
    var _expect$toHaveBeenCal3;

    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = (0, _expect.createSpy)().andReturn(69);
    var dispatch = function dispatch() {
      return null;
    };
    var touch = (0, _expect.createSpy)();
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var submitFailed = (0, _expect.createSpy)();
    var onSubmitSuccess = (0, _expect.createSpy)();
    var onSubmitFail = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)();
    var validate = (0, _expect.createSpy)().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    (0, _expect2.default)((0, _handleSubmit2.default)(submit, values, props, asyncValidate)).toBe(69);

    (_expect$toHaveBeenCal3 = (0, _expect2.default)(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal3, fields);
    (0, _expect2.default)(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
    (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
    (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
    (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(submitFailed).toNotHaveBeenCalled();
    (0, _expect2.default)(onSubmitSuccess).toHaveBeenCalled();
    (0, _expect2.default)(onSubmitFail).toNotHaveBeenCalled();
  });

  it('should not submit if async validation fails', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = (0, _expect.createSpy)().andReturn(69);
    var dispatch = function dispatch() {
      return null;
    };
    var touch = (0, _expect.createSpy)();
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var submitFailed = (0, _expect.createSpy)();
    var onSubmitSuccess = (0, _expect.createSpy)();
    var onSubmitFail = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject());
    var validate = (0, _expect.createSpy)().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    return (0, _handleSubmit2.default)(submit, values, props, asyncValidate).then(function (result) {
      var _expect$toHaveBeenCal4;

      (0, _expect2.default)(result).toBe(undefined);
      (_expect$toHaveBeenCal4 = (0, _expect2.default)(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal4, fields);
      (0, _expect2.default)(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toNotHaveBeenCalled();
      (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(submitFailed).toHaveBeenCalled();
      (0, _expect2.default)(onSubmitSuccess).toNotHaveBeenCalled();
      (0, _expect2.default)(onSubmitFail).toHaveBeenCalled();
    }, function () {
      (0, _expect2.default)(false).toBe(true); // should not get into reject branch
    });
  });

  it('should not submit if async validation fails and return rejected promise', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = (0, _expect.createSpy)().andReturn(69);
    var dispatch = function dispatch() {
      return null;
    };
    var touch = (0, _expect.createSpy)();
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var submitFailed = (0, _expect.createSpy)();
    var onSubmitSuccess = (0, _expect.createSpy)();
    var onSubmitFail = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject());
    var validate = (0, _expect.createSpy)().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate, returnRejectedSubmitPromise: true
    };

    return (0, _handleSubmit2.default)(submit, values, props, asyncValidate).then(function () {
      (0, _expect2.default)(false).toBe(true); // should not get into resolve branch
    }, function (result) {
      var _expect$toHaveBeenCal5;

      (0, _expect2.default)(result).toBe(undefined);
      (_expect$toHaveBeenCal5 = (0, _expect2.default)(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal5, fields);
      (0, _expect2.default)(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toNotHaveBeenCalled();
      (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(submitFailed).toHaveBeenCalled();
      (0, _expect2.default)(onSubmitSuccess).toNotHaveBeenCalled();
      (0, _expect2.default)(onSubmitFail).toHaveBeenCalled();
    });
  });

  it('should sync submit if async validation passes', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = (0, _expect.createSpy)().andReturn(69);
    var dispatch = function dispatch() {
      return null;
    };
    var touch = (0, _expect.createSpy)();
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var submitFailed = (0, _expect.createSpy)();
    var onSubmitSuccess = (0, _expect.createSpy)();
    var onSubmitFail = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var validate = (0, _expect.createSpy)().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    return (0, _handleSubmit2.default)(submit, values, props, asyncValidate).then(function (result) {
      var _expect$toHaveBeenCal6;

      (0, _expect2.default)(result).toBe(69);
      (_expect$toHaveBeenCal6 = (0, _expect2.default)(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal6, fields);
      (0, _expect2.default)(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
      (0, _expect2.default)(startSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toNotHaveBeenCalled();
      (0, _expect2.default)(submitFailed).toNotHaveBeenCalled();
      (0, _expect2.default)(onSubmitSuccess).toHaveBeenCalled();
      (0, _expect2.default)(onSubmitFail).toNotHaveBeenCalled();
    }, function () {
      (0, _expect2.default)(false).toBe(true); // should not get into reject branch
    });
  });

  it('should async submit if async validation passes', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = (0, _expect.createSpy)().andReturn(Promise.resolve(69));
    var dispatch = function dispatch() {
      return null;
    };
    var touch = (0, _expect.createSpy)();
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var submitFailed = (0, _expect.createSpy)();
    var onSubmitSuccess = (0, _expect.createSpy)();
    var onSubmitFail = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var validate = (0, _expect.createSpy)().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    return (0, _handleSubmit2.default)(submit, values, props, asyncValidate).then(function (result) {
      var _expect$toHaveBeenCal7;

      (0, _expect2.default)(result).toBe(69);
      (_expect$toHaveBeenCal7 = (0, _expect2.default)(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal7, fields);
      (0, _expect2.default)(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
      (0, _expect2.default)(startSubmit).toHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submitFailed).toNotHaveBeenCalled();
      (0, _expect2.default)(onSubmitSuccess).toHaveBeenCalled();
      (0, _expect2.default)(onSubmitFail).toNotHaveBeenCalled();
    }, function () {
      (0, _expect2.default)(false).toBe(true); // should not get into reject branch
    });
  });

  it('should set submit errors if async submit fails', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submitErrors = { foo: 'error' };
    var submit = (0, _expect.createSpy)().andReturn(Promise.reject(submitErrors));
    var dispatch = function dispatch() {
      return null;
    };
    var touch = (0, _expect.createSpy)();
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var submitFailed = (0, _expect.createSpy)();
    var onSubmitSuccess = (0, _expect.createSpy)();
    var onSubmitFail = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var validate = (0, _expect.createSpy)().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    return (0, _handleSubmit2.default)(submit, values, props, asyncValidate).then(function (result) {
      var _expect$toHaveBeenCal8;

      (0, _expect2.default)(result).toBe(undefined);
      (_expect$toHaveBeenCal8 = (0, _expect2.default)(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal8, fields);
      (0, _expect2.default)(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
      (0, _expect2.default)(startSubmit).toHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
      (0, _expect2.default)(submitFailed).toNotHaveBeenCalled();
      (0, _expect2.default)(onSubmitSuccess).toNotHaveBeenCalled();
      (0, _expect2.default)(onSubmitFail).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
    }, function () {
      (0, _expect2.default)(false).toBe(true); // should not get into reject branch
    });
  });

  it('should set submit errors if async submit fails and return rejected promise', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submitErrors = { foo: 'error' };
    var submit = (0, _expect.createSpy)().andReturn(Promise.reject(submitErrors));
    var dispatch = function dispatch() {
      return null;
    };
    var touch = (0, _expect.createSpy)();
    var startSubmit = (0, _expect.createSpy)();
    var stopSubmit = (0, _expect.createSpy)();
    var submitFailed = (0, _expect.createSpy)();
    var onSubmitSuccess = (0, _expect.createSpy)();
    var onSubmitFail = (0, _expect.createSpy)();
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var validate = (0, _expect.createSpy)().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate, returnRejectedSubmitPromise: true
    };

    return (0, _handleSubmit2.default)(submit, values, props, asyncValidate).then(function () {
      (0, _expect2.default)(false).toBe(true); // should not get into resolve branch
    }, function (result) {
      var _expect$toHaveBeenCal9;

      (0, _expect2.default)(result).toBe(submitErrors);
      (_expect$toHaveBeenCal9 = (0, _expect2.default)(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal9, fields);
      (0, _expect2.default)(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      (0, _expect2.default)(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      (0, _expect2.default)(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch);
      (0, _expect2.default)(startSubmit).toHaveBeenCalled();
      (0, _expect2.default)(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
      (0, _expect2.default)(submitFailed).toNotHaveBeenCalled();
      (0, _expect2.default)(onSubmitSuccess).toNotHaveBeenCalled();
      (0, _expect2.default)(onSubmitFail).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
    });
  });
});