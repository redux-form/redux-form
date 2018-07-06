'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _redux = require('redux');

var _reducer = require('../reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _fieldValue = require('../fieldValue');

var _createReduxForm = require('../createReduxForm');

var _createReduxForm2 = _interopRequireDefault(_createReduxForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-multi-comp:0 */


var createRestorableSpy = function createRestorableSpy(fn) {
  return (0, _expect.createSpy)(fn, function restore() {
    this.calls = [];
  });
};

describe('createReduxForm', function () {
  var reduxForm = (0, _createReduxForm2.default)(false, _react2.default, _reactRedux.connect);
  var makeStore = function makeStore() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (0, _redux.createStore)((0, _redux.combineReducers)({
      form: _reducer2.default
    }), { form: initialState });
  };

  it('should return a decorator function', function () {
    (0, _expect2.default)(reduxForm).toBeA('function');
  });

  var Form = function (_Component) {
    _inherits(Form, _Component);

    function Form() {
      _classCallCheck(this, Form);

      return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Form.prototype.render = function render() {
      return _react2.default.createElement('div', null);
    };

    return Form;
  }(_react.Component);

  var expectField = function expectField(_ref) {
    var field = _ref.field,
        name = _ref.name,
        value = _ref.value,
        initial = _ref.initial,
        valid = _ref.valid,
        dirty = _ref.dirty,
        error = _ref.error,
        touched = _ref.touched,
        visited = _ref.visited,
        readonly = _ref.readonly,
        autofilled = _ref.autofilled;

    (0, _expect2.default)(field).toBeA('object');
    (0, _expect2.default)(field.name).toBe(name);
    (0, _expect2.default)(field.value).toEqual(value);
    if (readonly) {
      (0, _expect2.default)(field.autofill).toNotExist();
      (0, _expect2.default)(field.onBlur).toNotExist();
      (0, _expect2.default)(field.onChange).toNotExist();
      (0, _expect2.default)(field.onDragStart).toNotExist();
      (0, _expect2.default)(field.onDrop).toNotExist();
      (0, _expect2.default)(field.onFocus).toNotExist();
      (0, _expect2.default)(field.onUpdate).toNotExist();
    } else {
      (0, _expect2.default)(field.autofill).toBeA('function');
      (0, _expect2.default)(field.onBlur).toBeA('function');
      (0, _expect2.default)(field.onChange).toBeA('function');
      (0, _expect2.default)(field.onDragStart).toBeA('function');
      (0, _expect2.default)(field.onDrop).toBeA('function');
      (0, _expect2.default)(field.onFocus).toBeA('function');
      (0, _expect2.default)(field.onUpdate).toBeA('function');
    }
    (0, _expect2.default)(field.initialValue).toEqual(initial);
    (0, _expect2.default)(field.valid).toBe(valid);
    (0, _expect2.default)(field.invalid).toBe(!valid);
    (0, _expect2.default)(field.dirty).toBe(dirty);
    (0, _expect2.default)(field.pristine).toBe(!dirty);
    (0, _expect2.default)(field.error).toEqual(error);
    (0, _expect2.default)(field.touched).toBe(touched);
    (0, _expect2.default)(field.visited).toBe(visited);
    if (autofilled) {
      (0, _expect2.default)(field.autofilled).toBe(autofilled);
    } else {
      (0, _expect2.default)(autofilled in field).toBe(false);
    }
  };

  it('should render without error', function () {
    var store = makeStore();
    (0, _expect2.default)(function () {
      var Decorated = reduxForm({
        form: 'testForm',
        fields: ['foo', 'bar']
      })(Form);
      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(Decorated, null)
      ));
    }).toNotThrow();
  });

  it('should pass fields as props', function () {
    var store = makeStore();
    var Decorated = reduxForm({
      form: 'testForm',
      fields: ['foo', 'bar']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);
    (0, _expect2.default)(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should initialize field values', function () {
    var store = makeStore();
    var Decorated = reduxForm({
      form: 'testForm',
      fields: ['foo', 'bar']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);
    (0, _expect2.default)(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: 'fooValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: 'barValue',
      initial: 'barValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and autofilled and NOT touch field on autofill', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.autofill('fooValue');

    (0, _expect2.default)(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false,
      autofilled: true
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and touch field on blur', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('fooValue');

    (0, _expect2.default)(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: true,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and NOT touch field on blur if touchOnBlur is disabled', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      touchOnBlur: false
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('fooValue');

    (0, _expect2.default)(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and NOT touch field on change', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onChange('fooValue');

    (0, _expect2.default)(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and touch field on change if touchOnChange is enabled', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      touchOnChange: true
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onChange('fooValue');

    (0, _expect2.default)(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: true,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set visited field on focus', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    (0, _expect2.default)(stub.props.active).toBe(undefined);

    stub.props.fields.foo.onFocus();

    (0, _expect2.default)(stub.props.active).toBe('foo');

    (0, _expect2.default)(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: true,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set dirty when field changes', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: 'fooValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.foo.onChange('fooValue!');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue!',
      initial: 'fooValue',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set dirty when and array field changes', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['children[].name']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { children: [{ name: 'Tom' }, { name: 'Jerry' }] } })
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);
    (0, _expect2.default)(stub.props.fields.children).toBeA('array');
    (0, _expect2.default)(stub.props.fields.children.length).toBe(2);

    expectField({
      field: stub.props.fields.children[0].name,
      name: 'children[0].name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.children[1].name,
      name: 'children[1].name',
      value: 'Jerry',
      initial: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.children[0].name.onChange('Tim');

    expectField({
      field: stub.props.fields.children[0].name,
      name: 'children[0].name',
      value: 'Tim',
      initial: 'Tom',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.children[1].name,
      name: 'children[1].name',
      value: 'Jerry',
      initial: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should delete autofilled when field changes', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.autofill('fooValue');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false,
      autofilled: true
    });

    stub.props.fields.foo.onChange('fooValue!');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue!',
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should trigger sync error on change that invalidates value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      validate: function validate(values) {
        var errors = {};
        if (values.foo && values.foo.length > 8) {
          errors.foo = 'Too long';
        }
        if (!values.bar) {
          errors.bar = 'Required';
        }
        return errors;
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: 'fooValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: 'barValue',
      initial: 'barValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    (0, _expect2.default)(stub.props.valid).toBe(true);
    (0, _expect2.default)(stub.props.invalid).toBe(false);
    (0, _expect2.default)(stub.props.errors).toEqual({});

    stub.props.fields.foo.onChange('fooValue!');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue!',
      initial: 'fooValue',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.bar.onChange('');

    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: 'barValue',
      valid: false,
      dirty: true,
      error: 'Required',
      touched: false,
      visited: false,
      readonly: false
    });

    (0, _expect2.default)(stub.props.valid).toBe(false);
    (0, _expect2.default)(stub.props.invalid).toBe(true);
    (0, _expect2.default)(stub.props.errors).toEqual({
      foo: 'Too long',
      bar: 'Required'
    });
  });

  it('should trigger sync error on change that invalidates nested value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo.bar'],
      validate: function validate(values) {
        var errors = {};
        if (values.foo.bar && values.foo.bar.length > 8) {
          errors.foo = { bar: 'Too long' };
        }
        return errors;
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { foo: { bar: 'fooBar' } } })
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo.bar,
      name: 'foo.bar',
      value: 'fooBar',
      initial: 'fooBar',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    (0, _expect2.default)(stub.props.valid).toBe(true);
    (0, _expect2.default)(stub.props.invalid).toBe(false);
    (0, _expect2.default)(stub.props.errors).toEqual({});

    stub.props.fields.foo.bar.onChange('fooBarBaz');

    expectField({
      field: stub.props.fields.foo.bar,
      name: 'foo.bar',
      value: 'fooBarBaz',
      initial: 'fooBar',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    (0, _expect2.default)(stub.props.valid).toBe(false);
    (0, _expect2.default)(stub.props.invalid).toBe(true);
    (0, _expect2.default)(stub.props.errors).toEqual({
      foo: {
        bar: 'Too long'
      }
    });
  });

  it('should trigger sync error on change that invalidates array value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo[]', 'bar[].name'],
      validate: function validate(values) {
        var errors = {};
        if (values.foo && values.foo.length && values.foo[0] && values.foo[0].length > 8) {
          errors.foo = ['Too long'];
        }
        if (values.bar && values.bar.length && values.bar[0] && values.bar[0].name === 'Ralphie') {
          errors.bar = [{ name: 'You\'ll shoot your eye out, kid!' }];
        }
        return errors;
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { foo: ['fooBar'], bar: [{ name: '' }] } })
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo[0],
      name: 'foo[0]',
      value: 'fooBar',
      initial: 'fooBar',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    expectField({
      field: stub.props.fields.bar[0].name,
      name: 'bar[0].name',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    (0, _expect2.default)(stub.props.valid).toBe(true);
    (0, _expect2.default)(stub.props.invalid).toBe(false);
    (0, _expect2.default)(stub.props.errors).toEqual({});

    stub.props.fields.foo[0].onChange('fooBarBaz');

    expectField({
      field: stub.props.fields.foo[0],
      name: 'foo[0]',
      value: 'fooBarBaz',
      initial: 'fooBar',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.bar[0].name.onChange('Ralphie');

    expectField({
      field: stub.props.fields.bar[0].name,
      name: 'bar[0].name',
      value: 'Ralphie',
      initial: '',
      valid: false,
      dirty: true,
      error: 'You\'ll shoot your eye out, kid!',
      touched: false,
      visited: false,
      readonly: false
    });

    (0, _expect2.default)(stub.props.valid).toBe(false);
    (0, _expect2.default)(stub.props.invalid).toBe(true);
    (0, _expect2.default)(stub.props.errors).toEqual({
      foo: ['Too long'],
      bar: [{ name: 'You\'ll shoot your eye out, kid!' }]
    });
  });

  it('should call destroy on unmount', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar']
    })(Form);

    var div = document.createElement('div');
    _reactDom2.default.render(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ), div);
    var before = store.getState();
    (0, _expect2.default)(before.form).toBeA('object');
    (0, _expect2.default)(before.form[form]).toBeA('object');
    (0, _expect2.default)(before.form[form].foo).toBeA('object');
    (0, _expect2.default)(before.form[form].bar).toBeA('object');

    _reactDom2.default.unmountComponentAtNode(div);

    var after = store.getState();
    (0, _expect2.default)(after.form).toBeA('object');
    (0, _expect2.default)(after.form[form]).toNotExist();
  });

  it('should NOT call destroy on unmount if destroyOnUnmount is disabled', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      destroyOnUnmount: false
    })(Form);

    var div = document.createElement('div');
    _reactDom2.default.render(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { foo: 'fooValue', bar: 'barValue' } })
    ), div);
    var before = store.getState();
    (0, _expect2.default)(before.form).toBeA('object');
    (0, _expect2.default)(before.form[form]).toBeA('object');
    (0, _expect2.default)(before.form[form].foo).toBeA('object');
    (0, _expect2.default)(before.form[form].bar).toBeA('object');

    _reactDom2.default.unmountComponentAtNode(div);

    var after = store.getState();
    (0, _expect2.default)(after.form).toBeA('object');
    (0, _expect2.default)(after.form[form]).toBeA('object');
    (0, _expect2.default)(after.form[form].foo).toBeA('object');
    (0, _expect2.default)(after.form[form].bar).toBeA('object');
  });

  it('should hoist statics', function () {
    var FormWithStatics = function (_Component2) {
      _inherits(FormWithStatics, _Component2);

      function FormWithStatics() {
        _classCallCheck(this, FormWithStatics);

        return _possibleConstructorReturn(this, _Component2.apply(this, arguments));
      }

      FormWithStatics.prototype.render = function render() {
        return _react2.default.createElement('div', null);
      };

      return FormWithStatics;
    }(_react.Component);

    FormWithStatics.someStatic1 = 'cat';
    FormWithStatics.someStatic2 = 42;

    var Decorated = reduxForm({
      form: 'testForm',
      fields: ['foo', 'bar']
    })(FormWithStatics);

    (0, _expect2.default)(Decorated.someStatic1).toBe('cat');
    (0, _expect2.default)(Decorated.someStatic2).toBe(42);
  });

  it('should not provide mutators when readonly', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: true
    });

    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: true
    });
  });

  it('should initialize an array field', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['children[].name'],
      initialValues: {
        children: [{ name: 'Tom' }, { name: 'Jerry' }]
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.children[0].name,
      name: 'children[0].name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });

    expectField({
      field: stub.props.fields.children[1].name,
      name: 'children[1].name',
      value: 'Jerry',
      initial: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should call onSubmit prop', function (done) {
    var submit = function submit(values) {
      (0, _expect2.default)(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      done();
    };

    var FormComponent = function (_Component3) {
      _inherits(FormComponent, _Component3);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, _Component3.apply(this, arguments));
      }

      FormComponent.prototype.render = function render() {
        return _react2.default.createElement('form', { onSubmit: this.props.handleSubmit });
      };

      return FormComponent;
    }(_react.Component);

    FormComponent.propTypes = {
      handleSubmit: _react.PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { onSubmit: submit })
    ));
    var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'form');

    _reactAddonsTestUtils2.default.Simulate.submit(formElement);
  });

  it('should call async onSubmit prop', function (done) {
    var submit = function submit(values) {
      (0, _expect2.default)(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, 100);
      }).then(done);
    };

    var FormComponent = function (_Component4) {
      _inherits(FormComponent, _Component4);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, _Component4.apply(this, arguments));
      }

      FormComponent.prototype.render = function render() {
        return _react2.default.createElement('form', { onSubmit: this.props.handleSubmit });
      };

      return FormComponent;
    }(_react.Component);

    FormComponent.propTypes = {
      handleSubmit: _react.PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { onSubmit: submit })
    ));
    var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'form');

    _reactAddonsTestUtils2.default.Simulate.submit(formElement);
  });

  it('should NOT call async validation if form is pristine and initialized', function () {
    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo'],
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('dog');
    (0, _expect2.default)(asyncValidate).toNotHaveBeenCalled();
  });

  it('should call async validation if form is dirty and initialized', function () {
    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo'],
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('bear');
    (0, _expect2.default)(asyncValidate).toHaveBeenCalled();
  });

  it('should call async validation if form is pristine and NOT initialized', function () {
    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur();
    (0, _expect2.default)(asyncValidate).toHaveBeenCalled();
  });

  it('should call async validation for matching array field', function () {
    var store = makeStore({
      testForm: {
        foo: [(0, _fieldValue.makeFieldValue)({ value: 'dog' }), (0, _fieldValue.makeFieldValue)({ value: 'cat' })]
      }
    });
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo[].name'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo[].name']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo[0].name.onBlur();
    (0, _expect2.default)(asyncValidate).toHaveBeenCalled();
  });

  it('should call async validation on submit even if pristine and initialized', function () {
    var submit = (0, _expect.createSpy)();

    var FormComponent = function (_Component5) {
      _inherits(FormComponent, _Component5);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, _Component5.apply(this, arguments));
      }

      FormComponent.prototype.render = function render() {
        return _react2.default.createElement('form', { onSubmit: this.props.handleSubmit(submit) });
      };

      return FormComponent;
    }(_react.Component);

    FormComponent.propTypes = {
      handleSubmit: _react.PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no dogs allowed' };
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo'],
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(FormComponent);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'form');

    _reactAddonsTestUtils2.default.Simulate.submit(formElement);

    (0, _expect2.default)(asyncValidate).toHaveBeenCalled();
    (0, _expect2.default)(submit).toNotHaveBeenCalled();
  });

  it('should call async validation if form is pristine and initialized but alwaysAsyncValidate is true', function () {
    var store = makeStore();
    var form = 'testForm';
    var errorValue = { foo: 'no bears allowed' };
    var asyncValidate = (0, _expect.createSpy)().andReturn(Promise.reject(errorValue));
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      asyncValidate: asyncValidate,
      asyncBlurFields: ['foo'],
      alwaysAsyncValidate: true,
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('dog');
    (0, _expect2.default)(asyncValidate).toHaveBeenCalled();
  });

  it('should call submit function passed to handleSubmit', function (done) {
    var submit = function submit(values) {
      (0, _expect2.default)(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      done();
    };

    var FormComponent = function (_Component6) {
      _inherits(FormComponent, _Component6);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, _Component6.apply(this, arguments));
      }

      FormComponent.prototype.render = function render() {
        return _react2.default.createElement('form', { onSubmit: this.props.handleSubmit(submit) });
      };

      return FormComponent;
    }(_react.Component);

    FormComponent.propTypes = {
      handleSubmit: _react.PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'form');

    _reactAddonsTestUtils2.default.Simulate.submit(formElement);
  });

  it('should call submit function passed to async handleSubmit', function (done) {
    var submit = function submit(values) {
      (0, _expect2.default)(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, 100);
      }).then(done);
    };

    var FormComponent = function (_Component7) {
      _inherits(FormComponent, _Component7);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, _Component7.apply(this, arguments));
      }

      FormComponent.prototype.render = function render() {
        return _react2.default.createElement('form', { onSubmit: this.props.handleSubmit(submit) });
      };

      return FormComponent;
    }(_react.Component);

    FormComponent.propTypes = {
      handleSubmit: _react.PropTypes.func.isRequired
    };

    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var formElement = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'form');

    _reactAddonsTestUtils2.default.Simulate.submit(formElement);
  });

  it('should initialize a non-array field with an array value and let it read it back', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['children'],
      initialValues: {
        children: [1, 2]
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [1, 2],
      initial: [1, 2],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should initialize an array field with an array value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['colors[]'],
      initialValues: {
        colors: ['red', 'blue']
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    (0, _expect2.default)(stub.props.fields.colors).toBeA('array');
    (0, _expect2.default)(stub.props.fields.colors.length).toBe(2);
    expectField({
      field: stub.props.fields.colors[0],
      name: 'colors[0]',
      value: 'red',
      initial: 'red',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.colors[1],
      name: 'colors[1]',
      value: 'blue',
      initial: 'blue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should initialize a deep array field with values', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['users[].name', 'users[].age'],
      initialValues: {
        users: [{
          name: 'Bob',
          age: 27
        }]
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    (0, _expect2.default)(stub.props.fields.users).toBeA('array');
    (0, _expect2.default)(stub.props.fields.users.length).toBe(1);
    (0, _expect2.default)(stub.props.fields.users[0]).toBeA('object');
    expectField({
      field: stub.props.fields.users[0].name,
      name: 'users[0].name',
      value: 'Bob',
      initial: 'Bob',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.users[0].age,
      name: 'users[0].age',
      value: 27,
      initial: 27,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should add array values with defaults', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['users[].name', 'users[].age']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    (0, _expect2.default)(stub.props.fields.users).toBeA('array');
    (0, _expect2.default)(stub.props.fields.users.length).toBe(0);
    (0, _expect2.default)(stub.props.fields.users.addField).toBeA('function');

    var before = stub.props.fields.users;

    // add field
    stub.props.fields.users.addField({ name: 'Bob', age: 27 });

    // check field
    (0, _expect2.default)(stub.props.fields.users.length).toBe(1);
    (0, _expect2.default)(stub.props.fields.users[0]).toBeA('object');
    expectField({
      field: stub.props.fields.users[0].name,
      name: 'users[0].name',
      value: 'Bob',
      initial: 'Bob',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.users[0].age,
      name: 'users[0].age',
      value: 27,
      initial: 27,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    var after = stub.props.fields.users;
    (0, _expect2.default)(after).toNotBe(before); // should be a new instance

    // check state
    (0, _expect2.default)(store.getState().form.testForm.users).toBeA('array');
    (0, _expect2.default)(store.getState().form.testForm.users.length).toBe(1);
    (0, _expect2.default)(store.getState().form.testForm.users[0].name).toEqual({
      initial: 'Bob',
      value: 'Bob'
    });
    (0, _expect2.default)(store.getState().form.testForm.users[0].age).toEqual({
      initial: 27,
      value: 27
    });
  });

  // Test to demonstrate bug: https://github.com/erikras/redux-form/issues/630
  it('should add array values when root is not an array', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['acknowledgements.items[].number', 'acknowledgements.items[].name', 'acknowledgements.show']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    (0, _expect2.default)(stub.props.fields.acknowledgements).toBeA('object');
    (0, _expect2.default)(stub.props.fields.acknowledgements.items).toBeA('array');
    (0, _expect2.default)(stub.props.fields.acknowledgements.items.length).toBe(0);
    (0, _expect2.default)(stub.props.fields.acknowledgements.items.addField).toBeA('function');

    // add field
    stub.props.fields.acknowledgements.items.addField({
      number: 1,
      name: 'foo'
    });

    // check field
    (0, _expect2.default)(stub.props.fields.acknowledgements.items.length).toBe(1);
    (0, _expect2.default)(stub.props.fields.acknowledgements.items[0]).toBeA('object');
    expectField({
      field: stub.props.fields.acknowledgements.items[0].number,
      name: 'acknowledgements.items[0].number',
      value: 1,
      initial: 1,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.acknowledgements.items[0].name,
      name: 'acknowledgements.items[0].name',
      value: 'foo',
      initial: 'foo',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  // Test to demonstrate bug: https://github.com/erikras/redux-form/issues/468
  it('should add array values with DEEP defaults', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['proposals[].arrival', 'proposals[].departure', 'proposals[].note', 'proposals[].rooms[].name', 'proposals[].rooms[].adults', 'proposals[].rooms[].children']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    (0, _expect2.default)(stub.props.fields.proposals).toBeA('array');
    (0, _expect2.default)(stub.props.fields.proposals.length).toBe(0);
    (0, _expect2.default)(stub.props.fields.proposals.addField).toBeA('function');

    // add field
    var today = new Date();
    stub.props.fields.proposals.addField({
      arrival: today,
      departure: today,
      note: '',
      rooms: [{
        name: 'Room 1',
        adults: 2,
        children: 0
      }]
    });

    stub.props.fields.proposals[0].rooms.addField({
      name: 'Room 2',
      adults: 0,
      children: 2
    });

    // check field
    (0, _expect2.default)(stub.props.fields.proposals.length).toBe(1);
    (0, _expect2.default)(stub.props.fields.proposals[0]).toBeA('object');
    expectField({
      field: stub.props.fields.proposals[0].arrival,
      name: 'proposals[0].arrival',
      value: today,
      initial: today,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].departure,
      name: 'proposals[0].departure',
      value: today,
      initial: today,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].note,
      name: 'proposals[0].note',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[0].name,
      name: 'proposals[0].rooms[0].name',
      value: 'Room 1',
      initial: 'Room 1',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[0].adults,
      name: 'proposals[0].rooms[0].adults',
      value: 2,
      initial: 2,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[0].children,
      name: 'proposals[0].rooms[0].children',
      value: 0,
      initial: 0,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[1].name,
      name: 'proposals[0].rooms[1].name',
      value: 'Room 2',
      initial: 'Room 2',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[1].adults,
      name: 'proposals[0].rooms[1].adults',
      value: 0,
      initial: 0,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[0].rooms[1].children,
      name: 'proposals[0].rooms[1].children',
      value: 2,
      initial: 2,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  // Test to demonstrate https://github.com/erikras/redux-form/issues/612
  //it('should work with a root-level array field', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['tags[]']
  //  })(Form);
  //  const dom = TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated/>
  //    </Provider>
  //  );
  //  const stub = TestUtils.findRenderedComponentWithType(dom, Form);
  //
  //  expect(stub.props.fields.tags).toBeA('array');
  //  expect(stub.props.fields.tags.length).toBe(0);
  //  expect(stub.props.fields.tags.addField).toBeA('function');
  //
  //  // add field
  //  stub.props.fields.proposals.addField('foo');
  //
  //  // check field
  //  expect(stub.props.fields.tags.length).toBe(1);
  //  expect(stub.props.fields.tags[0]).toBeA('object');
  //  expectField({
  //    field: stub.props.fields.tags[0],
  //    name: 'tags[0]',
  //    value: 'foo',
  //    initial: 'foo',
  //    valid: true,
  //    dirty: false,
  //    error: undefined,
  //    touched: false,
  //    visited: false
  //  });
  //});

  it('should initialize an array field, blowing away existing value', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['children']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    // set value
    stub.props.fields.children.onChange([1, 2]);
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [1, 2],
      initial: '',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // initialize new values
    stub.props.initializeForm({ children: [3, 4] });
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [3, 4],
      initial: [3, 4],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    (0, _expect2.default)(store.getState().form.testForm.children).toEqual({
      initial: [3, 4],
      value: [3, 4]
    });
    // reset form to newly initialized values
    stub.props.resetForm();
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [3, 4],
      initial: [3, 4],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should only initialize on mount once', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['name']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { name: 'Bob' } })
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Bob',
      initial: 'Bob',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    (0, _expect2.default)(store.getState().form.testForm.name).toEqual({
      initial: 'Bob',
      value: 'Bob'
    });
    // set value
    stub.props.fields.name.onChange('Dan');
    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Dan',
      initial: 'Bob',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    (0, _expect2.default)(store.getState().form.testForm.name).toEqual({
      initial: 'Bob',
      value: 'Dan'
    });

    // should NOT dispatch INITIALIZE this time
    var dom2 = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { name: 'Bob' } })
    ));
    var stub2 = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom2, Form);
    // check that value is unchanged
    expectField({
      field: stub2.props.fields.name,
      name: 'name',
      value: 'Dan',
      initial: 'Bob',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    (0, _expect2.default)(store.getState().form.testForm.name).toEqual({
      initial: 'Bob',
      value: 'Dan'
    });

    // manually initialize new values
    stub2.props.initializeForm({ name: 'Tom' });
    // check value
    expectField({
      field: stub2.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    (0, _expect2.default)(store.getState().form.testForm.name).toEqual({
      initial: 'Tom',
      value: 'Tom'
    });
  });

  it('should allow initialization from action', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['name']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // manually initialize new values
    stub.props.initializeForm({ name: 'Tom' });
    // check state
    (0, _expect2.default)(store.getState().form.testForm.name).toEqual({
      initial: 'Tom',
      value: 'Tom'
    });
    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should allow deep sync validation error values', function () {
    var store = makeStore();
    var form = 'testForm';
    var deepError = {
      some: 'object with',
      deep: 'values'
    };
    var Decorated = reduxForm({
      form: form,
      fields: ['name'],
      validate: function validate() {
        return { name: deepError };
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: '',
      initial: '',
      valid: false,
      dirty: false,
      error: deepError,
      touched: false,
      visited: false
    });
  });

  it('should allow deep async validation error values', function () {
    var store = makeStore();
    var form = 'testForm';
    var deepError = {
      some: 'object with',
      deep: 'values'
    };
    var Decorated = reduxForm({
      form: form,
      fields: ['name'],
      initialValues: { name: 'Tom' },
      asyncValidate: function asyncValidate() {
        return Promise.reject({ name: deepError });
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    // check field before validation
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });

    // form must be dirty for asyncValidate()
    stub.props.fields.name.onChange('Moe');

    return stub.props.asyncValidate().then(function () {
      (0, _expect2.default)(true).toBe(false); // should not be in success block
    }, function () {
      // check state
      (0, _expect2.default)(store.getState().form.testForm.name).toEqual({
        initial: 'Tom',
        value: 'Moe',
        asyncError: deepError
      });
      // check field
      expectField({
        field: stub.props.fields.name,
        name: 'name',
        value: 'Moe',
        initial: 'Tom',
        valid: false,
        dirty: true,
        error: deepError,
        touched: false,
        visited: false
      });
    });
  });

  it('should allow deep submit validation error values', function () {
    var store = makeStore();
    var form = 'testForm';
    var deepError = {
      some: 'object with',
      deep: 'values'
    };
    var Decorated = reduxForm({
      form: form,
      fields: ['name'],
      initialValues: { name: 'Tom' },
      onSubmit: function onSubmit() {
        return Promise.reject({ name: deepError });
      }
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    // check before validation
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    return stub.props.handleSubmit().then(function () {
      // check state
      (0, _expect2.default)(store.getState().form.testForm.name).toEqual({
        initial: 'Tom',
        value: 'Tom',
        submitError: deepError,
        touched: true
      });
      // check field
      expectField({
        field: stub.props.fields.name,
        name: 'name',
        value: 'Tom',
        initial: 'Tom',
        valid: false,
        dirty: false,
        error: deepError,
        touched: true,
        visited: false
      });
    });
  });

  it('should only mutate the field that changed', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['larry', 'moe', 'curly']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    var larry = stub.props.fields.larry;
    var moe = stub.props.fields.moe;
    var curly = stub.props.fields.curly;

    moe.onChange('BONK!');

    (0, _expect2.default)(stub.props.fields.larry).toBe(larry);
    (0, _expect2.default)(stub.props.fields.moe).toNotBe(moe);
    (0, _expect2.default)(stub.props.fields.curly).toBe(curly);
  });

  it('should only change the deep field that changed', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['address.street', 'address.postalCode']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    var address = stub.props.fields.address;
    var street = stub.props.fields.address.street;
    var postalCode = stub.props.fields.address.postalCode;

    postalCode.onChange('90210');

    (0, _expect2.default)(stub.props.fields.address).toNotBe(address);
    (0, _expect2.default)(stub.props.fields.address.street).toBe(street);
    (0, _expect2.default)(stub.props.fields.address.postalCode).toNotBe(postalCode);
  });

  it('should change field tree up to array that changed', function () {
    var store = makeStore();
    var form = 'testForm';
    var Decorated = reduxForm({
      form: form,
      fields: ['contact.shipping.phones[]', 'contact.billing.phones[]']
    })(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    var contact = stub.props.fields.contact;
    var shipping = stub.props.fields.contact.shipping;
    var shippingPhones = stub.props.fields.contact.shipping.phones;
    var billing = stub.props.fields.contact.billing;
    var billingPhones = stub.props.fields.contact.billing.phones;

    shippingPhones.addField();

    (0, _expect2.default)(stub.props.fields.contact.shipping.phones).toNotBe(shippingPhones);
    (0, _expect2.default)(stub.props.fields.contact.shipping).toNotBe(shipping);
    (0, _expect2.default)(stub.props.fields.contact).toNotBe(contact);
    (0, _expect2.default)(stub.props.fields.contact.billing).toBe(billing);
    (0, _expect2.default)(stub.props.fields.contact.billing.phones).toBe(billingPhones);

    contact = stub.props.fields.contact;
    shipping = stub.props.fields.contact.shipping;
    shippingPhones = stub.props.fields.contact.shipping.phones;
    var shippingPhones0 = stub.props.fields.contact.shipping.phones[0];

    shippingPhones[0].onChange('555-1234');

    (0, _expect2.default)(stub.props.fields.contact.shipping.phones[0]).toNotBe(shippingPhones0);
    (0, _expect2.default)(stub.props.fields.contact.shipping.phones).toNotBe(shippingPhones);
    (0, _expect2.default)(stub.props.fields.contact.shipping).toNotBe(shipping);
    (0, _expect2.default)(stub.props.fields.contact).toNotBe(contact);
    (0, _expect2.default)(stub.props.fields.contact.billing).toBe(billing);
    (0, _expect2.default)(stub.props.fields.contact.billing.phones).toBe(billingPhones);
  });

  it('should not replace existing values when initialValues changes if overwriteOnInitialValuesChange is set to false', function () {
    var store = makeStore();
    var form = 'testForm';

    var Decorated = reduxForm({
      form: form,
      fields: ['firstName', 'lastName'],
      overwriteOnInitialValuesChange: false
    })(Form);

    var StatefulContainer = function (_Component8) {
      _inherits(StatefulContainer, _Component8);

      function StatefulContainer(props) {
        _classCallCheck(this, StatefulContainer);

        var _this8 = _possibleConstructorReturn(this, _Component8.call(this, props));

        _this8.starrMe = _this8.starrMe.bind(_this8);
        _this8.state = {
          beatle: { firstName: 'John', lastName: 'Lennon' }
        };
        return _this8;
      }

      StatefulContainer.prototype.starrMe = function starrMe() {
        this.setState({
          beatle: { firstName: 'Ringo', lastName: 'Starr' }
        });
      };

      StatefulContainer.prototype.render = function render() {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Decorated, { initialValues: this.state.beatle }),
          _react2.default.createElement(
            'button',
            { onClick: this.starrMe },
            'Ringo Me!'
          )
        );
      };

      return StatefulContainer;
    }(_react.Component);

    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(StatefulContainer, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    // initialized to John Lennon, pristine
    (0, _expect2.default)(stub.props.fields.firstName.value).toBe('John');
    (0, _expect2.default)(stub.props.fields.firstName.pristine).toBe(true);
    (0, _expect2.default)(stub.props.fields.lastName.value).toBe('Lennon');
    (0, _expect2.default)(stub.props.fields.lastName.pristine).toBe(true);

    // users changes to George Harrison
    stub.props.fields.firstName.onChange('George');
    stub.props.fields.lastName.onChange('Harrison');

    // values are now George Harrison
    (0, _expect2.default)(stub.props.fields.firstName.value).toBe('George');
    (0, _expect2.default)(stub.props.fields.firstName.pristine).toBe(false);
    (0, _expect2.default)(stub.props.fields.lastName.value).toBe('Harrison');
    (0, _expect2.default)(stub.props.fields.lastName.pristine).toBe(false);

    // change initialValues to Ringo Starr
    var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
    _reactAddonsTestUtils2.default.Simulate.click(button);

    // values are STILL George Harrison
    (0, _expect2.default)(stub.props.fields.firstName.value).toBe('George');
    (0, _expect2.default)(stub.props.fields.firstName.pristine).toBe(false);
    (0, _expect2.default)(stub.props.fields.lastName.value).toBe('Harrison');
    (0, _expect2.default)(stub.props.fields.lastName.pristine).toBe(false);

    // but, if we reset form
    stub.props.resetForm();

    // values now go back to Ringo Starr, pristine
    (0, _expect2.default)(stub.props.fields.firstName.value).toBe('Ringo');
    (0, _expect2.default)(stub.props.fields.firstName.pristine).toBe(true);
    (0, _expect2.default)(stub.props.fields.lastName.value).toBe('Starr');
    (0, _expect2.default)(stub.props.fields.lastName.pristine).toBe(true);
  });

  it('should replace existing values when initialValues changes', function () {
    var store = makeStore();
    var form = 'testForm';

    var Decorated = reduxForm({
      form: form,
      fields: ['firstName', 'lastName']
    })(Form);

    var StatefulContainer = function (_Component9) {
      _inherits(StatefulContainer, _Component9);

      function StatefulContainer(props) {
        _classCallCheck(this, StatefulContainer);

        var _this9 = _possibleConstructorReturn(this, _Component9.call(this, props));

        _this9.starrMe = _this9.starrMe.bind(_this9);
        _this9.state = {
          beatle: { firstName: 'John', lastName: 'Lennon' }
        };
        return _this9;
      }

      StatefulContainer.prototype.starrMe = function starrMe() {
        this.setState({
          beatle: { firstName: 'Ringo', lastName: 'Starr' }
        });
      };

      StatefulContainer.prototype.render = function render() {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Decorated, { initialValues: this.state.beatle }),
          _react2.default.createElement(
            'button',
            { onClick: this.starrMe },
            'Ringo Me!'
          )
        );
      };

      return StatefulContainer;
    }(_react.Component);

    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(StatefulContainer, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Form);

    // initialized to John Lennon, pristine
    (0, _expect2.default)(stub.props.fields.firstName.value).toBe('John');
    (0, _expect2.default)(stub.props.fields.firstName.pristine).toBe(true);
    (0, _expect2.default)(stub.props.fields.lastName.value).toBe('Lennon');
    (0, _expect2.default)(stub.props.fields.lastName.pristine).toBe(true);

    // users changes to George Harrison
    stub.props.fields.firstName.onChange('George');
    stub.props.fields.lastName.onChange('Harrison');

    // values are now George Harrison
    (0, _expect2.default)(stub.props.fields.firstName.value).toBe('George');
    (0, _expect2.default)(stub.props.fields.firstName.pristine).toBe(false);
    (0, _expect2.default)(stub.props.fields.lastName.value).toBe('Harrison');
    (0, _expect2.default)(stub.props.fields.lastName.pristine).toBe(false);

    // change initialValues to Ringo Starr
    var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
    _reactAddonsTestUtils2.default.Simulate.click(button);

    // values are now Ringo Starr, pristine
    (0, _expect2.default)(stub.props.fields.firstName.value).toBe('Ringo');
    (0, _expect2.default)(stub.props.fields.firstName.pristine).toBe(true);
    (0, _expect2.default)(stub.props.fields.lastName.value).toBe('Starr');
    (0, _expect2.default)(stub.props.fields.lastName.pristine).toBe(true);
  });

  it('should provide a submit() method to submit the form', function () {
    var store = makeStore();
    var form = 'testForm';
    var initialValues = { firstName: 'Bobby', lastName: 'Tables', age: 12 };
    var onSubmit = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var Decorated = reduxForm({
      form: form,
      fields: ['firstName', 'lastName', 'age'],
      initialValues: initialValues,
      onSubmit: onSubmit
    })(Form);

    var Container = function (_Component10) {
      _inherits(Container, _Component10);

      function Container(props) {
        _classCallCheck(this, Container);

        var _this10 = _possibleConstructorReturn(this, _Component10.call(this, props));

        _this10.submitFromParent = _this10.submitFromParent.bind(_this10);
        return _this10;
      }

      Container.prototype.submitFromParent = function submitFromParent() {
        this.refs.myForm.submit();
      };

      Container.prototype.render = function render() {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Decorated, { ref: 'myForm' }),
          _react2.default.createElement(
            'button',
            { type: 'button', onClick: this.submitFromParent },
            'Submit From Parent'
          )
        );
      };

      return Container;
    }(_react.Component);

    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Container, null)
    ));

    var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');

    (0, _expect2.default)(onSubmit).toNotHaveBeenCalled();

    _reactAddonsTestUtils2.default.Simulate.click(button);

    (0, _expect2.default)(onSubmit).toHaveBeenCalled().toHaveBeenCalledWith(initialValues, store.dispatch);
  });

  it('submitting from parent should fail if sync validation errors', function () {
    var store = makeStore();
    var form = 'testForm';
    var initialValues = { firstName: 'Bobby', lastName: 'Tables', age: 12 };
    var onSubmit = (0, _expect.createSpy)().andReturn(Promise.resolve());
    var onSubmitFail = (0, _expect.createSpy)();
    var validate = (0, _expect.createSpy)().andReturn({ firstName: 'Go to your room, Bobby.' });
    var Decorated = reduxForm({
      form: form,
      fields: ['firstName', 'lastName', 'age'],
      initialValues: initialValues,
      onSubmit: onSubmit,
      onSubmitFail: onSubmitFail,
      validate: validate
    })(Form);

    var Container = function (_Component11) {
      _inherits(Container, _Component11);

      function Container(props) {
        _classCallCheck(this, Container);

        var _this11 = _possibleConstructorReturn(this, _Component11.call(this, props));

        _this11.submitFromParent = _this11.submitFromParent.bind(_this11);
        return _this11;
      }

      Container.prototype.submitFromParent = function submitFromParent() {
        this.refs.myForm.submit();
      };

      Container.prototype.render = function render() {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Decorated, { ref: 'myForm' }),
          _react2.default.createElement(
            'button',
            { type: 'button', onClick: this.submitFromParent },
            'Submit From Parent'
          )
        );
      };

      return Container;
    }(_react.Component);

    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Container, null)
    ));

    var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');

    (0, _expect2.default)(onSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(onSubmitFail).toNotHaveBeenCalled();

    _reactAddonsTestUtils2.default.Simulate.click(button);

    (0, _expect2.default)(validate).toHaveBeenCalled();
    (0, _expect2.default)(onSubmit).toNotHaveBeenCalled();
    (0, _expect2.default)(onSubmitFail).toHaveBeenCalled();
  });

  it('should only rerender the form that changed', function () {
    var store = makeStore();
    var fooRender = createRestorableSpy().andReturn(_react2.default.createElement('div', null));
    var barRender = createRestorableSpy().andReturn(_react2.default.createElement('div', null));

    var FooForm = function (_Component12) {
      _inherits(FooForm, _Component12);

      function FooForm() {
        _classCallCheck(this, FooForm);

        return _possibleConstructorReturn(this, _Component12.apply(this, arguments));
      }

      FooForm.prototype.render = function render() {
        return fooRender();
      };

      return FooForm;
    }(_react.Component);

    var BarForm = function (_Component13) {
      _inherits(BarForm, _Component13);

      function BarForm() {
        _classCallCheck(this, BarForm);

        return _possibleConstructorReturn(this, _Component13.apply(this, arguments));
      }

      BarForm.prototype.render = function render() {
        return barRender();
      };

      return BarForm;
    }(_react.Component);

    var DecoratedFooForm = reduxForm({
      form: 'foo',
      fields: ['name']
    })(FooForm);
    var DecoratedBarForm = reduxForm({
      form: 'bar',
      fields: ['name']
    })(BarForm);

    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(DecoratedFooForm, null),
        _react2.default.createElement(DecoratedBarForm, null)
      )
    ));
    var fooStub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, FooForm);

    // first render
    (0, _expect2.default)(fooRender).toHaveBeenCalled();
    (0, _expect2.default)(barRender).toHaveBeenCalled();

    // restore spies
    fooRender.restore();
    barRender.restore();

    // change field on foo
    fooStub.props.fields.name.onChange('Tom');

    // second render: only foo form
    (0, _expect2.default)(fooRender).toHaveBeenCalled();
    (0, _expect2.default)(barRender).toNotHaveBeenCalled();
  });

  it('should only rerender the field components that change', function () {
    var store = makeStore();
    var fooRenders = 0;
    var barRenders = 0;

    var FooInput = function (_Component14) {
      _inherits(FooInput, _Component14);

      function FooInput() {
        _classCallCheck(this, FooInput);

        return _possibleConstructorReturn(this, _Component14.apply(this, arguments));
      }

      FooInput.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
      };

      FooInput.prototype.render = function render() {
        fooRenders++;
        var field = this.props.field;

        return _react2.default.createElement('input', _extends({ type: 'text' }, field));
      };

      return FooInput;
    }(_react.Component);

    FooInput.propTypes = {
      field: _react.PropTypes.object.isRequired
    };

    var BarInput = function (_Component15) {
      _inherits(BarInput, _Component15);

      function BarInput() {
        _classCallCheck(this, BarInput);

        return _possibleConstructorReturn(this, _Component15.apply(this, arguments));
      }

      BarInput.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
      };

      BarInput.prototype.render = function render() {
        barRenders++;
        var field = this.props.field;

        return _react2.default.createElement('input', _extends({ type: 'password' }, field));
      };

      return BarInput;
    }(_react.Component);

    BarInput.propTypes = {
      field: _react.PropTypes.object.isRequired
    };

    var FieldTestForm = function (_Component16) {
      _inherits(FieldTestForm, _Component16);

      function FieldTestForm() {
        _classCallCheck(this, FieldTestForm);

        return _possibleConstructorReturn(this, _Component16.apply(this, arguments));
      }

      FieldTestForm.prototype.render = function render() {
        var _props$fields = this.props.fields,
            foo = _props$fields.foo,
            bar = _props$fields.bar;

        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(FooInput, { field: foo }),
          _react2.default.createElement(BarInput, { field: bar })
        );
      };

      return FieldTestForm;
    }(_react.Component);

    FieldTestForm.propTypes = {
      fields: _react.PropTypes.object.isRequired
    };

    var DecoratedForm = reduxForm({
      form: 'fieldTest',
      fields: ['foo', 'bar']
    })(FieldTestForm);

    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(DecoratedForm, null)
    ));
    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, FieldTestForm);

    // first render
    (0, _expect2.default)(fooRenders).toBe(1);
    (0, _expect2.default)(barRenders).toBe(1);

    // change field foo
    stub.props.fields.foo.onChange('Tom');

    // second render, only foo should rerender
    (0, _expect2.default)(fooRenders).toBe(2);
    (0, _expect2.default)(barRenders).toBe(1);

    // change field bar
    stub.props.fields.bar.onChange('Jerry');

    // third render, only bar should rerender
    (0, _expect2.default)(fooRenders).toBe(2);
    (0, _expect2.default)(barRenders).toBe(2);
  });

  // Test to show bug https://github.com/erikras/redux-form/issues/550
  // ---
  // It's caused by the fact that we're no longer using the same field instance
  // throughout the lifetime of the component. Since the fields are immutable now,
  // the field.value given to createOnDragStart() no longer refers to the current
  // value.
  // ---
  //it('should drag the current value', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['name']
  //  })(Form);
  //  const dom = TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated/>
  //    </Provider>
  //  );
  //  const stub = TestUtils.findRenderedComponentWithType(dom, Form);
  //
  //  stub.props.fields.name.onChange('FOO');
  //  const setData = createSpy();
  //  stub.props.fields.name.onDragStart({dataTransfer: {setData}});
  //
  //  expect(setData)
  //    .toHaveBeenCalled()
  //    .toHaveBeenCalledWith('value', 'FOO');
  //});

  // Test to show bug https://github.com/erikras/redux-form/issues/629
  // ---
  // It's caused by the fact that RESET is just copying values from initial to value,
  // but what it needs to do is blow away the whole state tree and re-initialize it
  // with the initial values.
  // ---
  //it('resetting the form should reset array fields', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['kennel', 'dogs[].name', 'dogs[].breed']
  //  })(Form);
  //  const dom = TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated initialValues={{
  //        kennel: 'Bob\'s Dog House',
  //        dogs: [
  //          {name: 'Fido', breed: 'Pit Bull'},
  //          {name: 'Snoopy', breed: 'Beagle'},
  //          {name: 'Scooby Doo', breed: 'Great Dane'}
  //        ]
  //      }}/>
  //    </Provider>
  //  );
  //  const stub = TestUtils.findRenderedComponentWithType(dom, Form);
  //
  //  expect(stub.props.fields.dogs.length).toBe(3);
  //
  //  stub.props.fields.dogs.addField({name: 'Lassie', breed: 'Collie'});
  //
  //  expect(stub.props.fields.dogs.length).toBe(4);
  //
  //  stub.props.resetForm();
  //
  //  expect(stub.props.fields.dogs.length).toBe(3);
  //});

  // Test to show bug https://github.com/erikras/redux-form/issues/621
  // ---
  // It's caused by the fact that we are letting the initialValues prop override
  // the data from the store for the initialValue and defaultValue props, but NOT for
  // value. So the value prop does not get populated until the second render.
  // ---
  it('initial values should be present on first render', function () {
    var store = makeStore();
    var form = 'testForm';

    var InitialValuesTestForm = function (_Component17) {
      _inherits(InitialValuesTestForm, _Component17);

      function InitialValuesTestForm() {
        _classCallCheck(this, InitialValuesTestForm);

        return _possibleConstructorReturn(this, _Component17.apply(this, arguments));
      }

      InitialValuesTestForm.prototype.render = function render() {
        var mingzi = this.props.fields.mingzi;

        (0, _expect2.default)(mingzi.initialValue).toBe('Bob');
        (0, _expect2.default)(mingzi.value).toBe('Bob');
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('input', mingzi)
        );
      };

      return InitialValuesTestForm;
    }(_react.Component);

    InitialValuesTestForm.propTypes = {
      fields: _react.PropTypes.object.isRequired
    };
    var Decorated = reduxForm({
      form: form,
      fields: ['mingzi']
    })(InitialValuesTestForm);
    _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: { mingzi: 'Bob' } })
    ));
  });

  it('should change nested fields', function () {
    var lastPrevBarValue = void 0; // eslint-disable-line
    var lastNextBarValue = void 0; // eslint-disable-line

    var FormComponent = function (_Component18) {
      _inherits(FormComponent, _Component18);

      function FormComponent() {
        _classCallCheck(this, FormComponent);

        return _possibleConstructorReturn(this, _Component18.apply(this, arguments));
      }

      FormComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        /*
         console.info(
         this.props.fields.foo.bar.value,
         nextProps.fields.foo.bar.value,
         this.props.fields.foo === nextProps.fields.foo,
         this.props.fields.foo.bar === nextProps.fields.foo.bar,
         this.props.fields.foo.bar.value === nextProps.fields.foo.bar.value);
          Prints out:
          previous previous false true true
         next next false true true
         */
        lastPrevBarValue = this.props.fields.foo.bar.value;
        lastNextBarValue = nextProps.fields.foo.bar.value;
      };

      FormComponent.prototype.render = function render() {
        return _react2.default.createElement('div', null);
      };

      return FormComponent;
    }(_react.Component);

    FormComponent.propTypes = {
      fields: _react.PropTypes.object.isRequired
    };

    var store = makeStore();
    var Decorated = reduxForm({
      form: 'testForm',
      fields: ['foo.bar']
    })(FormComponent);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(Decorated, { initialValues: {
          foo: {
            bar: 'previous'
          }
        } })
    ));

    var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, FormComponent);

    var previousFields = stub.props.fields;
    var previousFoo = previousFields.foo;
    var previousFooBar = previousFields.foo.bar;
    var previousFooBarValue = previousFields.foo.bar.value;

    (0, _expect2.default)(previousFooBarValue).toBe('previous');

    stub.props.fields.foo.bar.onChange('next');

    var nextFields = stub.props.fields;
    var nextFoo = nextFields.foo;
    var nextFooBar = nextFields.foo.bar;
    var nextFooBarValue = nextFields.foo.bar.value;

    (0, _expect2.default)(nextFooBarValue).toBe('next').toNotBe(previousFooBarValue);
    (0, _expect2.default)(nextFooBar).toNotBe(previousFooBar);
    (0, _expect2.default)(nextFoo).toNotBe(previousFoo);

    // FAILS
    //expect(lastPrevBarValue).toNotEqual(lastNextBarValue);
  });
});