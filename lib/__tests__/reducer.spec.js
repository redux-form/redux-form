'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _redux = require('redux');

var _reducer = require('../reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _bindActionData = require('../bindActionData');

var _bindActionData2 = _interopRequireDefault(_bindActionData);

var _actions = require('../actions');

var _fieldValue = require('../fieldValue');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compare = function compare(a, b) {
  if (a.value > b.value) {
    return 1;
  }
  if (a.value < b.value) {
    return -1;
  }
  return 0;
};

describe('reducer', function () {
  it('should initialize state to {}', function () {
    var state = (0, _reducer2.default)();
    (0, _expect2.default)(state).toExist().toBeA('object');
    (0, _expect2.default)(Object.keys(state).length).toBe(0);
  });

  it('should not modify state when action has no form', function () {
    var state = { foo: 'bar' };
    (0, _expect2.default)((0, _reducer2.default)(state, { type: 'SOMETHING_ELSE' })).toBe(state);
  });

  it('should initialize form state when action has form', function () {
    var _expect$toExist$toBeA;

    var state = (0, _reducer2.default)(undefined, { form: 'foo' });
    (0, _expect2.default)(state).toExist().toBeA('object');
    (0, _expect2.default)(Object.keys(state).length).toBe(1);
    (0, _expect2.default)(state.foo).toExist().toBeA('object').toEqual((_expect$toExist$toBeA = {
      _active: undefined,
      _asyncValidating: false
    }, _expect$toExist$toBeA[_reducer.globalErrorKey] = undefined, _expect$toExist$toBeA._initialized = false, _expect$toExist$toBeA._submitting = false, _expect$toExist$toBeA._submitFailed = false, _expect$toExist$toBeA));
  });

  it('should add an empty array value with empty state', function () {
    var _expect$toEqual;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.addArrayValue)('myField'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual = {
      myField: [{
        value: undefined
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual[_reducer.globalErrorKey] = undefined, _expect$toEqual._initialized = false, _expect$toEqual._submitting = false, _expect$toEqual._submitFailed = false, _expect$toEqual));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField[0])).toBe(true);
  });

  it('should add an empty deep array value with empty state', function () {
    var _expect$toEqual2;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.addArrayValue)('myField.myArray'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual2 = {
      myField: {
        myArray: [{
          value: undefined
        }]
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual2[_reducer.globalErrorKey] = undefined, _expect$toEqual2._initialized = false, _expect$toEqual2._submitting = false, _expect$toEqual2._submitFailed = false, _expect$toEqual2));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField.myArray)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField.myArray[0])).toBe(true);
  });

  it('should add a deep array value with initial value', function () {
    var _expect$toEqual3;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.addArrayValue)('myField.myArray', 20, undefined), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual3 = {
      myField: {
        myArray: [{
          value: 20
        }]
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual3[_reducer.globalErrorKey] = undefined, _expect$toEqual3._initialized = false, _expect$toEqual3._submitting = false, _expect$toEqual3._submitFailed = false, _expect$toEqual3));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField.myArray)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField.myArray[0])).toBe(true);
  });

  it('should push an array value', function () {
    var _testForm, _expect$toEqual4;

    var state = (0, _reducer2.default)({
      testForm: (_testForm = {
        myField: [(0, _fieldValue.makeFieldValue)({
          value: 'foo'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'bar'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _testForm[_reducer.globalErrorKey] = undefined, _testForm._initialized = false, _testForm._submitting = false, _testForm._submitFailed = false, _testForm)
    }, _extends({}, (0, _actions.addArrayValue)('myField', 'baz'), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual4 = {
      myField: [{
        value: 'foo'
      }, {
        value: 'bar'
      }, {
        value: 'baz'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual4[_reducer.globalErrorKey] = undefined, _expect$toEqual4._initialized = false, _expect$toEqual4._submitting = false, _expect$toEqual4._submitFailed = false, _expect$toEqual4));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[2])).toBe(true);
  });

  it('should insert an array value', function () {
    var _testForm2, _expect$toEqual5;

    var state = (0, _reducer2.default)({
      testForm: (_testForm2 = {
        myField: [(0, _fieldValue.makeFieldValue)({
          value: 'foo'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'bar'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _testForm2[_reducer.globalErrorKey] = undefined, _testForm2._initialized = false, _testForm2._submitting = false, _testForm2._submitFailed = false, _testForm2)
    }, _extends({}, (0, _actions.addArrayValue)('myField', 'baz', 1), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual5 = {
      myField: [{
        value: 'foo'
      }, {
        value: 'baz'
      }, {
        value: 'bar'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual5[_reducer.globalErrorKey] = undefined, _expect$toEqual5._initialized = false, _expect$toEqual5._submitting = false, _expect$toEqual5._submitFailed = false, _expect$toEqual5));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[2])).toBe(true);
  });

  // TODO: Find a way to make this pass:
  /*
   it('should push an array value which is a deep object', () => {
   const state = reducer({
   testForm: {
   friends: [
   {
   name: {
   initial: 'name-1',
   value: 'name-1'
   },
   address: {
   street: {
   initial: 'street-1',
   value: 'street-1'
   },
   postalCode: {
   initial: 'postalCode-1',
   value: 'postalCode-1'
   }
   }
   },
   {
   name: {
   initial: 'name-2',
   value: 'name-2'
   },
   address: {
   street: {
   initial: 'street-2',
   value: 'street-2'
   },
   postalCode: {
   initial: 'postalCode-2',
   value: 'postalCode-2'
   }
   }
   }
   ],
   _active: undefined,
   _asyncValidating: false,
   _error: undefined,
   _initialized: false,
   _submitting: false,
   _submitFailed: false
   }
   }, {
   ...addArrayValue('friends', {
   name: 'name-3',
   address: {
   street: 'street-3',
   postalCode: 'postalCode-3'
   }
   }, undefined),
   form: 'testForm'
   });
   expect(state.testForm)
   .toEqual({
   friends: [
   {
   name: {
   initial: 'name-1',
   value: 'name-1'
   },
   address: {
   street: {
   initial: 'street-1',
   value: 'street-1'
   },
   postalCode: {
   initial: 'postalCode-1',
   value: 'postalCode-1'
   }
   }
   },
   {
   name: {
   initial: 'name-2',
   value: 'name-2'
   },
   address: {
   street: {
   initial: 'street-2',
   value: 'street-2'
   },
   postalCode: {
   initial: 'postalCode-2',
   value: 'postalCode-2'
   }
   }
   },
   {
   name: {
   initial: 'name-3',
   value: 'name-3'
   },
   address: {
   street: {
   initial: 'street-3',
   value: 'street-3'
   },
   postalCode: {
   initial: 'postalCode-3',
   value: 'postalCode-3'
   }
   }
   }
   ],
   _active: undefined,
   _asyncValidating: false,
   _error: undefined,
   _initialized: false,
   _submitting: false,
   _submitFailed: false
   });
   });
   */

  it('should push a deep array value which is a nested object', function () {
    var state = (0, _reducer2.default)({
      testForm: {
        myField: [{
          foo: (0, _fieldValue.makeFieldValue)({
            initial: { a: 'foo-a1', b: 'foo-b1' },
            value: { a: 'foo-a1', b: 'foo-b1' }
          }),
          bar: (0, _fieldValue.makeFieldValue)({
            initial: { a: 'bar-a1', b: 'bar-b1' },
            value: { a: 'bar-a1', b: 'bar-b1' }
          })
        }, {
          foo: (0, _fieldValue.makeFieldValue)({
            initial: { a: 'foo-a2', b: 'foo-b2' },
            value: { a: 'foo-a2', b: 'foo-b2' }
          }),
          bar: (0, _fieldValue.makeFieldValue)({
            initial: { a: 'bar-a2', b: 'bar-b2' },
            value: { a: 'bar-a2', b: 'bar-b2' }
          })
        }],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, _extends({}, (0, _actions.addArrayValue)('myField', {
      foo: { a: 'foo-a3', b: 'foo-b3' },
      bar: { a: 'bar-a3', b: 'bar-b3' }
    }, undefined), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual({
      myField: [{
        foo: {
          initial: { a: 'foo-a1', b: 'foo-b1' },
          value: { a: 'foo-a1', b: 'foo-b1' }
        },
        bar: {
          initial: { a: 'bar-a1', b: 'bar-b1' },
          value: { a: 'bar-a1', b: 'bar-b1' }
        }
      }, {
        foo: {
          initial: { a: 'foo-a2', b: 'foo-b2' },
          value: { a: 'foo-a2', b: 'foo-b2' }
        },
        bar: {
          initial: { a: 'bar-a2', b: 'bar-b2' },
          value: { a: 'bar-a2', b: 'bar-b2' }
        }
      }, {
        foo: {
          initial: { a: 'foo-a3', b: 'foo-b3' },
          value: { a: 'foo-a3', b: 'foo-b3' }
        },
        bar: {
          initial: { a: 'bar-a3', b: 'bar-b3' },
          value: { a: 'bar-a3', b: 'bar-b3' }
        }
      }],
      _active: undefined,
      _asyncValidating: false,
      _error: undefined,
      _initialized: false,
      _submitting: false,
      _submitFailed: false
    });
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0].foo)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0].bar)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].foo)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].bar)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[2])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[2].foo)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[2].bar)).toBe(true);
  });

  it('should push a subarray value which is an object', function () {
    var state = (0, _reducer2.default)({
      testForm: {
        myField: [{
          myField2: [{
            foo: (0, _fieldValue.makeFieldValue)({
              initial: 'foo-1-1',
              value: 'foo-1-1'
            }),
            bar: (0, _fieldValue.makeFieldValue)({
              initial: 'bar-1-1',
              value: 'bar-1-1'
            })
          }, {
            foo: (0, _fieldValue.makeFieldValue)({
              initial: 'foo-1-2',
              value: 'foo-1-2'
            }),
            bar: (0, _fieldValue.makeFieldValue)({
              initial: 'bar-1-2',
              value: 'bar-1-2'
            })
          }]
        }, {
          myField2: [{
            foo: (0, _fieldValue.makeFieldValue)({
              initial: 'foo-2-1',
              value: 'foo-2-1'
            }),
            bar: (0, _fieldValue.makeFieldValue)({
              initial: 'bar-2-1',
              value: 'bar-2-1'
            })
          }, {
            foo: (0, _fieldValue.makeFieldValue)({
              initial: 'foo-2-2',
              value: 'foo-2-2'
            }),
            bar: (0, _fieldValue.makeFieldValue)({
              initial: 'bar-2-2',
              value: 'bar-2-2'
            })
          }]
        }],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, _extends({}, (0, _actions.addArrayValue)('myField[1].myField2', { foo: 'foo-2-3', bar: 'bar-2-3' }, undefined), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual({
      myField: [{
        myField2: [{
          foo: {
            initial: 'foo-1-1',
            value: 'foo-1-1'
          },
          bar: {
            initial: 'bar-1-1',
            value: 'bar-1-1'
          }
        }, {
          foo: {
            initial: 'foo-1-2',
            value: 'foo-1-2'
          },
          bar: {
            initial: 'bar-1-2',
            value: 'bar-1-2'
          }
        }]
      }, {
        myField2: [{
          foo: {
            initial: 'foo-2-1',
            value: 'foo-2-1'
          },
          bar: {
            initial: 'bar-2-1',
            value: 'bar-2-1'
          }
        }, {
          foo: {
            initial: 'foo-2-2',
            value: 'foo-2-2'
          },
          bar: {
            initial: 'bar-2-2',
            value: 'bar-2-2'
          }
        }, {
          foo: {
            initial: 'foo-2-3',
            value: 'foo-2-3'
          },
          bar: {
            initial: 'bar-2-3',
            value: 'bar-2-3'
          }
        }]
      }],
      _active: undefined,
      _asyncValidating: false,
      _error: undefined,
      _initialized: false,
      _submitting: false,
      _submitFailed: false
    });
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0].myField2)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0].myField2[0])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0].myField2[0].foo)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0].myField2[0].bar)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0].myField2[1])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0].myField2[1].foo)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0].myField2[1].bar)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2[0])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2[0].foo)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2[0].bar)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2[1])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2[1].foo)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2[1].bar)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2[2])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2[2].foo)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1].myField2[2].bar)).toBe(true);
  });

  it('should set value on autofill with empty state', function () {
    var _expect$toEqual6;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.autofill)('myField', 'myValue'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual6 = {
      myField: {
        value: 'myValue',
        autofilled: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual6[_reducer.globalErrorKey] = undefined, _expect$toEqual6._initialized = false, _expect$toEqual6._submitting = false, _expect$toEqual6._submitFailed = false, _expect$toEqual6));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set value on autofill with initial value', function () {
    var _foo, _expect$toEqual7;

    var state = (0, _reducer2.default)({
      foo: (_foo = {
        myField: (0, _fieldValue.makeFieldValue)({
          value: 'initial'
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _foo[_reducer.globalErrorKey] = 'Some global error', _foo._initialized = false, _foo._submitting = false, _foo._submitFailed = false, _foo)
    }, _extends({}, (0, _actions.autofill)('myField', 'different'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual7 = {
      myField: {
        value: 'different',
        autofilled: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _expect$toEqual7[_reducer.globalErrorKey] = 'Some global error', _expect$toEqual7._initialized = false, _expect$toEqual7._submitting = false, _expect$toEqual7._submitFailed = false, _expect$toEqual7));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set value on blur with empty state', function () {
    var _expect$toEqual8;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.blur)('myField', 'myValue'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual8 = {
      myField: {
        value: 'myValue'
      },
      _asyncValidating: false
    }, _expect$toEqual8[_reducer.globalErrorKey] = undefined, _expect$toEqual8._initialized = false, _expect$toEqual8._submitting = false, _expect$toEqual8._submitFailed = false, _expect$toEqual8));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set value on blur and touch with empty state', function () {
    var _expect$toEqual9;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.blur)('myField', 'myValue'), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual9 = {
      myField: {
        value: 'myValue',
        touched: true
      },
      _asyncValidating: false
    }, _expect$toEqual9[_reducer.globalErrorKey] = undefined, _expect$toEqual9._initialized = false, _expect$toEqual9._submitting = false, _expect$toEqual9._submitFailed = false, _expect$toEqual9));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set value on blur and touch with initial value', function () {
    var _foo2, _expect$toEqual10;

    var state = (0, _reducer2.default)({
      foo: (_foo2 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'initialValue',
          touched: false
        }),
        _asyncValidating: false
      }, _foo2[_reducer.globalErrorKey] = undefined, _foo2._initialized = false, _foo2._submitting = false, _foo2._submitFailed = false, _foo2)
    }, _extends({}, (0, _actions.blur)('myField', 'myValue'), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual10 = {
      myField: {
        initial: 'initialValue',
        value: 'myValue',
        touched: true
      },
      _asyncValidating: false
    }, _expect$toEqual10[_reducer.globalErrorKey] = undefined, _expect$toEqual10._initialized = false, _expect$toEqual10._submitting = false, _expect$toEqual10._submitFailed = false, _expect$toEqual10));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should not modify value if undefined is passed on blur (for android react native)', function () {
    var _foo3, _expect$toEqual11;

    var state = (0, _reducer2.default)({
      foo: (_foo3 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'myValue',
          touched: false
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _foo3[_reducer.globalErrorKey] = undefined, _foo3._initialized = false, _foo3._submitting = false, _foo3._submitFailed = false, _foo3)
    }, _extends({}, (0, _actions.blur)('myField'), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual11 = {
      myField: {
        initial: 'initialValue',
        value: 'myValue',
        touched: true
      },
      _asyncValidating: false
    }, _expect$toEqual11[_reducer.globalErrorKey] = undefined, _expect$toEqual11._initialized = false, _expect$toEqual11._submitting = false, _expect$toEqual11._submitFailed = false, _expect$toEqual11));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should not modify value if undefined is passed on blur, even if no value existed (for android react native)', function () {
    var _foo4, _expect$toEqual12;

    var state = (0, _reducer2.default)({
      foo: (_foo4 = {
        myField: (0, _fieldValue.makeFieldValue)({
          value: undefined
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _foo4[_reducer.globalErrorKey] = undefined, _foo4._initialized = false, _foo4._submitting = false, _foo4._submitFailed = false, _foo4)
    }, _extends({}, (0, _actions.blur)('myField'), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual12 = {
      myField: {
        value: undefined,
        touched: true
      },
      _asyncValidating: false
    }, _expect$toEqual12[_reducer.globalErrorKey] = undefined, _expect$toEqual12._initialized = false, _expect$toEqual12._submitting = false, _expect$toEqual12._submitFailed = false, _expect$toEqual12));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set nested value on blur', function () {
    var _foo5, _expect$toEqual13;

    var state = (0, _reducer2.default)({
      foo: (_foo5 = {
        myField: {
          mySubField: (0, _fieldValue.makeFieldValue)({
            value: undefined
          })
        },
        _active: 'myField.mySubField',
        _asyncValidating: false
      }, _foo5[_reducer.globalErrorKey] = undefined, _foo5._initialized = false, _foo5._submitting = false, _foo5._submitFailed = false, _foo5)
    }, _extends({}, (0, _actions.blur)('myField.mySubField', 'hello'), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual13 = {
      myField: {
        mySubField: {
          value: 'hello',
          touched: true
        }
      },
      _asyncValidating: false
    }, _expect$toEqual13[_reducer.globalErrorKey] = undefined, _expect$toEqual13._initialized = false, _expect$toEqual13._submitting = false, _expect$toEqual13._submitFailed = false, _expect$toEqual13));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField.mySubField)).toBe(true);
  });

  it('should set array value on blur', function () {
    var _foo6, _expect$toEqual14;

    var state = (0, _reducer2.default)({
      foo: (_foo6 = {
        myArray: [(0, _fieldValue.makeFieldValue)({ value: undefined })],
        _active: 'myArray[0]',
        _asyncValidating: false
      }, _foo6[_reducer.globalErrorKey] = undefined, _foo6._initialized = false, _foo6._submitting = false, _foo6._submitFailed = false, _foo6)
    }, _extends({}, (0, _actions.blur)('myArray[0]', 'hello'), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual14 = {
      myArray: [{
        value: 'hello',
        touched: true
      }],
      _asyncValidating: false
    }, _expect$toEqual14[_reducer.globalErrorKey] = undefined, _expect$toEqual14._initialized = false, _expect$toEqual14._submitting = false, _expect$toEqual14._submitFailed = false, _expect$toEqual14));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myArray[0])).toBe(true);
  });

  it('should set value on change with empty state', function () {
    var _expect$toEqual15;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.change)('myField', 'myValue'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual15 = {
      myField: {
        value: 'myValue'
      },
      _active: undefined, // CHANGE doesn't touch _active
      _asyncValidating: false
    }, _expect$toEqual15[_reducer.globalErrorKey] = undefined, _expect$toEqual15._initialized = false, _expect$toEqual15._submitting = false, _expect$toEqual15._submitFailed = false, _expect$toEqual15));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set value on change and touch with empty state', function () {
    var _expect$toEqual16;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.change)('myField', 'myValue'), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual16 = {
      myField: {
        value: 'myValue',
        touched: true
      },
      _active: undefined, // CHANGE doesn't touch _active
      _asyncValidating: false
    }, _expect$toEqual16[_reducer.globalErrorKey] = undefined, _expect$toEqual16._initialized = false, _expect$toEqual16._submitting = false, _expect$toEqual16._submitFailed = false, _expect$toEqual16));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set value on change and touch with initial value', function () {
    var _foo7, _expect$toEqual17;

    var state = (0, _reducer2.default)({
      foo: (_foo7 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'initialValue',
          touched: false
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _foo7[_reducer.globalErrorKey] = 'Some global error', _foo7._initialized = false, _foo7._submitting = false, _foo7._submitFailed = false, _foo7)
    }, _extends({}, (0, _actions.change)('myField', 'myValue'), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual17 = {
      myField: {
        initial: 'initialValue',
        value: 'myValue',
        touched: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _expect$toEqual17[_reducer.globalErrorKey] = 'Some global error', _expect$toEqual17._initialized = false, _expect$toEqual17._submitting = false, _expect$toEqual17._submitFailed = false, _expect$toEqual17));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set value on change and remove field-level submit and async errors', function () {
    var _foo8, _expect$toEqual18;

    var state = (0, _reducer2.default)({
      foo: (_foo8 = {
        myField: (0, _fieldValue.makeFieldValue)({
          value: 'initial',
          submitError: 'submit error',
          asyncError: 'async error'
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _foo8[_reducer.globalErrorKey] = 'Some global error', _foo8._initialized = false, _foo8._submitting = false, _foo8._submitFailed = false, _foo8)
    }, _extends({}, (0, _actions.change)('myField', 'different'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual18 = {
      myField: {
        value: 'different'
      },
      _active: 'myField',
      _asyncValidating: false
    }, _expect$toEqual18[_reducer.globalErrorKey] = 'Some global error', _expect$toEqual18._initialized = false, _expect$toEqual18._submitting = false, _expect$toEqual18._submitFailed = false, _expect$toEqual18));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set value on change and remove autofilled', function () {
    var _foo9, _expect$toEqual19;

    var state = (0, _reducer2.default)({
      foo: (_foo9 = {
        myField: (0, _fieldValue.makeFieldValue)({
          value: 'initial',
          autofilled: true
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _foo9[_reducer.globalErrorKey] = 'Some global error', _foo9._initialized = false, _foo9._submitting = false, _foo9._submitFailed = false, _foo9)
    }, _extends({}, (0, _actions.change)('myField', 'different'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual19 = {
      myField: {
        value: 'different'
      },
      _active: 'myField',
      _asyncValidating: false
    }, _expect$toEqual19[_reducer.globalErrorKey] = 'Some global error', _expect$toEqual19._initialized = false, _expect$toEqual19._submitting = false, _expect$toEqual19._submitFailed = false, _expect$toEqual19));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set nested value on change with empty state', function () {
    var _expect$toEqual20;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.change)('myField.mySubField', 'myValue'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual20 = {
      myField: {
        mySubField: {
          value: 'myValue'
        }
      },
      _active: undefined, // CHANGE doesn't touch _active
      _asyncValidating: false
    }, _expect$toEqual20[_reducer.globalErrorKey] = undefined, _expect$toEqual20._initialized = false, _expect$toEqual20._submitting = false, _expect$toEqual20._submitFailed = false, _expect$toEqual20));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField.mySubField)).toBe(true);
  });

  it('should set visited on focus and update active with no previous state', function () {
    var _expect$toEqual21;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.focus)('myField'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual21 = {
      myField: {
        visited: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _expect$toEqual21[_reducer.globalErrorKey] = undefined, _expect$toEqual21._initialized = false, _expect$toEqual21._submitting = false, _expect$toEqual21._submitFailed = false, _expect$toEqual21));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set visited on focus and update active on deep field with no previous state', function () {
    var _expect$toEqual22;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.focus)('myField.subField'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual22 = {
      myField: {
        subField: {
          visited: true
        }
      },
      _active: 'myField.subField',
      _asyncValidating: false
    }, _expect$toEqual22[_reducer.globalErrorKey] = undefined, _expect$toEqual22._initialized = false, _expect$toEqual22._submitting = false, _expect$toEqual22._submitFailed = false, _expect$toEqual22));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField.subField)).toBe(true);
  });

  it('should set visited on focus and update current with previous state', function () {
    var _foo10, _expect$toEqual23;

    var state = (0, _reducer2.default)({
      foo: (_foo10 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'initialValue',
          visited: false
        }),
        _active: 'otherField',
        _asyncValidating: false
      }, _foo10[_reducer.globalErrorKey] = undefined, _foo10._initialized = false, _foo10._submitting = false, _foo10._submitFailed = false, _foo10)
    }, _extends({}, (0, _actions.focus)('myField'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual23 = {
      myField: {
        initial: 'initialValue',
        value: 'initialValue',
        visited: true
      },
      _active: 'myField',
      _asyncValidating: false
    }, _expect$toEqual23[_reducer.globalErrorKey] = undefined, _expect$toEqual23._initialized = false, _expect$toEqual23._submitting = false, _expect$toEqual23._submitFailed = false, _expect$toEqual23));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set initialize values on initialize on empty state', function () {
    var _expect$toEqual24;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.initialize)({ myField: 'initialValue' }, ['myField']), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual24 = {
      myField: {
        initial: 'initialValue',
        value: 'initialValue'
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual24[_reducer.globalErrorKey] = undefined, _expect$toEqual24._initialized = true, _expect$toEqual24._submitting = false, _expect$toEqual24._submitFailed = false, _expect$toEqual24));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should allow initializing null values', function () {
    var _expect$toEqual25;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.initialize)({ bar: 'baz', dog: null }, ['bar', 'dog']), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual25 = {
      bar: {
        initial: 'baz',
        value: 'baz'
      },
      dog: {
        initial: null,
        value: null
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual25[_reducer.globalErrorKey] = undefined, _expect$toEqual25._initialized = true, _expect$toEqual25._submitting = false, _expect$toEqual25._submitFailed = false, _expect$toEqual25));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.dog)).toBe(true);
  });

  it('should initialize nested values on initialize on empty state', function () {
    var _expect$toEqual26;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.initialize)({ myField: { subField: 'initialValue' } }, ['myField.subField'], {}), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual26 = {
      myField: {
        subField: {
          initial: 'initialValue',
          value: 'initialValue'
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual26[_reducer.globalErrorKey] = undefined, _expect$toEqual26._initialized = true, _expect$toEqual26._submitting = false, _expect$toEqual26._submitFailed = false, _expect$toEqual26));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField.subField)).toBe(true);
  });

  it('should initialize array values on initialize on empty state', function () {
    var _expect$toEqual27;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.initialize)({ myField: ['initialValue'] }, ['myField[]'], {}), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual27 = {
      myField: [{
        initial: 'initialValue',
        value: 'initialValue'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual27[_reducer.globalErrorKey] = undefined, _expect$toEqual27._initialized = true, _expect$toEqual27._submitting = false, _expect$toEqual27._submitFailed = false, _expect$toEqual27));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField[0])).toBe(true);
  });

  it('should initialize array values with subvalues on initialize on empty state', function () {
    var _expect$toEqual28;

    var state = (0, _reducer2.default)({}, _extends({}, (0, _actions.initialize)({
      accounts: [{
        name: 'Bobby Tables',
        email: 'bobby@gmail.com'
      }, {
        name: 'Sammy Tables',
        email: 'sammy@gmail.com'
      }]
    }, ['accounts[].name', 'accounts[].email'], {}), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual28 = {
      accounts: [{
        name: {
          initial: 'Bobby Tables',
          value: 'Bobby Tables'
        },
        email: {
          initial: 'bobby@gmail.com',
          value: 'bobby@gmail.com'
        }
      }, {
        name: {
          initial: 'Sammy Tables',
          value: 'Sammy Tables'
        },
        email: {
          initial: 'sammy@gmail.com',
          value: 'sammy@gmail.com'
        }
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual28[_reducer.globalErrorKey] = undefined, _expect$toEqual28._initialized = true, _expect$toEqual28._submitting = false, _expect$toEqual28._submitFailed = false, _expect$toEqual28));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.accounts)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.accounts[0])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.accounts[0].name)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.accounts[0].email)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.accounts[1])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.accounts[1].name)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.accounts[1].email)).toBe(true);
  });

  it('should set initialize values, making form pristine when initializing', function () {
    var _foo11, _expect$toEqual29;

    var state = (0, _reducer2.default)({
      foo: (_foo11 = {
        myField: (0, _fieldValue.makeFieldValue)({
          value: 'dirtyValue',
          touched: true
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _foo11[_reducer.globalErrorKey] = undefined, _foo11._initialized = false, _foo11._submitting = false, _foo11._submitFailed = false, _foo11)
    }, _extends({}, (0, _actions.initialize)({ myField: 'cleanValue' }, ['myField']), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual29 = {
      myField: {
        initial: 'cleanValue',
        value: 'cleanValue'
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual29[_reducer.globalErrorKey] = undefined, _expect$toEqual29._initialized = true, _expect$toEqual29._submitting = false, _expect$toEqual29._submitFailed = false, _expect$toEqual29));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set initialize values, not overwriting values when overwriteValues is false', function () {
    var _foo12, _expect$toEqual30;

    var state = (0, _reducer2.default)({
      foo: (_foo12 = {
        myField: (0, _fieldValue.makeFieldValue)({
          value: 'dirtyValue',
          touched: true
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _foo12[_reducer.globalErrorKey] = undefined, _foo12._initialized = false, _foo12._submitting = false, _foo12._submitFailed = false, _foo12)
    }, _extends({}, (0, _actions.initialize)({ myField: 'cleanValue' }, ['myField'], false), {
      form: 'foo',
      touch: true
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual30 = {
      myField: {
        initial: 'cleanValue',
        value: 'dirtyValue'
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual30[_reducer.globalErrorKey] = undefined, _expect$toEqual30._initialized = true, _expect$toEqual30._submitting = false, _expect$toEqual30._submitFailed = false, _expect$toEqual30));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should pop an array value', function () {
    var _testForm3, _expect$toEqual31;

    var state = (0, _reducer2.default)({
      testForm: (_testForm3 = {
        myField: [(0, _fieldValue.makeFieldValue)({
          value: 'foo'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'bar'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _testForm3[_reducer.globalErrorKey] = undefined, _testForm3._initialized = false, _testForm3._submitting = false, _testForm3._submitFailed = false, _testForm3)
    }, _extends({}, (0, _actions.removeArrayValue)('myField'), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual31 = {
      myField: [{
        value: 'foo'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual31[_reducer.globalErrorKey] = undefined, _expect$toEqual31._initialized = false, _expect$toEqual31._submitting = false, _expect$toEqual31._submitFailed = false, _expect$toEqual31));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(true);
  });

  it('should not change empty array value on remove', function () {
    var _testForm4, _expect$toEqual32;

    var state = (0, _reducer2.default)({
      testForm: (_testForm4 = {
        myField: [],
        _active: undefined,
        _asyncValidating: false
      }, _testForm4[_reducer.globalErrorKey] = undefined, _testForm4._initialized = false, _testForm4._submitting = false, _testForm4._submitFailed = false, _testForm4)
    }, _extends({}, (0, _actions.removeArrayValue)('myField'), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual32 = {
      myField: [],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual32[_reducer.globalErrorKey] = undefined, _expect$toEqual32._initialized = false, _expect$toEqual32._submitting = false, _expect$toEqual32._submitFailed = false, _expect$toEqual32));
  });

  it('should remove an array value from start of array', function () {
    var _testForm5, _expect$toEqual33;

    var state = (0, _reducer2.default)({
      testForm: (_testForm5 = {
        myField: [(0, _fieldValue.makeFieldValue)({
          value: 'foo'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'bar'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _testForm5[_reducer.globalErrorKey] = undefined, _testForm5._initialized = false, _testForm5._submitting = false, _testForm5._submitFailed = false, _testForm5)
    }, _extends({}, (0, _actions.removeArrayValue)('myField', 0), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual33 = {
      myField: [{
        value: 'bar'
      }, {
        value: 'baz'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual33[_reducer.globalErrorKey] = undefined, _expect$toEqual33._initialized = false, _expect$toEqual33._submitting = false, _expect$toEqual33._submitFailed = false, _expect$toEqual33));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1])).toBe(true);
  });

  it('should remove an array value from middle of array', function () {
    var _testForm6, _expect$toEqual34;

    var state = (0, _reducer2.default)({
      testForm: (_testForm6 = {
        myField: [(0, _fieldValue.makeFieldValue)({
          value: 'foo'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'bar'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _testForm6[_reducer.globalErrorKey] = undefined, _testForm6._initialized = false, _testForm6._submitting = false, _testForm6._submitFailed = false, _testForm6)
    }, _extends({}, (0, _actions.removeArrayValue)('myField', 1), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual34 = {
      myField: [{
        value: 'foo'
      }, {
        value: 'baz'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual34[_reducer.globalErrorKey] = undefined, _expect$toEqual34._initialized = false, _expect$toEqual34._submitting = false, _expect$toEqual34._submitFailed = false, _expect$toEqual34));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1])).toBe(true);
  });

  it('should not change empty array value on swap', function () {
    var _testForm7, _expect$toEqual35;

    var state = (0, _reducer2.default)({
      testForm: (_testForm7 = {
        myField: [],
        _active: undefined,
        _asyncValidating: false
      }, _testForm7[_reducer.globalErrorKey] = undefined, _testForm7._initialized = false, _testForm7._submitting = false, _testForm7._submitFailed = false, _testForm7)
    }, _extends({}, (0, _actions.swapArrayValues)('myField'), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual35 = {
      myField: [],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual35[_reducer.globalErrorKey] = undefined, _expect$toEqual35._initialized = false, _expect$toEqual35._submitting = false, _expect$toEqual35._submitFailed = false, _expect$toEqual35));
  });

  it('should should swap two array values at different indexes', function () {
    var _testForm8, _expect$toEqual36;

    var state = (0, _reducer2.default)({
      testForm: (_testForm8 = {
        myField: [(0, _fieldValue.makeFieldValue)({
          value: 'foo'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'bar'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _testForm8[_reducer.globalErrorKey] = undefined, _testForm8._initialized = false, _testForm8._submitting = false, _testForm8._submitFailed = false, _testForm8)
    }, _extends({}, (0, _actions.swapArrayValues)('myField', 0, 2), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual36 = {
      myField: [{
        value: 'baz'
      }, {
        value: 'bar'
      }, {
        value: 'foo'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual36[_reducer.globalErrorKey] = undefined, _expect$toEqual36._initialized = false, _expect$toEqual36._submitting = false, _expect$toEqual36._submitFailed = false, _expect$toEqual36));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[2])).toBe(true);
  });

  it('should not change array on swap with the same index', function () {
    var _testForm9, _expect$toEqual37;

    var state = (0, _reducer2.default)({
      testForm: (_testForm9 = {
        myField: [(0, _fieldValue.makeFieldValue)({
          value: 'foo'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'bar'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _testForm9[_reducer.globalErrorKey] = undefined, _testForm9._initialized = false, _testForm9._submitting = false, _testForm9._submitFailed = false, _testForm9)
    }, _extends({}, (0, _actions.swapArrayValues)('myField', 1, 1), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual37 = {
      myField: [{
        value: 'foo'
      }, {
        value: 'bar'
      }, {
        value: 'baz'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual37[_reducer.globalErrorKey] = undefined, _expect$toEqual37._initialized = false, _expect$toEqual37._submitting = false, _expect$toEqual37._submitFailed = false, _expect$toEqual37));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[2])).toBe(true);
  });

  it('should not change array on swap with out of bounds index', function () {
    var _testForm10, _expect$toEqual38;

    var state = (0, _reducer2.default)({
      testForm: (_testForm10 = {
        myField: [(0, _fieldValue.makeFieldValue)({
          value: 'foo'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'bar'
        }), (0, _fieldValue.makeFieldValue)({
          value: 'baz'
        })],
        _active: undefined,
        _asyncValidating: false
      }, _testForm10[_reducer.globalErrorKey] = undefined, _testForm10._initialized = false, _testForm10._submitting = false, _testForm10._submitFailed = false, _testForm10)
    }, _extends({}, (0, _actions.swapArrayValues)('myField', 1, 4), {
      form: 'testForm'
    }));
    (0, _expect2.default)(state.testForm).toEqual((_expect$toEqual38 = {
      myField: [{
        value: 'foo'
      }, {
        value: 'bar'
      }, {
        value: 'baz'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual38[_reducer.globalErrorKey] = undefined, _expect$toEqual38._initialized = false, _expect$toEqual38._submitting = false, _expect$toEqual38._submitFailed = false, _expect$toEqual38));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[1])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.testForm.myField[2])).toBe(true);
  });

  it('should reset values on reset on with previous state', function () {
    var _foo13, _expect$toEqual39;

    var state = (0, _reducer2.default)({
      foo: (_foo13 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: (0, _fieldValue.makeFieldValue)({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: 'myField',
        _asyncValidating: false
      }, _foo13[_reducer.globalErrorKey] = undefined, _foo13._initialized = false, _foo13._submitting = false, _foo13._submitFailed = false, _foo13)
    }, _extends({}, (0, _actions.reset)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual39 = {
      myField: {
        initial: 'initialValue',
        value: 'initialValue'
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherInitialValue'
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual39[_reducer.globalErrorKey] = undefined, _expect$toEqual39._initialized = false, _expect$toEqual39._submitting = false, _expect$toEqual39._submitFailed = false, _expect$toEqual39));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myOtherField)).toBe(true);
  });

  it('should reset deep values on reset on with previous state', function () {
    var _foo14, _expect$toEqual40;

    var state = (0, _reducer2.default)({
      foo: (_foo14 = {
        deepField: {
          myField: (0, _fieldValue.makeFieldValue)({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          myOtherField: (0, _fieldValue.makeFieldValue)({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        },
        _active: 'myField',
        _asyncValidating: false
      }, _foo14[_reducer.globalErrorKey] = undefined, _foo14._initialized = false, _foo14._submitting = false, _foo14._submitFailed = false, _foo14)
    }, _extends({}, (0, _actions.reset)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual40 = {
      deepField: {
        myField: {
          initial: 'initialValue',
          value: 'initialValue'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherInitialValue'
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual40[_reducer.globalErrorKey] = undefined, _expect$toEqual40._initialized = false, _expect$toEqual40._submitting = false, _expect$toEqual40._submitFailed = false, _expect$toEqual40));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.deepField)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.deepField.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.deepField.myOtherField)).toBe(true);
  });

  it('should set asyncValidating on startAsyncValidation', function () {
    var _foo15, _expect$toEqual41;

    var state = (0, _reducer2.default)({
      foo: (_foo15 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _foo15[_reducer.globalErrorKey] = undefined, _foo15._initialized = false, _foo15._submitting = false, _foo15._submitFailed = false, _foo15)
    }, _extends({}, (0, _actions.startAsyncValidation)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual41 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: true
    }, _expect$toEqual41[_reducer.globalErrorKey] = undefined, _expect$toEqual41._initialized = false, _expect$toEqual41._submitting = false, _expect$toEqual41._submitFailed = false, _expect$toEqual41));
  });

  it('should set asyncValidating with field name on startAsyncValidation', function () {
    var _foo16, _expect$toEqual42;

    var state = (0, _reducer2.default)({
      foo: (_foo16 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'initialValue'
        }),
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _foo16[_reducer.globalErrorKey] = undefined, _foo16._initialized = false, _foo16._submitting = false, _foo16._submitFailed = false, _foo16)
    }, _extends({}, (0, _actions.startAsyncValidation)('myField'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual42 = {
      myField: {
        initial: 'initialValue',
        value: 'initialValue'
      },
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: 'myField'
    }, _expect$toEqual42[_reducer.globalErrorKey] = undefined, _expect$toEqual42._initialized = false, _expect$toEqual42._submitting = false, _expect$toEqual42._submitFailed = false, _expect$toEqual42));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
  });

  it('should set submitting on startSubmit', function () {
    var _foo17, _expect$toEqual43;

    var state = (0, _reducer2.default)({
      foo: (_foo17 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _foo17[_reducer.globalErrorKey] = undefined, _foo17._initialized = false, _foo17._submitting = false, _foo17._submitFailed = false, _foo17)
    }, _extends({}, (0, _actions.startSubmit)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual43 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual43[_reducer.globalErrorKey] = undefined, _expect$toEqual43._initialized = false, _expect$toEqual43._submitting = true, _expect$toEqual43._submitFailed = false, _expect$toEqual43));
  });

  it('should set submitting on startSubmit, and NOT reset submitFailed', function () {
    var _foo18, _expect$toEqual44;

    var state = (0, _reducer2.default)({
      foo: (_foo18 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _foo18[_reducer.globalErrorKey] = undefined, _foo18._initialized = false, _foo18._submitting = false, _foo18._submitFailed = true, _foo18)
    }, _extends({}, (0, _actions.startSubmit)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual44 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual44[_reducer.globalErrorKey] = undefined, _expect$toEqual44._initialized = false, _expect$toEqual44._submitting = true, _expect$toEqual44._submitFailed = true, _expect$toEqual44));
  });

  it('should set asyncError on nested fields on stopAsyncValidation', function () {
    var _foo19, _expect$toEqual45;

    var state = (0, _reducer2.default)({
      foo: (_foo19 = {
        bar: {
          myField: (0, _fieldValue.makeFieldValue)({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          myOtherField: (0, _fieldValue.makeFieldValue)({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        },
        _active: undefined,
        _asyncValidating: true
      }, _foo19[_reducer.globalErrorKey] = undefined, _foo19._initialized = false, _foo19._submitting = false, _foo19._submitFailed = false, _foo19)
    }, _extends({}, (0, _actions.stopAsyncValidation)({
      bar: {
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      }
    }), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual45 = {
      bar: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true,
          asyncError: 'Error about myField'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true,
          asyncError: 'Error about myOtherField'
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual45[_reducer.globalErrorKey] = undefined, _expect$toEqual45._initialized = false, _expect$toEqual45._submitting = false, _expect$toEqual45._submitFailed = false, _expect$toEqual45));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar.myOtherField)).toBe(true);
  });

  it('should set asyncError on array fields on stopAsyncValidation', function () {
    var _foo20, _expect$toEqual46;

    var state = (0, _reducer2.default)({
      foo: (_foo20 = {
        bar: [(0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }), (0, _fieldValue.makeFieldValue)({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        })],
        _active: undefined,
        _asyncValidating: true
      }, _foo20[_reducer.globalErrorKey] = undefined, _foo20._initialized = false, _foo20._submitting = false, _foo20._submitFailed = false, _foo20)
    }, _extends({}, (0, _actions.stopAsyncValidation)({
      bar: ['Error about myField', 'Error about myOtherField']
    }), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual46 = {
      bar: [{
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        asyncError: 'Error about myField'
      }, {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        asyncError: 'Error about myOtherField'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual46[_reducer.globalErrorKey] = undefined, _expect$toEqual46._initialized = false, _expect$toEqual46._submitting = false, _expect$toEqual46._submitFailed = false, _expect$toEqual46));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar[1])).toBe(true);
  });

  it('should unset asyncValidating on stopAsyncValidation', function () {
    var _foo21, _expect$toEqual47;

    var state = (0, _reducer2.default)({
      foo: (_foo21 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: (0, _fieldValue.makeFieldValue)({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: true
      }, _foo21[_reducer.globalErrorKey] = undefined, _foo21._initialized = false, _foo21._submitting = false, _foo21._submitFailed = false, _foo21)
    }, _extends({}, (0, _actions.stopAsyncValidation)({
      myField: 'Error about myField',
      myOtherField: 'Error about myOtherField'
    }), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual47 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        asyncError: 'Error about myField'
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        asyncError: 'Error about myOtherField'
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual47[_reducer.globalErrorKey] = undefined, _expect$toEqual47._initialized = false, _expect$toEqual47._submitting = false, _expect$toEqual47._submitFailed = false, _expect$toEqual47));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myOtherField)).toBe(true);
  });

  it('should unset field async errors on stopAsyncValidation', function () {
    var _foo22, _expect$toEqual48;

    var state = (0, _reducer2.default)({
      foo: (_foo22 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'dirtyValue',
          asyncError: 'myFieldError',
          touched: true
        }),
        myOtherField: (0, _fieldValue.makeFieldValue)({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          asyncError: 'myOtherFieldError',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: true
      }, _foo22[_reducer.globalErrorKey] = undefined, _foo22._initialized = false, _foo22._submitting = false, _foo22._submitFailed = false, _foo22)
    }, _extends({}, (0, _actions.stopAsyncValidation)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual48 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual48[_reducer.globalErrorKey] = undefined, _expect$toEqual48._initialized = false, _expect$toEqual48._submitting = false, _expect$toEqual48._submitFailed = false, _expect$toEqual48));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myOtherField)).toBe(true);
  });

  it('should unset asyncValidating on stopAsyncValidation and set global error', function () {
    var _foo23, _stopAsyncValidation, _expect$toEqual49;

    var state = (0, _reducer2.default)({
      foo: (_foo23 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: (0, _fieldValue.makeFieldValue)({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: true
      }, _foo23[_reducer.globalErrorKey] = undefined, _foo23._initialized = false, _foo23._submitting = false, _foo23._submitFailed = false, _foo23)
    }, _extends({}, (0, _actions.stopAsyncValidation)((_stopAsyncValidation = {}, _stopAsyncValidation[_reducer.globalErrorKey] = 'This is a global error', _stopAsyncValidation)), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual49 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual49[_reducer.globalErrorKey] = 'This is a global error', _expect$toEqual49._initialized = false, _expect$toEqual49._submitting = false, _expect$toEqual49._submitFailed = false, _expect$toEqual49));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myOtherField)).toBe(true);
  });

  it('should unset submitting on stopSubmit', function () {
    var _foo24, _expect$toEqual50;

    var state = (0, _reducer2.default)({
      foo: (_foo24 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _foo24[_reducer.globalErrorKey] = undefined, _foo24._initialized = false, _foo24._submitting = true, _foo24._submitFailed = false, _foo24)
    }, _extends({}, (0, _actions.stopSubmit)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual50 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual50[_reducer.globalErrorKey] = undefined, _expect$toEqual50._initialized = false, _expect$toEqual50._submitting = false, _expect$toEqual50._submitFailed = false, _expect$toEqual50));
  });

  it('should set submitError on nested fields on stopSubmit', function () {
    var _foo25, _expect$toEqual51;

    var state = (0, _reducer2.default)({
      foo: (_foo25 = {
        bar: {
          myField: (0, _fieldValue.makeFieldValue)({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          myOtherField: (0, _fieldValue.makeFieldValue)({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        },
        _active: undefined,
        _asyncValidating: false
      }, _foo25[_reducer.globalErrorKey] = undefined, _foo25._initialized = false, _foo25._submitting = true, _foo25._submitFailed = false, _foo25)
    }, _extends({}, (0, _actions.stopSubmit)({
      bar: {
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      }
    }), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual51 = {
      bar: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true,
          submitError: 'Error about myField'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true,
          submitError: 'Error about myOtherField'
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual51[_reducer.globalErrorKey] = undefined, _expect$toEqual51._initialized = false, _expect$toEqual51._submitting = false, _expect$toEqual51._submitFailed = true, _expect$toEqual51));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar.myOtherField)).toBe(true);
  });

  it('should set submitError on array fields on stopSubmit', function () {
    var _foo26, _expect$toEqual52;

    var state = (0, _reducer2.default)({
      foo: (_foo26 = {
        bar: [(0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }), (0, _fieldValue.makeFieldValue)({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        })],
        _active: undefined,
        _asyncValidating: false
      }, _foo26[_reducer.globalErrorKey] = undefined, _foo26._initialized = false, _foo26._submitting = true, _foo26._submitFailed = false, _foo26)
    }, _extends({}, (0, _actions.stopSubmit)({
      bar: ['Error about myField', 'Error about myOtherField']
    }), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual52 = {
      bar: [{
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        submitError: 'Error about myField'
      }, {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        submitError: 'Error about myOtherField'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual52[_reducer.globalErrorKey] = undefined, _expect$toEqual52._initialized = false, _expect$toEqual52._submitting = false, _expect$toEqual52._submitFailed = true, _expect$toEqual52));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.bar[1])).toBe(true);
  });

  it('should unset submitFailed on stopSubmit with no errors', function () {
    var _foo27, _expect$toEqual53;

    var state = (0, _reducer2.default)({
      foo: (_foo27 = {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false
      }, _foo27[_reducer.globalErrorKey] = undefined, _foo27._initialized = false, _foo27._submitting = true, _foo27._submitFailed = true, _foo27)
    }, _extends({}, (0, _actions.stopSubmit)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual53 = {
      doesnt: 'matter',
      should: 'notchange',
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual53[_reducer.globalErrorKey] = undefined, _expect$toEqual53._initialized = false, _expect$toEqual53._submitting = false, _expect$toEqual53._submitFailed = false, _expect$toEqual53));
  });

  it('should unset submitting and set submit errors on stopSubmit', function () {
    var _foo28, _expect$toEqual54;

    var state = (0, _reducer2.default)({
      foo: (_foo28 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: (0, _fieldValue.makeFieldValue)({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: false
      }, _foo28[_reducer.globalErrorKey] = undefined, _foo28._initialized = false, _foo28._submitting = true, _foo28._submitFailed = false, _foo28)
    }, _extends({}, (0, _actions.stopSubmit)({
      myField: 'Error about myField',
      myOtherField: 'Error about myOtherField'
    }), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual54 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true,
        submitError: 'Error about myField'
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true,
        submitError: 'Error about myOtherField'
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual54[_reducer.globalErrorKey] = undefined, _expect$toEqual54._initialized = false, _expect$toEqual54._submitting = false, _expect$toEqual54._submitFailed = true, _expect$toEqual54));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myOtherField)).toBe(true);
  });

  it('should unset submitting and set submit global error on stopSubmit', function () {
    var _foo29, _stopSubmit, _expect$toEqual55;

    var state = (0, _reducer2.default)({
      foo: (_foo29 = {
        myField: (0, _fieldValue.makeFieldValue)({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: (0, _fieldValue.makeFieldValue)({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: false
      }, _foo29[_reducer.globalErrorKey] = undefined, _foo29._initialized = false, _foo29._submitting = true, _foo29._submitFailed = false, _foo29)
    }, _extends({}, (0, _actions.stopSubmit)((_stopSubmit = {}, _stopSubmit[_reducer.globalErrorKey] = 'This is a global error', _stopSubmit)), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual55 = {
      myField: {
        initial: 'initialValue',
        value: 'dirtyValue',
        touched: true
      },
      myOtherField: {
        initial: 'otherInitialValue',
        value: 'otherDirtyValue',
        touched: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual55[_reducer.globalErrorKey] = 'This is a global error', _expect$toEqual55._initialized = false, _expect$toEqual55._submitting = false, _expect$toEqual55._submitFailed = true, _expect$toEqual55));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myOtherField)).toBe(true);
  });

  it('should mark fields as touched on touch', function () {
    var _foo30, _expect$toEqual56;

    var state = (0, _reducer2.default)({
      foo: (_foo30 = {
        myField: (0, _fieldValue.makeFieldValue)({
          value: 'initialValue',
          touched: false
        }),
        myOtherField: (0, _fieldValue.makeFieldValue)({
          value: 'otherInitialValue',
          touched: false
        }),
        _active: undefined,
        _asyncValidating: false
      }, _foo30[_reducer.globalErrorKey] = undefined, _foo30._initialized = false, _foo30._submitting = false, _foo30._submitFailed = false, _foo30)
    }, _extends({}, (0, _actions.touch)('myField', 'myOtherField'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual56 = {
      myField: {
        value: 'initialValue',
        touched: true
      },
      myOtherField: {
        value: 'otherInitialValue',
        touched: true
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual56[_reducer.globalErrorKey] = undefined, _expect$toEqual56._initialized = false, _expect$toEqual56._submitting = false, _expect$toEqual56._submitFailed = false, _expect$toEqual56));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myOtherField)).toBe(true);
  });

  it('should mark deep fields as touched on touch', function () {
    var _foo31, _expect$toEqual57;

    var state = (0, _reducer2.default)({
      foo: (_foo31 = {
        deep: {
          myField: (0, _fieldValue.makeFieldValue)({
            value: 'initialValue',
            touched: false
          }),
          myOtherField: (0, _fieldValue.makeFieldValue)({
            value: 'otherInitialValue',
            touched: false
          })
        },
        _active: undefined,
        _asyncValidating: false
      }, _foo31[_reducer.globalErrorKey] = undefined, _foo31._initialized = false, _foo31._submitting = false, _foo31._submitFailed = false, _foo31)
    }, _extends({}, (0, _actions.touch)('deep.myField', 'deep.myOtherField'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual57 = {
      deep: {
        myField: {
          value: 'initialValue',
          touched: true
        },
        myOtherField: {
          value: 'otherInitialValue',
          touched: true
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual57[_reducer.globalErrorKey] = undefined, _expect$toEqual57._initialized = false, _expect$toEqual57._submitting = false, _expect$toEqual57._submitFailed = false, _expect$toEqual57));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.deep)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.deep.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.deep.myOtherField)).toBe(true);
  });

  it('should mark array fields as touched on touch', function () {
    var _foo32, _expect$toEqual58;

    var state = (0, _reducer2.default)({
      foo: (_foo32 = {
        myFields: [(0, _fieldValue.makeFieldValue)({
          value: 'initialValue',
          touched: false
        }), (0, _fieldValue.makeFieldValue)({
          value: 'otherInitialValue',
          touched: false
        })],
        _active: undefined,
        _asyncValidating: false
      }, _foo32[_reducer.globalErrorKey] = undefined, _foo32._initialized = false, _foo32._submitting = false, _foo32._submitFailed = false, _foo32)
    }, _extends({}, (0, _actions.touch)('myFields[0]', 'myFields[1]'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual58 = {
      myFields: [{
        value: 'initialValue',
        touched: true
      }, {
        value: 'otherInitialValue',
        touched: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual58[_reducer.globalErrorKey] = undefined, _expect$toEqual58._initialized = false, _expect$toEqual58._submitting = false, _expect$toEqual58._submitFailed = false, _expect$toEqual58));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array fields as touched on touch', function () {
    var _foo33, _expect$toEqual59;

    var state = (0, _reducer2.default)({
      foo: (_foo33 = {
        myFields: [(0, _fieldValue.makeFieldValue)({
          value: 'initialValue',
          touched: false
        }), (0, _fieldValue.makeFieldValue)({
          value: 'otherInitialValue',
          touched: false
        })],
        _active: undefined,
        _asyncValidating: false
      }, _foo33[_reducer.globalErrorKey] = undefined, _foo33._initialized = false, _foo33._submitting = false, _foo33._submitFailed = false, _foo33)
    }, _extends({}, (0, _actions.touch)('myFields[]'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual59 = {
      myFields: [{
        value: 'initialValue',
        touched: true
      }, {
        value: 'otherInitialValue',
        touched: true
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual59[_reducer.globalErrorKey] = undefined, _expect$toEqual59._initialized = false, _expect$toEqual59._submitting = false, _expect$toEqual59._submitFailed = false, _expect$toEqual59));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array subfields as touched on touch', function () {
    var _foo34, _expect$toEqual60;

    var state = (0, _reducer2.default)({
      foo: (_foo34 = {
        myFields: [{
          name: (0, _fieldValue.makeFieldValue)({
            value: 'initialValue',
            touched: false
          })
        }, {
          name: (0, _fieldValue.makeFieldValue)({
            value: 'otherInitialValue',
            touched: false
          })
        }],
        _active: undefined,
        _asyncValidating: false
      }, _foo34[_reducer.globalErrorKey] = undefined, _foo34._initialized = false, _foo34._submitting = false, _foo34._submitFailed = false, _foo34)
    }, _extends({}, (0, _actions.touch)('myFields[].name'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual60 = {
      myFields: [{
        name: {
          value: 'initialValue',
          touched: true
        }
      }, {
        name: {
          value: 'otherInitialValue',
          touched: true
        }
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual60[_reducer.globalErrorKey] = undefined, _expect$toEqual60._initialized = false, _expect$toEqual60._submitting = false, _expect$toEqual60._submitFailed = false, _expect$toEqual60));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[0])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[0].name)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[1])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[1].name)).toBe(true);
  });

  it('should ignore empty index-less array fields on touch', function () {
    var _foo35, _expect$toEqual61;

    var state = (0, _reducer2.default)({
      foo: (_foo35 = {
        _active: undefined,
        _asyncValidating: false
      }, _foo35[_reducer.globalErrorKey] = undefined, _foo35._initialized = false, _foo35._submitting = false, _foo35._submitFailed = false, _foo35)
    }, _extends({}, (0, _actions.touch)('myFields[]'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual61 = {
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual61[_reducer.globalErrorKey] = undefined, _expect$toEqual61._initialized = false, _expect$toEqual61._submitting = false, _expect$toEqual61._submitFailed = false, _expect$toEqual61));
  });

  it('should ignore empty index-less array subfields on touch', function () {
    var _foo36, _expect$toEqual62;

    var state = (0, _reducer2.default)({
      foo: (_foo36 = {
        _active: undefined,
        _asyncValidating: false
      }, _foo36[_reducer.globalErrorKey] = undefined, _foo36._initialized = false, _foo36._submitting = false, _foo36._submitFailed = false, _foo36)
    }, _extends({}, (0, _actions.touch)('myFields[].name'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual62 = {
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual62[_reducer.globalErrorKey] = undefined, _expect$toEqual62._initialized = false, _expect$toEqual62._submitting = false, _expect$toEqual62._submitFailed = false, _expect$toEqual62));
  });

  it('should unmark fields as touched on untouch', function () {
    var _foo37, _expect$toEqual63;

    var state = (0, _reducer2.default)({
      foo: (_foo37 = {
        myField: (0, _fieldValue.makeFieldValue)({
          value: 'initialValue',
          touched: true
        }),
        myOtherField: (0, _fieldValue.makeFieldValue)({
          value: 'otherInitialValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: false
      }, _foo37[_reducer.globalErrorKey] = undefined, _foo37._initialized = false, _foo37._submitting = false, _foo37._submitFailed = false, _foo37)
    }, _extends({}, (0, _actions.untouch)('myField', 'myOtherField'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual63 = {
      myField: {
        value: 'initialValue'
      },
      myOtherField: {
        value: 'otherInitialValue'
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual63[_reducer.globalErrorKey] = undefined, _expect$toEqual63._initialized = false, _expect$toEqual63._submitting = false, _expect$toEqual63._submitFailed = false, _expect$toEqual63));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myOtherField)).toBe(true);
  });

  it('should unmark deep fields as touched on untouch', function () {
    var _foo38, _expect$toEqual64;

    var state = (0, _reducer2.default)({
      foo: (_foo38 = {
        deep: {
          myField: (0, _fieldValue.makeFieldValue)({
            value: 'initialValue',
            touched: true
          }),
          myOtherField: (0, _fieldValue.makeFieldValue)({
            value: 'otherInitialValue',
            touched: true
          })
        },
        _active: undefined,
        _asyncValidating: false
      }, _foo38[_reducer.globalErrorKey] = undefined, _foo38._initialized = false, _foo38._submitting = false, _foo38._submitFailed = false, _foo38)
    }, _extends({}, (0, _actions.untouch)('deep.myField', 'deep.myOtherField'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual64 = {
      deep: {
        myField: {
          value: 'initialValue'
        },
        myOtherField: {
          value: 'otherInitialValue'
        }
      },
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual64[_reducer.globalErrorKey] = undefined, _expect$toEqual64._initialized = false, _expect$toEqual64._submitting = false, _expect$toEqual64._submitFailed = false, _expect$toEqual64));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.deep)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.deep.myField)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.deep.myOtherField)).toBe(true);
  });

  it('should unmark array fields as touched on untouch', function () {
    var _foo39, _expect$toEqual65;

    var state = (0, _reducer2.default)({
      foo: (_foo39 = {
        myFields: [(0, _fieldValue.makeFieldValue)({
          value: 'initialValue',
          touched: true
        }), (0, _fieldValue.makeFieldValue)({
          value: 'otherInitialValue',
          touched: true
        })],
        _active: undefined,
        _asyncValidating: false
      }, _foo39[_reducer.globalErrorKey] = undefined, _foo39._initialized = false, _foo39._submitting = false, _foo39._submitFailed = false, _foo39)
    }, _extends({}, (0, _actions.untouch)('myFields[0]', 'myFields[1]'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual65 = {
      myFields: [{
        value: 'initialValue'
      }, {
        value: 'otherInitialValue'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual65[_reducer.globalErrorKey] = undefined, _expect$toEqual65._initialized = false, _expect$toEqual65._submitting = false, _expect$toEqual65._submitFailed = false, _expect$toEqual65));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array fields as touched on touch', function () {
    var _foo40, _expect$toEqual66;

    var state = (0, _reducer2.default)({
      foo: (_foo40 = {
        myFields: [(0, _fieldValue.makeFieldValue)({
          value: 'initialValue',
          touched: true
        }), (0, _fieldValue.makeFieldValue)({
          value: 'otherInitialValue',
          touched: true
        })],
        _active: undefined,
        _asyncValidating: false
      }, _foo40[_reducer.globalErrorKey] = undefined, _foo40._initialized = false, _foo40._submitting = false, _foo40._submitFailed = false, _foo40)
    }, _extends({}, (0, _actions.untouch)('myFields[]'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual66 = {
      myFields: [{
        value: 'initialValue'
      }, {
        value: 'otherInitialValue'
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual66[_reducer.globalErrorKey] = undefined, _expect$toEqual66._initialized = false, _expect$toEqual66._submitting = false, _expect$toEqual66._submitFailed = false, _expect$toEqual66));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[0])).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array subfields as touched on touch', function () {
    var _foo41, _expect$toEqual67;

    var state = (0, _reducer2.default)({
      foo: (_foo41 = {
        myFields: [{
          name: (0, _fieldValue.makeFieldValue)({
            value: 'initialValue',
            touched: true
          })
        }, {
          name: (0, _fieldValue.makeFieldValue)({
            value: 'otherInitialValue',
            touched: true
          })
        }],
        _active: undefined,
        _asyncValidating: false
      }, _foo41[_reducer.globalErrorKey] = undefined, _foo41._initialized = false, _foo41._submitting = false, _foo41._submitFailed = false, _foo41)
    }, _extends({}, (0, _actions.untouch)('myFields[].name'), {
      form: 'foo'
    }));
    (0, _expect2.default)(state.foo).toEqual((_expect$toEqual67 = {
      myFields: [{
        name: {
          value: 'initialValue'
        }
      }, {
        name: {
          value: 'otherInitialValue'
        }
      }],
      _active: undefined,
      _asyncValidating: false
    }, _expect$toEqual67[_reducer.globalErrorKey] = undefined, _expect$toEqual67._initialized = false, _expect$toEqual67._submitting = false, _expect$toEqual67._submitFailed = false, _expect$toEqual67));
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields)).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[0])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[0].name)).toBe(true);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[1])).toBe(false);
    (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.myFields[1].name)).toBe(true);
  });

  it('should destroy forms on destroy', function () {
    var _foo42, _bar, _bar2;

    var state = (0, _reducer2.default)({
      foo: (_foo42 = {
        _active: undefined,
        _asyncValidating: false
      }, _foo42[_reducer.globalErrorKey] = undefined, _foo42._initialized = false, _foo42._submitting = false, _foo42._submitFailed = false, _foo42),
      bar: (_bar = {
        _active: undefined,
        _asyncValidating: false
      }, _bar[_reducer.globalErrorKey] = undefined, _bar._initialized = false, _bar._submitting = false, _bar._submitFailed = false, _bar)
    }, _extends({}, (0, _actions.destroy)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state).toEqual({
      bar: (_bar2 = {
        _active: undefined,
        _asyncValidating: false
      }, _bar2[_reducer.globalErrorKey] = undefined, _bar2._initialized = false, _bar2._submitting = false, _bar2._submitFailed = false, _bar2)
    });
  });

  it('should destroy last form on destroy', function () {
    var _foo43;

    var state = (0, _reducer2.default)({
      foo: (_foo43 = {
        _active: undefined,
        _asyncValidating: false
      }, _foo43[_reducer.globalErrorKey] = undefined, _foo43._initialized = false, _foo43._submitting = false, _foo43._submitFailed = false, _foo43)
    }, _extends({}, (0, _actions.destroy)(), {
      form: 'foo'
    }));
    (0, _expect2.default)(state).toEqual({});
  });

  it('should destroy form and formkey on destroy', function () {
    var _barKey, _bazKey, _bazKey2;

    var destroyWithKey = function destroyWithKey(key) {
      return (0, _bindActionData2.default)(_actions.destroy, { key: key })();
    };
    var state = (0, _reducer2.default)({
      fooForm: {
        barKey: (_barKey = {
          _active: undefined,
          _asyncValidating: false
        }, _barKey[_reducer.globalErrorKey] = undefined, _barKey._initialized = false, _barKey._submitting = false, _barKey._submitFailed = false, _barKey),
        bazKey: (_bazKey = {
          _active: undefined,
          _asyncValidating: false
        }, _bazKey[_reducer.globalErrorKey] = undefined, _bazKey._initialized = false, _bazKey._submitting = false, _bazKey._submitFailed = false, _bazKey)
      }
    }, _extends({}, destroyWithKey('barKey'), {
      form: 'fooForm'
    }));
    (0, _expect2.default)(state.fooForm).toEqual({
      bazKey: (_bazKey2 = {
        _active: undefined,
        _asyncValidating: false
      }, _bazKey2[_reducer.globalErrorKey] = undefined, _bazKey2._initialized = false, _bazKey2._submitting = false, _bazKey2._submitFailed = false, _bazKey2)
    });
  });

  describe('reducer.plugin', function () {
    it('should initialize form state when there is a reducer plugin', function () {
      var _expect$toExist$toBeA2;

      var result = _reducer2.default.plugin({
        foo: function foo(state) {
          return state;
        }
      })();
      (0, _expect2.default)(result).toExist().toBeA('object');
      (0, _expect2.default)(Object.keys(result).length).toBe(1);
      (0, _expect2.default)(result.foo).toExist().toBeA('object').toEqual((_expect$toExist$toBeA2 = {
        _active: undefined,
        _asyncValidating: false
      }, _expect$toExist$toBeA2[_reducer.globalErrorKey] = undefined, _expect$toExist$toBeA2._initialized = false, _expect$toExist$toBeA2._submitting = false, _expect$toExist$toBeA2._submitFailed = false, _expect$toExist$toBeA2));
    });
  });

  describe('reducer.normalize', function () {
    it('should initialize form state when there is a normalizer', function () {
      var _expect$toExist$toBeA3;

      var state = _reducer2.default.normalize({
        foo: {
          'myField': function myField() {
            return 'normalized';
          },
          'person.name': function personName() {
            return 'John Doe';
          },
          'pets[].name': function petsName() {
            return 'Fido';
          }
        }
      })();
      (0, _expect2.default)(state).toExist().toBeA('object');
      (0, _expect2.default)(Object.keys(state).length).toBe(1);
      (0, _expect2.default)(state.foo).toExist().toBeA('object').toEqual((_expect$toExist$toBeA3 = {
        _active: undefined,
        _asyncValidating: false
      }, _expect$toExist$toBeA3[_reducer.globalErrorKey] = undefined, _expect$toExist$toBeA3._initialized = false, _expect$toExist$toBeA3._submitting = false, _expect$toExist$toBeA3._submitFailed = false, _expect$toExist$toBeA3.myField = {
        value: 'normalized'
      }, _expect$toExist$toBeA3.person = {
        name: {
          value: 'John Doe'
        }
      }, _expect$toExist$toBeA3.pets = [], _expect$toExist$toBeA3));
    });

    it('should normalize keyed forms depending on action form key', function () {
      var _defaultFields;

      var defaultFields = (_defaultFields = {
        _active: undefined,
        _asyncValidating: false
      }, _defaultFields[_reducer.globalErrorKey] = undefined, _defaultFields._initialized = false, _defaultFields._submitting = false, _defaultFields._submitFailed = false, _defaultFields);
      var normalize = _reducer2.default.normalize({
        foo: {
          'myField': function myField() {
            return 'normalized';
          },
          'person.name': function personName() {
            return 'John Doe';
          },
          'pets[].name': function petsName() {
            return 'Fido';
          }
        }
      });
      var state = normalize({
        foo: {
          firstSubform: {}
        }
      }, {
        form: 'foo',
        key: 'firstSubform'
      });
      var nextState = normalize(state, {
        form: 'foo',
        key: 'secondSubForm'
      });
      (0, _expect2.default)(state).toExist().toBeA('object');
      (0, _expect2.default)(Object.keys(state).length).toBe(1);
      (0, _expect2.default)(state.foo).toExist().toBeA('object').toEqual({
        firstSubform: _extends({}, defaultFields, {
          myField: {
            value: 'normalized'
          },
          person: {
            name: {
              value: 'John Doe'
            }
          },
          pets: []
        })
      });
      (0, _expect2.default)(nextState.foo).toEqual({
        firstSubform: _extends({}, defaultFields, {
          myField: {
            value: 'normalized'
          },
          person: {
            name: {
              value: 'John Doe'
            }
          },
          pets: []
        }),
        secondSubForm: _extends({}, defaultFields, {
          myField: {
            value: 'normalized'
          },
          person: {
            name: {
              value: 'John Doe'
            }
          },
          pets: []
        })
      });
    });

    it('should normalize simple form values', function () {
      var _defaultFields2;

      var defaultFields = (_defaultFields2 = {
        _active: undefined,
        _asyncValidating: false
      }, _defaultFields2[_reducer.globalErrorKey] = undefined, _defaultFields2._initialized = false, _defaultFields2._submitting = false, _defaultFields2._submitFailed = false, _defaultFields2);
      var normalize = _reducer2.default.normalize({
        foo: {
          'name': function name() {
            return 'normalized';
          },
          'person.name': function personName(name) {
            return name && name.toUpperCase();
          },
          'pets[].name': function petsName(name) {
            return name && name.toLowerCase();
          }
        }
      });
      var state = normalize({
        foo: {
          name: {
            value: 'dog'
          },
          person: {
            name: {
              value: 'John Doe'
            }
          },
          pets: [{ name: { value: 'Fido' } }, { name: { value: 'Tucker' } }]
        }
      });
      (0, _expect2.default)(state).toExist().toBeA('object');
      (0, _expect2.default)(state.foo).toExist().toBeA('object').toEqual(_extends({}, defaultFields, {
        name: {
          value: 'normalized'
        },
        person: {
          name: {
            value: 'JOHN DOE'
          }
        },
        pets: [{ name: { value: 'fido' } }, { name: { value: 'tucker' } }]
      }));
    });

    it('should allow resetForm to work on a normalized form', function () {
      var _defaultFields3;

      var defaultFields = (_defaultFields3 = {
        _active: undefined,
        _asyncValidating: false
      }, _defaultFields3[_reducer.globalErrorKey] = undefined, _defaultFields3._initialized = false, _defaultFields3._submitting = false, _defaultFields3._submitFailed = false, _defaultFields3);
      var normalizingReducer = _reducer2.default.normalize({
        foo: {
          'name': function name(value) {
            return value && value.toUpperCase();
          },
          'person.name': function personName(name) {
            return name && name.toUpperCase();
          },
          'pets[].name': function petsName(name) {
            return name && name.toLowerCase();
          }
        }
      });
      var empty = normalizingReducer();
      var state = normalizingReducer(empty, _extends({
        form: 'foo'
      }, (0, _actions.change)('name', 'dog')));
      state = normalizingReducer(state, _extends({
        form: 'foo'
      }, (0, _actions.change)('person.name', 'John Doe')));
      state = normalizingReducer(state, _extends({
        form: 'foo'
      }, (0, _actions.addArrayValue)('pets', { name: 'Fido' })));
      (0, _expect2.default)(state).toExist().toBeA('object');
      (0, _expect2.default)(state.foo).toExist().toBeA('object').toEqual(_extends({}, defaultFields, {
        name: {
          value: 'DOG'
        },
        person: {
          name: {
            value: 'JOHN DOE'
          }
        },
        pets: [{
          name: {
            initial: 'Fido',
            value: 'fido'
          }
        }]
      }));
      var result = normalizingReducer(state, _extends({
        form: 'foo'
      }, (0, _actions.reset)()));
      (0, _expect2.default)(result).toExist().toBeA('object');
      (0, _expect2.default)(result.foo).toExist().toBeA('object').toEqual(_extends({}, defaultFields, {
        name: {
          value: undefined
        },
        person: {
          name: {
            value: undefined
          }
        },
        pets: [{
          name: {
            initial: 'Fido',
            value: 'fido'
          }
        }]
      }));
    });

    it('should normalize arbitrarily deeply nested fields', function () {
      var _defaultFields4;

      var defaultFields = (_defaultFields4 = {
        _active: undefined,
        _asyncValidating: false
      }, _defaultFields4[_reducer.globalErrorKey] = undefined, _defaultFields4._initialized = false, _defaultFields4._submitting = false, _defaultFields4._submitFailed = false, _defaultFields4);
      var normalize = _reducer2.default.normalize({
        foo: {
          'name': function name() {
            return 'normalized';
          },
          'person.name': function personName(name) {
            return name && name.toUpperCase();
          },
          'pets[].name': function petsName(name) {
            return name && name.toLowerCase();
          },
          'cats[]': function cats(array) {
            return array && array.map(function (_ref) {
              var value = _ref.value;
              return { value: value.toUpperCase() };
            });
          },
          'programming[].langs[]': function programmingLangs(array) {
            return array && array.slice(0).sort(compare);
          },
          'some.numbers[]': function someNumbers(array) {
            return array && array.filter(function (_ref2) {
              var value = _ref2.value;
              return value % 2 === 0;
            });
          },
          'a.very.deep.object.property': function aVeryDeepObjectProperty(value) {
            return value && value.toUpperCase();
          },
          'my[].deeply[].nested.item': function myDeeplyNestedItem(value) {
            return value && value.toUpperCase();
          }
        }
      });
      var state = normalize({
        foo: {
          person: {
            name: (0, _fieldValue.makeFieldValue)({ value: 'John Doe' })
          },
          pets: [{ name: (0, _fieldValue.makeFieldValue)({ value: 'Fido' }) }, { name: (0, _fieldValue.makeFieldValue)({ value: 'Tucker' }) }],
          cats: [(0, _fieldValue.makeFieldValue)({ value: 'lion' }), (0, _fieldValue.makeFieldValue)({ value: 'panther' }), (0, _fieldValue.makeFieldValue)({ value: 'garfield' }), (0, _fieldValue.makeFieldValue)({ value: 'whiskers' })],
          programming: [{
            langs: [(0, _fieldValue.makeFieldValue)({ value: 'ml' }), (0, _fieldValue.makeFieldValue)({ value: 'ocaml' }), (0, _fieldValue.makeFieldValue)({ value: 'lisp' }), (0, _fieldValue.makeFieldValue)({ value: 'haskell' }), (0, _fieldValue.makeFieldValue)({ value: 'f#' })]
          }, {
            langs: [(0, _fieldValue.makeFieldValue)({ value: 'smalltalk' }), (0, _fieldValue.makeFieldValue)({ value: 'ruby' }), (0, _fieldValue.makeFieldValue)({ value: 'java' }), (0, _fieldValue.makeFieldValue)({ value: 'c#' }), (0, _fieldValue.makeFieldValue)({ value: 'c++' })]
          }],
          some: {
            numbers: [(0, _fieldValue.makeFieldValue)({ value: 1 }), (0, _fieldValue.makeFieldValue)({ value: 2 }), (0, _fieldValue.makeFieldValue)({ value: 3 }), (0, _fieldValue.makeFieldValue)({ value: 4 }), (0, _fieldValue.makeFieldValue)({ value: 5 }), (0, _fieldValue.makeFieldValue)({ value: 6 }), (0, _fieldValue.makeFieldValue)({ value: 7 }), (0, _fieldValue.makeFieldValue)({ value: 8 }), (0, _fieldValue.makeFieldValue)({ value: 9 }), (0, _fieldValue.makeFieldValue)({ value: 10 })]
          },
          a: {
            very: {
              deep: {
                object: {
                  property: (0, _fieldValue.makeFieldValue)({ value: 'test' })
                }
              }
            }
          },
          my: [{
            deeply: [{
              nested: {
                item: (0, _fieldValue.makeFieldValue)({ value: 'hello' }),
                not: (0, _fieldValue.makeFieldValue)({ value: 'lost' })
              },
              otherKey: (0, _fieldValue.makeFieldValue)({ value: 'Goodbye' })
            }, {
              nested: {
                item: (0, _fieldValue.makeFieldValue)({ value: 'hola' }),
                not: (0, _fieldValue.makeFieldValue)({ value: 'lost' })
              },
              otherKey: (0, _fieldValue.makeFieldValue)({ value: 'Adios' })
            }],
            stays: (0, _fieldValue.makeFieldValue)({ value: 'intact' })
          }, {
            deeply: [{
              nested: {
                item: (0, _fieldValue.makeFieldValue)({ value: 'world' }),
                not: (0, _fieldValue.makeFieldValue)({ value: 'lost' })
              },
              otherKey: (0, _fieldValue.makeFieldValue)({ value: 'Later' })
            }, {
              nested: {
                item: (0, _fieldValue.makeFieldValue)({ value: 'mundo' }),
                not: (0, _fieldValue.makeFieldValue)({ value: 'lost' })
              },
              otherKey: (0, _fieldValue.makeFieldValue)({ value: 'Hasta luego' })
            }],
            stays: (0, _fieldValue.makeFieldValue)({ value: 'intact' })
          }]
        }
      });
      (0, _expect2.default)(state).toExist().toBeA('object');
      (0, _expect2.default)(state.foo).toExist().toBeA('object').toEqual(_extends({}, defaultFields, {
        name: { value: 'normalized' },
        person: {
          name: { value: 'JOHN DOE' }
        },
        pets: [{ name: { value: 'fido' } }, { name: { value: 'tucker' } }],
        cats: [{ value: 'LION' }, { value: 'PANTHER' }, { value: 'GARFIELD' }, { value: 'WHISKERS' }],
        programming: [{
          langs: [{ value: 'f#' }, { value: 'haskell' }, { value: 'lisp' }, { value: 'ml' }, { value: 'ocaml' }]
        }, {
          langs: [{ value: 'c#' }, { value: 'c++' }, { value: 'java' }, { value: 'ruby' }, { value: 'smalltalk' }]
        }],
        some: {
          numbers: [{ value: 2 }, { value: 4 }, { value: 6 }, { value: 8 }, { value: 10 }]
        },
        a: {
          very: {
            deep: {
              object: {
                property: { value: 'TEST' }
              }
            }
          }
        },
        my: [{
          deeply: [{
            nested: {
              item: { value: 'HELLO' },
              not: { value: 'lost' }
            },
            otherKey: { value: 'Goodbye' }
          }, {
            nested: {
              item: { value: 'HOLA' },
              not: { value: 'lost' }
            },
            otherKey: { value: 'Adios' }
          }],
          stays: { value: 'intact' }
        }, {
          deeply: [{
            nested: {
              item: { value: 'WORLD' },
              not: { value: 'lost' }
            },
            otherKey: { value: 'Later' }
          }, {
            nested: {
              item: { value: 'MUNDO' },
              not: { value: 'lost' }
            },
            otherKey: { value: 'Hasta luego' }
          }],
          stays: { value: 'intact' }
        }]
      }));
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.name)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.person.name)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.pets[0].name)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.pets[1].name)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.cats[0])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.cats[1])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.cats[2])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.cats[3])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[0].langs[0])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[0].langs[1])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[0].langs[2])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[0].langs[3])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[0].langs[4])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[1].langs[0])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[1].langs[1])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[1].langs[2])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[1].langs[3])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.programming[1].langs[4])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.some.numbers[0])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.some.numbers[1])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.some.numbers[2])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.some.numbers[3])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.some.numbers[4])).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.a.very.deep.object.property)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[0].deeply[0].nested.item)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[0].deeply[0].nested.not)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[0].deeply[0].otherKey)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[0].deeply[1].nested.item)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[0].deeply[1].nested.not)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[0].deeply[1].otherKey)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[0].stays)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[1].deeply[0].nested.item)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[1].deeply[0].nested.not)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[1].deeply[0].otherKey)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[1].deeply[1].nested.item)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[1].deeply[1].nested.not)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[1].deeply[1].otherKey)).toBe(true);
      (0, _expect2.default)((0, _fieldValue.isFieldValue)(state.foo.my[1].stays)).toBe(true);
    });
  });

  it('should flag the correct field as active', function () {
    var store = (0, _redux.createStore)(_reducer2.default);

    store.dispatch(_extends({ form: 'foo' }, (0, _actions.initialize)({}, ['a', 'b'])));
    store.dispatch(_extends({ form: 'foo' }, (0, _actions.focus)('a')));
    store.dispatch(_extends({ form: 'foo' }, (0, _actions.focus)('b')));

    (0, _expect2.default)(store.getState()).toMatch({
      foo: { _active: 'b' }
    });

    store.dispatch(_extends({ form: 'foo' }, (0, _actions.blur)('a')));

    (0, _expect2.default)(store.getState()).toMatch({
      foo: { _active: 'b' }
    });

    store.dispatch(_extends({ form: 'foo' }, (0, _actions.blur)('b')));

    (0, _expect2.default)(store.getState().foo).toExcludeKey('_active');
  });
});