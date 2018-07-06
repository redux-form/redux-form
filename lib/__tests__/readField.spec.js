'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _readField = require('../readField');

var _readField2 = _interopRequireDefault(_readField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {
  return null;
};

var createRestorableSpy = function createRestorableSpy(fn) {
  return (0, _expect.createSpy)(fn, function restore() {
    this.calls = [];
  });
};

describe('readField', function () {
  var blur = createRestorableSpy();
  var change = createRestorableSpy();
  var focus = createRestorableSpy();
  var defaultProps = {
    asyncBlurFields: [],
    blur: blur,
    change: change,
    focus: focus,
    form: {},
    initialValues: {},
    readonly: false,
    addArrayValue: noop,
    removeArrayValue: noop,
    fields: []
  };

  var expectField = function expectField(_ref) {
    var field = _ref.field,
        name = _ref.name,
        value = _ref.value,
        dirty = _ref.dirty,
        touched = _ref.touched,
        visited = _ref.visited,
        error = _ref.error,
        initialValue = _ref.initialValue,
        readonly = _ref.readonly,
        checked = _ref.checked;

    (0, _expect2.default)(field).toExist().toBeA('object');
    (0, _expect2.default)(field.name).toBe(name);
    (0, _expect2.default)(field.value).toEqual(value);
    if (readonly) {
      (0, _expect2.default)(field.onBlur).toNotExist();
      (0, _expect2.default)(field.onChange).toNotExist();
      (0, _expect2.default)(field.onDragStart).toNotExist();
      (0, _expect2.default)(field.onDrop).toNotExist();
      (0, _expect2.default)(field.onFocus).toNotExist();
      (0, _expect2.default)(field.onUpdate).toNotExist();
    } else {
      (0, _expect2.default)(field.onBlur).toBeA('function');
      (0, _expect2.default)(field.onChange).toBeA('function');
      (0, _expect2.default)(field.onDragStart).toBeA('function');
      (0, _expect2.default)(field.onDrop).toBeA('function');
      (0, _expect2.default)(field.onFocus).toBeA('function');
      (0, _expect2.default)(field.onUpdate).toBeA('function');
      (0, _expect2.default)(field.onUpdate).toBe(field.onChange);

      // call blur
      (0, _expect2.default)(blur.calls.length).toBe(0);
      field.onBlur('newValue');
      (0, _expect2.default)(blur.calls.length).toBe(1);
      (0, _expect2.default)(blur).toHaveBeenCalled().toHaveBeenCalledWith(name, 'newValue');

      // call change
      (0, _expect2.default)(change.calls.length).toBe(0);
      field.onChange('newValue');
      (0, _expect2.default)(change.calls.length).toBe(1);
      (0, _expect2.default)(change).toHaveBeenCalled().toHaveBeenCalledWith(name, 'newValue');

      // call focus
      (0, _expect2.default)(focus.calls.length).toBe(0);
      field.onFocus();
      (0, _expect2.default)(focus.calls.length).toBe(1);
      (0, _expect2.default)(focus).toHaveBeenCalled();
    }
    (0, _expect2.default)(field.initialValue).toBe(initialValue);
    (0, _expect2.default)(field.error).toBe(error);
    (0, _expect2.default)(field.valid).toBe(!error);
    (0, _expect2.default)(field.invalid).toBe(!!error);
    (0, _expect2.default)(field.dirty).toBe(dirty);
    (0, _expect2.default)(field.pristine).toBe(!dirty);
    (0, _expect2.default)(field.touched).toBe(touched);
    (0, _expect2.default)(field.visited).toBe(visited);
    (0, _expect2.default)(field.checked).toBe(checked);

    blur.restore();
    change.restore();
    focus.restore();
  };

  it('should initialize a simple field', function () {
    var fields = {};
    (0, _readField2.default)({}, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
  });

  it('should read a simple field', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        value: 'bar'
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
  });

  it('should read a simple field with initial values', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        value: 'bar',
        initial: 'dog'
      }
    }, 'foo', undefined, fields, {}, undefined, false, _extends({}, defaultProps, {
      initialValues: { foo: 'cat' }
    }));
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'dog', // state.initial should override prop
      readonly: false
    });
  });

  it('should read a simple field with sync errors', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        value: 'bar'
      }
    }, 'foo', undefined, fields, {
      foo: 'fooError'
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooError',
      initialValue: '',
      readonly: false
    });
  });

  it('should set checked for boolean value', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        value: true
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: true,
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
      checked: true
    });
    (0, _readField2.default)({
      foo: {
        value: false
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: false,
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
      checked: false
    });
  });

  it('should update simple fields', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        value: 'bar'
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
    var beforeField = fields.foo;
    (0, _readField2.default)({
      foo: {
        value: 'dog'
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'dog',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
    var afterField = fields.foo;
    (0, _expect2.default)(beforeField).toNotBe(afterField); // field instance should be different
  });

  it('should initialize a nested field', function () {
    var fields = {};
    (0, _readField2.default)({}, 'foo.baz', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
  });

  it('should read a nested field', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        baz: {
          value: 'bar'
        }
      }
    }, 'foo.baz', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
  });

  it('should read a nested field with initial value', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        baz: {
          value: 'bar',
          initial: 'dog'
        }
      }
    }, 'foo.baz', undefined, fields, {}, undefined, false, _extends({}, defaultProps, {
      initialValues: {
        foo: {
          baz: 'cat'
        }
      }
    }));
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'dog', // state.initial should override prop
      readonly: false
    });
  });

  it('should read a nested field with sync errors', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        baz: {
          value: 'bar'
        }
      }
    }, 'foo.baz', undefined, fields, {
      foo: {
        baz: 'bazError'
      }
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'bazError',
      initialValue: '',
      readonly: false
    });
  });

  it('should update a nested field', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        baz: {
          value: 'bar'
        }
      }
    }, 'foo.baz', undefined, fields, {
      foo: {
        baz: 'bazError'
      }
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'bazError',
      initialValue: '',
      readonly: false
    });
    var beforeFoo = fields.foo;
    var beforeField = fields.foo.baz;
    (0, _readField2.default)({
      foo: {
        baz: {
          value: 'barNew'
        }
      }
    }, 'foo.baz', undefined, fields, {
      foo: {
        baz: 'bazError'
      }
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'barNew',
      dirty: true,
      touched: false,
      visited: false,
      error: 'bazError',
      initialValue: '',
      readonly: false
    });
    var afterFoo = fields.foo;
    var afterField = fields.foo.baz;
    (0, _expect2.default)(beforeFoo).toNotBe(afterFoo); // field container instance should be same
    (0, _expect2.default)(beforeField).toNotBe(afterField); // field instance should be different
  });

  it('should initialize an array field', function () {
    var fields = {};
    (0, _readField2.default)({}, 'foo[]', undefined, fields, {}, undefined, false, defaultProps);
    (0, _expect2.default)(fields.foo).toBeA('array');
    (0, _expect2.default)(fields.foo[0]).toBe(undefined);
  });

  it('should read an array field', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: [{ value: 'bar' }, { value: 'baz' }]
    }, 'foo[]', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
    (0, _expect2.default)(fields.foo[2]).toBe(undefined);
  });

  it('should read an array field with an initial value', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: [{ value: 'bar' }, { value: 'baz' }]
    }, 'foo[]', undefined, fields, {}, undefined, false, _extends({}, defaultProps, {
      initialValues: {
        foo: ['cat1', 'cat2']
      }
    }));
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'cat1',
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'cat2',
      readonly: false
    });
  });

  it('should read an array field with sync errors', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: [{ value: 'bar' }, { value: 'baz' }]
    }, 'foo[]', undefined, fields, {
      foo: ['error1', 'error2']
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error1',
      initialValue: '',
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error2',
      initialValue: '',
      readonly: false
    });
  });

  it('should update an array field', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: [{ value: 'bar' }, { value: 'baz' }]
    }, 'foo[]', undefined, fields, {
      foo: ['error1', 'error2']
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error1',
      initialValue: '',
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error2',
      initialValue: '',
      readonly: false
    });
    var beforeArray = fields.foo;
    var before1 = fields.foo[0];
    var before2 = fields.foo[1];
    (0, _readField2.default)({
      foo: [{ value: 'barNew' }, { value: 'bazNew' }]
    }, 'foo[]', undefined, fields, {
      foo: ['error1', 'error2']
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'barNew',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error1',
      initialValue: '',
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'bazNew',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error2',
      initialValue: '',
      readonly: false
    });
    var afterArray = fields.foo;
    var after1 = fields.foo[0];
    var after2 = fields.foo[1];
    (0, _expect2.default)(beforeArray).toBe(afterArray); // array should be same instance
    (0, _expect2.default)(before1).toNotBe(after1); // field instance should be different
    (0, _expect2.default)(before2).toNotBe(after2); // field instance should be different
  });

  it('should allow an array field to add a value', function () {
    var spy = (0, _expect.createSpy)();
    var fields = {};
    (0, _readField2.default)({
      foo: [{ value: 'bar' }, { value: 'baz' }]
    }, 'foo[]', undefined, fields, {}, undefined, false, _extends({}, defaultProps, {
      addArrayValue: spy
    }));
    fields.foo.addField('rabbit');
    (0, _expect2.default)(spy).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'rabbit', undefined, []);
  });

  it('should allow an array field to add a deeply nested value', function () {
    var spy = (0, _expect.createSpy)();
    var fields = {};
    (0, _readField2.default)({
      foo: [{
        bar: [{ baz: 'foo[0].bar[0].baz' }, { baz: 'foo[0].bar[1].baz' }]
      }, {
        bar: [{ baz: 'foo[1].bar[0].baz' }, { baz: 'foo[1].bar[1].baz' }]
      }]
    }, 'foo[]', undefined, fields, {}, undefined, false, _extends({}, defaultProps, {
      addArrayValue: spy,
      fields: ['foo[].bar[].baz']
    }));
    fields.foo.addField('rabbit');
    (0, _expect2.default)(spy).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'rabbit', undefined, ['bar[].baz']);
  });

  it('should allow an array field to remove a value', function () {
    var spy = (0, _expect.createSpy)();
    var fields = {};
    (0, _readField2.default)({
      foo: [{ value: 'bar' }, { value: 'baz' }]
    }, 'foo[]', undefined, fields, {}, undefined, false, _extends({}, defaultProps, {
      removeArrayValue: spy
    }));
    fields.foo.removeField(1);
    (0, _expect2.default)(spy).toHaveBeenCalled().toHaveBeenCalledWith('foo', 1);
  });

  it('should remove array field when it is no longer in the store', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: [{ value: 'bar' }, { value: 'baz' }]
    }, 'foo[]', undefined, fields, {}, undefined, false, defaultProps);
    (0, _expect2.default)(fields.foo.length).toBe(2);
    (0, _expect2.default)(fields.foo[0].value).toBe('bar');
    (0, _expect2.default)(fields.foo[1].value).toBe('baz');
    (0, _readField2.default)({
      foo: [{ value: 'bar' }]
    }, 'foo[]', undefined, fields, {}, undefined, false, defaultProps);
    (0, _expect2.default)(fields.foo.length).toBe(1);
    (0, _expect2.default)(fields.foo[0].value).toBe('bar');
  });

  it('should initialize a mixed field with empty state', function () {
    var fields = {};
    (0, _readField2.default)({}, 'pig.foo[].dog.cat[].rat', undefined, fields, {}, undefined, false, defaultProps);
    (0, _expect2.default)(fields.pig).toBeA('object');
    (0, _expect2.default)(fields.pig.foo).toBeA('array');
    (0, _expect2.default)(fields.pig.foo[0]).toBe(undefined);
  });

  it('should read a mixed field', function () {
    var fields = {};
    (0, _readField2.default)({
      pig: {
        foo: [{
          dog: {
            cat: [{
              rat: {
                value: 'hello' // that's deep, baby!
              }
            }]
          }
        }]
      }
    }, 'pig.foo[].dog.cat[].rat', undefined, fields, {}, undefined, false, defaultProps);
    (0, _expect2.default)(fields.pig).toBeA('object');
    (0, _expect2.default)(fields.pig.foo).toBeA('array');
    (0, _expect2.default)(fields.pig.foo[0].dog).toBeA('object');
    (0, _expect2.default)(fields.pig.foo[0].dog.cat).toBeA('array');
    (0, _expect2.default)(fields.pig.foo[0].dog.cat[0]).toBeA('object');
    (0, _expect2.default)(fields.pig.foo[0].dog.cat[0].rat).toBeA('object');
    expectField({
      field: fields.pig.foo[0].dog.cat[0].rat,
      name: 'pig.foo[0].dog.cat[0].rat',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
  });

  it('should read an array field with an initial value', function () {
    var fields = {};
    (0, _readField2.default)({
      pig: {
        foo: [{
          dog: {
            cat: [{
              rat: {
                value: 'hello'
              }
            }]
          }
        }]
      }
    }, 'pig.foo[].dog.cat[].rat', undefined, fields, {}, undefined, false, _extends({}, defaultProps, {
      initialValues: {
        pig: {
          foo: [{
            dog: {
              cat: [{ rat: 'initVal' }]
            }
          }]
        }
      }
    }));
    expectField({
      field: fields.pig.foo[0].dog.cat[0].rat,
      name: 'pig.foo[0].dog.cat[0].rat',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'initVal',
      readonly: false
    });
  });

  it('should read a mixed field with sync errors', function () {
    var fields = {};
    (0, _readField2.default)({
      pig: {
        foo: [{
          dog: {
            cat: [{
              rat: {
                value: 'hello'
              }
            }]
          }
        }]
      }
    }, 'pig.foo[].dog.cat[].rat', undefined, fields, {
      pig: {
        foo: [{
          dog: {
            cat: [{ rat: 'syncError' }]
          }
        }]
      }
    }, undefined, false, defaultProps);
    expectField({
      field: fields.pig.foo[0].dog.cat[0].rat,
      name: 'pig.foo[0].dog.cat[0].rat',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: 'syncError',
      initialValue: '',
      readonly: false
    });
  });

  it('should allow an array value', function () {
    var fields = {};
    (0, _readField2.default)({
      foo: {
        value: [1, 2]
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: [1, 2],
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false
    });
  });

  it('should not provide mutators when readonly', function () {
    var fields = {};
    (0, _readField2.default)({}, 'foo', undefined, fields, {}, undefined, false, _extends({}, defaultProps, {
      readonly: true
    }));
    var field = fields.foo;
    (0, _expect2.default)(field.onBlur).toNotExist();
    (0, _expect2.default)(field.onChange).toNotExist();
    (0, _expect2.default)(field.onDragStart).toNotExist();
    (0, _expect2.default)(field.onDrop).toNotExist();
    (0, _expect2.default)(field.onFocus).toNotExist();
    (0, _expect2.default)(field.onUpdate).toNotExist();
  });
});