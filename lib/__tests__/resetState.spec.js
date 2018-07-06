'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _resetState = require('../resetState');

var _resetState2 = _interopRequireDefault(_resetState);

var _fieldValue = require('../fieldValue');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('resetState', function () {
  it('should return empty if no values', function () {
    (0, _expect2.default)((0, _resetState2.default)({})).toEqual({});
  });

  it('should reset simple values', function () {
    var result = (0, _resetState2.default)({
      foo: (0, _fieldValue.makeFieldValue)({
        initial: 'dog',
        value: 'cat'
      }),
      bar: (0, _fieldValue.makeFieldValue)({
        initial: 'rat',
        value: 'pig'
      }),
      baz: (0, _fieldValue.makeFieldValue)({
        initial: 'hog',
        value: 'bun'
      })
    });
    (0, _expect2.default)(result).toBeA('object').toEqual({
      foo: {
        initial: 'dog',
        value: 'dog'
      },
      bar: {
        initial: 'rat',
        value: 'rat'
      },
      baz: {
        initial: 'hog',
        value: 'hog'
      }
    });
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.foo)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.bar)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.baz)).toBe(true);
  });

  it('should reset deep values', function () {
    var result = (0, _resetState2.default)({
      foo: {
        bar: (0, _fieldValue.makeFieldValue)({
          initial: 'dog',
          value: 'cat'
        })
      },
      baz: {
        chad: (0, _fieldValue.makeFieldValue)({
          initial: 'fun',
          value: 'bun'
        }),
        chaz: (0, _fieldValue.makeFieldValue)({
          value: 'shouldbesettoundefined'
        })
      }
    });
    (0, _expect2.default)(result).toBeA('object').toEqual({
      foo: {
        bar: {
          initial: 'dog',
          value: 'dog'
        }
      },
      baz: {
        chad: {
          initial: 'fun',
          value: 'fun'
        },
        chaz: {}
      }
    });
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.foo.bar)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.baz.chad)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.baz.chaz)).toBe(true);
  });

  it('should reset array values', function () {
    var result = (0, _resetState2.default)({
      foo: [(0, _fieldValue.makeFieldValue)({
        initial: 'cat',
        value: 'dog'
      }), (0, _fieldValue.makeFieldValue)({
        initial: 'rat',
        value: 'pig'
      }), (0, _fieldValue.makeFieldValue)({
        value: 'shouldbesettoundefined'
      })]
    });
    (0, _expect2.default)(result).toBeA('object').toEqual({
      foo: [{
        initial: 'cat',
        value: 'cat'
      }, {
        initial: 'rat',
        value: 'rat'
      }, {}]
    });
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.foo[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.foo[1])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.foo[2])).toBe(true);
  });

  it('should reset deep array values with key "value"', function () {
    var result = (0, _resetState2.default)({
      myValues: [{
        value: (0, _fieldValue.makeFieldValue)({
          initial: 'cat',
          value: 'rat'
        })
      }, {
        value: (0, _fieldValue.makeFieldValue)({
          initial: 'pig',
          value: 'hog'
        })
      }]
    });
    (0, _expect2.default)(result).toBeA('object').toEqual({
      myValues: [{
        value: {
          initial: 'cat',
          value: 'cat'
        }
      }, {
        value: {
          initial: 'pig',
          value: 'pig'
        }
      }]
    });
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.myValues[0].value)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(result.myValues[1].value)).toBe(true);
  });

  it('should allow an array to be empty', function () {
    var result = (0, _resetState2.default)({
      foo: []
    });
    (0, _expect2.default)(result).toBeA('object').toEqual({ foo: [] });
  });
});