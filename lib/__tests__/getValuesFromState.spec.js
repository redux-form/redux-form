'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _fieldValue = require('../fieldValue');

var _getValuesFromState = require('../getValuesFromState');

var _getValuesFromState2 = _interopRequireDefault(_getValuesFromState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('getValuesFromState', function () {
  it('should get simple values from state', function () {
    var state = {
      foo: (0, _fieldValue.makeFieldValue)({ value: 'bar' }),
      catLives: (0, _fieldValue.makeFieldValue)({ value: 9 }),
      alive: (0, _fieldValue.makeFieldValue)({ value: true }),
      value: (0, _fieldValue.makeFieldValue)({ value: 'value' })
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: 'bar',
      catLives: 9,
      alive: true,
      value: 'value'
    });
  });

  it('should understand undefined values that have only been touched', function () {
    var state = {
      foo: (0, _fieldValue.makeFieldValue)({ value: 'dog', touched: true }),
      bar: (0, _fieldValue.makeFieldValue)({ touched: true }),
      baz: (0, _fieldValue.makeFieldValue)({ touched: true })
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: 'dog'
    });
  });

  it('should get deep values from state', function () {
    var state = {
      foo: {
        bar: (0, _fieldValue.makeFieldValue)({ value: 'baz' })
      },
      lives: {
        cat: (0, _fieldValue.makeFieldValue)({ value: 9 })
      },
      alive: (0, _fieldValue.makeFieldValue)({ value: true })
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: {
        bar: 'baz'
      },
      lives: {
        cat: 9
      },
      alive: true
    });
  });

  it('should get date values from state', function () {
    var date1 = new Date();
    var date2 = new Date(date1.getTime() + 1);
    var state = {
      time1: (0, _fieldValue.makeFieldValue)({
        value: date1
      }),
      time2: (0, _fieldValue.makeFieldValue)({
        value: date2
      })
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      time1: date1,
      time2: date2
    });
  });

  it('should get undefined values from state', function () {
    var state = {
      foo: {
        value: undefined
      },
      bar: {
        value: undefined
      }
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({});
  });

  it('should get null values from state', function () {
    var state = {
      foo: (0, _fieldValue.makeFieldValue)({
        value: null
      }),
      bar: (0, _fieldValue.makeFieldValue)({
        value: null
      })
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: null,
      bar: null
    });
  });

  it('should get empty string values from state', function () {
    var state = {
      foo: (0, _fieldValue.makeFieldValue)({
        value: ''
      }),
      bar: (0, _fieldValue.makeFieldValue)({
        value: ''
      })
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: '',
      bar: ''
    });
  });

  it('should get array values from state', function () {
    var state = {
      foo: [(0, _fieldValue.makeFieldValue)({ value: 'bar' }), (0, _fieldValue.makeFieldValue)({ value: 'baz' }), {}],
      alive: (0, _fieldValue.makeFieldValue)({ value: true })
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: ['bar', 'baz', undefined],
      alive: true
    });
  });

  it('should allow an array to be empty', function () {
    var state = {
      foo: []
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({ foo: [] });
  });

  it('should get deep array values from state', function () {
    var state = {
      foo: {
        animals: [(0, _fieldValue.makeFieldValue)({ value: 'cat' }), (0, _fieldValue.makeFieldValue)({ value: 'dog' }), (0, _fieldValue.makeFieldValue)({ value: 'rat' })]
      },
      bar: [{
        deeper: (0, _fieldValue.makeFieldValue)({
          value: 42
        })
      }]
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: {
        animals: ['cat', 'dog', 'rat']
      },
      bar: [{ deeper: 42 }]
    });
  });

  it('should ignore empty values from state', function () {
    var state = {
      name: (0, _fieldValue.makeFieldValue)({})
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({});
  });

  it('should ignore values starting with _', function () {
    var state = {
      foo: (0, _fieldValue.makeFieldValue)({
        value: 'dog'
      }),
      bar: (0, _fieldValue.makeFieldValue)({
        value: 'cat'
      }),
      _someMetaValue: 'rat'
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: 'dog',
      bar: 'cat'
    });
  });

  it('should ignore visited fields without values', function () {
    var state = {
      foo: (0, _fieldValue.makeFieldValue)({
        value: 'dog'
      }),
      bar: (0, _fieldValue.makeFieldValue)({
        visited: true
      })
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: 'dog'
    });
  });

  it('should get deep array of objects from state', function () {
    var state = {
      foo: {
        animals: [{ key: (0, _fieldValue.makeFieldValue)({ value: 'k1' }), value: (0, _fieldValue.makeFieldValue)({ value: 'v1' }) }, { key: (0, _fieldValue.makeFieldValue)({ value: 'k2' }), value: (0, _fieldValue.makeFieldValue)({ value: 'v2' }) }]
      }
    };
    (0, _expect2.default)((0, _getValuesFromState2.default)(state)).toBeA('object').toEqual({
      foo: {
        animals: [{ key: 'k1', value: 'v1' }, { key: 'k2', value: 'v2' }]
      }
    });
  });
});