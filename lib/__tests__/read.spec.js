'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _read = require('../read');

var _read2 = _interopRequireDefault(_read);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('read', function () {
  it('should get simple values', function () {
    (0, _expect2.default)((0, _read2.default)('foo', { foo: 'bar' })).toBe('bar');
    (0, _expect2.default)((0, _read2.default)('foo', { foo: 7 })).toBe(7);
    (0, _expect2.default)((0, _read2.default)('bar', { bar: true })).toBe(true);
  });

  it('should get arbitrarily deep dotted values', function () {
    var data = {
      foo: {
        bar: {
          baz: 42
        }
      }
    };
    (0, _expect2.default)((0, _read2.default)('foo', data)).toBe(data.foo);
    (0, _expect2.default)((0, _read2.default)('foo.bar', data)).toBe(data.foo.bar);
    (0, _expect2.default)((0, _read2.default)('foo.bar.baz', data)).toBe(42);
  });

  it('should return undefined if structure is incomplete', function () {
    var data = {
      foo: {}
    };
    (0, _expect2.default)((0, _read2.default)('foo', data)).toBe(data.foo);
    (0, _expect2.default)((0, _read2.default)('foo.bar', data)).toBe(undefined);
    (0, _expect2.default)((0, _read2.default)('foo.bar.baz', data)).toBe(undefined);
  });

  it('should throw an error when array syntax is broken', function () {
    (0, _expect2.default)(function () {
      (0, _read2.default)('foo[dog', {});
    }).toThrow(/found/);
  });

  it('should get simple array values', function () {
    var data = {
      cat: ['foo', 'bar', 'baz']
    };
    (0, _expect2.default)((0, _read2.default)('cat[0]', data)).toBe('foo');
    (0, _expect2.default)((0, _read2.default)('cat[1]', data)).toBe('bar');
    (0, _expect2.default)((0, _read2.default)('cat[2]', data)).toBe('baz');
  });

  it('should get return undefined when array is not there', function () {
    var data = {
      cat: undefined
    };
    (0, _expect2.default)((0, _read2.default)('cat[0]', data)).toBe(undefined);
  });

  it('should get complex array values', function () {
    var data = {
      rat: {
        cat: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }]
      }
    };
    (0, _expect2.default)((0, _read2.default)('rat.cat[0].name', data)).toBe('foo');
    (0, _expect2.default)((0, _read2.default)('rat.cat[0][name]', data)).toBe('foo');
    (0, _expect2.default)((0, _read2.default)('rat.cat[1].name', data)).toBe('bar');
    (0, _expect2.default)((0, _read2.default)('rat.cat[1][name]', data)).toBe('bar');
    (0, _expect2.default)((0, _read2.default)('rat.cat[2].name', data)).toBe('baz');
    (0, _expect2.default)((0, _read2.default)('rat.cat[2][name]', data)).toBe('baz');
  });
});