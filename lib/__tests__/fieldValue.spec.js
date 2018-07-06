'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _fieldValue = require('../fieldValue');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('fieldValue', function () {
  describe('makeFieldValue', function () {
    it('should be okay with non-objects', function () {
      (0, _expect2.default)((0, _fieldValue.makeFieldValue)()).toBe(undefined);
      (0, _expect2.default)((0, _fieldValue.makeFieldValue)(null)).toBe(null);
      (0, _expect2.default)((0, _fieldValue.makeFieldValue)([1, 2])).toEqual([1, 2]);
      (0, _expect2.default)((0, _fieldValue.makeFieldValue)('not an object')).toEqual('not an object');
    });

    it('should return the same object back', function () {
      var someObject = { b: 1 };
      (0, _expect2.default)((0, _fieldValue.makeFieldValue)(someObject)).toBe(someObject);
    });

    it('should not affect deep equal', function () {
      var someObject = { b: 1 };
      (0, _expect2.default)(someObject).toEqual({ b: 1 });
      (0, _fieldValue.makeFieldValue)(someObject);
      (0, _expect2.default)(someObject).toEqual({ b: 1 });
    });

    it('should set the field value flag', function () {
      var someObject = { b: 1 };
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(someObject)).toBe(false);
      (0, _fieldValue.makeFieldValue)(someObject);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(someObject)).toBe(true);
    });
  });

  describe('isFieldValue', function () {
    it('should be okay with non-objects', function () {
      (0, _expect2.default)((0, _fieldValue.isFieldValue)()).toBe(false);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(null)).toBe(false);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)([1, 2])).toBe(false);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)('not an object')).toBe(false);
    });
  });
});