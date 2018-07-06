'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _bindActionData = require('../bindActionData');

var _bindActionData2 = _interopRequireDefault(_bindActionData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('bindActionData', function () {
  it('should return a function when called with a function', function () {
    (0, _expect2.default)((0, _bindActionData2.default)(function () {
      return { foo: 'bar' };
    }, { baz: 7 })).toExist().toBeA('function');
  });

  it('should add keys when called with a function', function () {
    (0, _expect2.default)((0, _bindActionData2.default)(function () {
      return { foo: 'bar' };
    }, { baz: 7 })()).toEqual({
      foo: 'bar',
      baz: 7
    });
  });

  it('should pass along arguments when called with a function', function () {
    var action = (0, _bindActionData2.default)(function (data) {
      return { foo: data };
    }, { baz: 7 });
    (0, _expect2.default)(action('dog')).toEqual({
      foo: 'dog',
      baz: 7
    });
    (0, _expect2.default)(action('cat')).toEqual({
      foo: 'cat',
      baz: 7
    });
  });

  it('should return an object when called with an object', function () {
    var actions = (0, _bindActionData2.default)({
      a: function a() {
        return { foo: 'bar' };
      },
      b: function b() {
        return { cat: 'ralph' };
      }
    }, { baz: 7 });
    (0, _expect2.default)(actions).toExist().toBeA('object');
    (0, _expect2.default)(Object.keys(actions).length).toBe(2);
    (0, _expect2.default)(actions.a).toExist().toBeA('function');
    (0, _expect2.default)(actions.b).toExist().toBeA('function');
  });

  it('should add keys when called with an object', function () {
    var actions = (0, _bindActionData2.default)({
      a: function a() {
        return { foo: 'bar' };
      },
      b: function b() {
        return { cat: 'ralph' };
      }
    }, { baz: 7 });
    (0, _expect2.default)(actions.a()).toEqual({
      foo: 'bar',
      baz: 7
    });
    (0, _expect2.default)(actions.b()).toEqual({
      cat: 'ralph',
      baz: 7
    });
  });

  it('should pass along arguments when called with an object', function () {
    var actions = (0, _bindActionData2.default)({
      a: function a(value) {
        return { foo: value };
      },
      b: function b(value) {
        return { cat: value };
      }
    }, { baz: 9 });
    (0, _expect2.default)(actions.a('dog')).toEqual({
      foo: 'dog',
      baz: 9
    });
    (0, _expect2.default)(actions.b('Bob')).toEqual({
      cat: 'Bob',
      baz: 9
    });
  });
});