'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _removeField = require('../removeField');

var _removeField2 = _interopRequireDefault(_removeField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('removeField', function () {
  it('should have no effect if simple field does not exist', function () {
    (0, _expect2.default)((0, _removeField2.default)({ foo: 'bar' }, 'baz')).toEqual({ foo: 'bar' });
  });

  it('should not return same instance', function () {
    var fields = { foo: 'bar' };
    (0, _expect2.default)((0, _removeField2.default)(fields, 'foo')).toNotBe(fields);
  });

  it('should remove a simple field', function () {
    (0, _expect2.default)((0, _removeField2.default)({ foo: 'bar', dog: 42 }, 'dog')).toEqual({ foo: 'bar' });
  });

  it('should remove a nested field', function () {
    (0, _expect2.default)((0, _removeField2.default)({ foo: { rat: 'bar' }, dog: 42 }, 'foo.rat')).toEqual({ dog: 42 });
  });

  it('should remove a nested field from root', function () {
    (0, _expect2.default)((0, _removeField2.default)({ foo: { rat: 'bar' }, dog: 42 }, 'foo')).toEqual({ dog: 42 });
  });

  it('should remove an array field', function () {
    (0, _expect2.default)((0, _removeField2.default)({ foo: [{ rat: 'bar' }], dog: 42 }, 'foo[].rat')).toEqual({ dog: 42 });
  });

  it('should remove a deep field', function () {
    (0, _expect2.default)((0, _removeField2.default)({ foo: [{ rat: { pig: 'bar' } }], dog: 42 }, 'foo[].rat.pig')).toEqual({ dog: 42 });
  });

  it('should remove an array field from root', function () {
    (0, _expect2.default)((0, _removeField2.default)({ foo: [{ rat: 'bar' }], dog: 42 }, 'foo')).toEqual({ dog: 42 });
  });
});