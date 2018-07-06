'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _getDisplayName = require('../getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('getDisplayName', function () {
  it('should return the displayName if set', function () {
    (0, _expect2.default)((0, _getDisplayName2.default)({ displayName: 'Foo' })).toBe('Foo');
    (0, _expect2.default)((0, _getDisplayName2.default)({ displayName: 'Bar' })).toBe('Bar');
  });

  it('should return the name if set', function () {
    (0, _expect2.default)((0, _getDisplayName2.default)({ name: 'Foo' })).toBe('Foo');
    (0, _expect2.default)((0, _getDisplayName2.default)({ name: 'Bar' })).toBe('Bar');
  });

  it('should return "Component" if neither displayName nor name is set', function () {
    (0, _expect2.default)((0, _getDisplayName2.default)({})).toBe('Component');
  });
});