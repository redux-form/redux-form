'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = require('./actions');

var importedActions = _interopRequireWildcard(_actions);

var _getDisplayName = require('./getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _reducer = require('./reducer');

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _bindActionData = require('./bindActionData');

var _bindActionData2 = _interopRequireDefault(_bindActionData);

var _getValues = require('./getValues');

var _getValues2 = _interopRequireDefault(_getValues);

var _isValid = require('./isValid');

var _isValid2 = _interopRequireDefault(_isValid);

var _readFields = require('./readFields');

var _readFields2 = _interopRequireDefault(_readFields);

var _handleSubmit2 = require('./handleSubmit');

var _handleSubmit3 = _interopRequireDefault(_handleSubmit2);

var _asyncValidation = require('./asyncValidation');

var _asyncValidation2 = _interopRequireDefault(_asyncValidation);

var _silenceEvents = require('./events/silenceEvents');

var _silenceEvents2 = _interopRequireDefault(_silenceEvents);

var _silenceEvent = require('./events/silenceEvent');

var _silenceEvent2 = _interopRequireDefault(_silenceEvent);

var _wrapMapDispatchToProps = require('./wrapMapDispatchToProps');

var _wrapMapDispatchToProps2 = _interopRequireDefault(_wrapMapDispatchToProps);

var _wrapMapStateToProps = require('./wrapMapStateToProps');

var _wrapMapStateToProps2 = _interopRequireDefault(_wrapMapStateToProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Creates a HOC that knows how to create redux-connected sub-components.
 */
var createHigherOrderComponent = function createHigherOrderComponent(config, isReactNative, React, connect, WrappedComponent, mapStateToProps, mapDispatchToProps, mergeProps, options) {
  var Component = React.Component,
      PropTypes = React.PropTypes;

  return function (reduxMountPoint, formName, formKey, getFormState) {
    var ReduxForm = function (_Component) {
      _inherits(ReduxForm, _Component);

      function ReduxForm(props) {
        _classCallCheck(this, ReduxForm);

        // bind functions
        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.asyncValidate = _this.asyncValidate.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.fields = (0, _readFields2.default)(props, {}, {}, _this.asyncValidate, isReactNative);
        var submitPassback = _this.props.submitPassback;

        submitPassback(function () {
          return _this.handleSubmit();
        }); // wrapped in function to disallow params
        return _this;
      }

      ReduxForm.prototype.componentWillMount = function componentWillMount() {
        var _props = this.props,
            fields = _props.fields,
            form = _props.form,
            initialize = _props.initialize,
            initialValues = _props.initialValues;

        if (initialValues && !form._initialized) {
          initialize(initialValues, fields);
        }
      };

      ReduxForm.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (!(0, _deepEqual2.default)(this.props.fields, nextProps.fields) || !(0, _deepEqual2.default)(this.props.form, nextProps.form, { strict: true })) {
          this.fields = (0, _readFields2.default)(nextProps, this.props, this.fields, this.asyncValidate, isReactNative);
        }
        if (!(0, _deepEqual2.default)(this.props.initialValues, nextProps.initialValues)) {
          this.props.initialize(nextProps.initialValues, nextProps.fields, this.props.overwriteOnInitialValuesChange || !this.props.form._initialized);
        }
      };

      ReduxForm.prototype.componentWillUnmount = function componentWillUnmount() {
        if (config.destroyOnUnmount) {
          this.props.destroy();
        }
      };

      ReduxForm.prototype.asyncValidate = function asyncValidate(name, value) {
        var _this2 = this;

        var _props2 = this.props,
            alwaysAsyncValidate = _props2.alwaysAsyncValidate,
            asyncValidate = _props2.asyncValidate,
            dispatch = _props2.dispatch,
            fields = _props2.fields,
            form = _props2.form,
            startAsyncValidation = _props2.startAsyncValidation,
            stopAsyncValidation = _props2.stopAsyncValidation,
            validate = _props2.validate;

        var isSubmitting = !name;
        if (asyncValidate) {
          var values = (0, _getValues2.default)(fields, form);
          if (name) {
            values[name] = value;
          }
          var syncErrors = validate(values, this.props);
          var allPristine = this.fields._meta.allPristine;

          var initialized = form._initialized;

          // if blur validating, only run async validate if sync validation passes
          // and submitting (not blur validation) or form is dirty or form was never initialized
          // unless alwaysAsyncValidate is true
          var syncValidationPasses = isSubmitting || (0, _isValid2.default)(syncErrors[name]);
          if (alwaysAsyncValidate || syncValidationPasses && (isSubmitting || !allPristine || !initialized)) {
            return (0, _asyncValidation2.default)(function () {
              return asyncValidate(values, dispatch, _this2.props);
            }, startAsyncValidation, stopAsyncValidation, name);
          }
        }
      };

      ReduxForm.prototype.handleSubmit = function handleSubmit(submitOrEvent) {
        var _this3 = this;

        var _props3 = this.props,
            onSubmit = _props3.onSubmit,
            fields = _props3.fields,
            form = _props3.form;

        var check = function check(submit) {
          if (!submit || typeof submit !== 'function') {
            throw new Error('You must either pass handleSubmit() an onSubmit function or pass onSubmit as a prop');
          }
          return submit;
        };
        return !submitOrEvent || (0, _silenceEvent2.default)(submitOrEvent) ?
        // submitOrEvent is an event: fire submit
        (0, _handleSubmit3.default)(check(onSubmit), (0, _getValues2.default)(fields, form), this.props, this.asyncValidate) :
        // submitOrEvent is the submit function: return deferred submit thunk
        (0, _silenceEvents2.default)(function () {
          return (0, _handleSubmit3.default)(check(submitOrEvent), (0, _getValues2.default)(fields, form), _this3.props, _this3.asyncValidate);
        });
      };

      ReduxForm.prototype.render = function render() {
        var _this4 = this,
            _ref;

        var allFields = this.fields;

        var _props4 = this.props,
            addArrayValue = _props4.addArrayValue,
            asyncBlurFields = _props4.asyncBlurFields,
            autofill = _props4.autofill,
            blur = _props4.blur,
            change = _props4.change,
            destroy = _props4.destroy,
            focus = _props4.focus,
            fields = _props4.fields,
            form = _props4.form,
            initialValues = _props4.initialValues,
            initialize = _props4.initialize,
            onSubmit = _props4.onSubmit,
            propNamespace = _props4.propNamespace,
            reset = _props4.reset,
            removeArrayValue = _props4.removeArrayValue,
            returnRejectedSubmitPromise = _props4.returnRejectedSubmitPromise,
            startAsyncValidation = _props4.startAsyncValidation,
            startSubmit = _props4.startSubmit,
            stopAsyncValidation = _props4.stopAsyncValidation,
            stopSubmit = _props4.stopSubmit,
            submitFailed = _props4.submitFailed,
            swapArrayValues = _props4.swapArrayValues,
            touch = _props4.touch,
            untouch = _props4.untouch,
            validate = _props4.validate,
            passableProps = _objectWithoutProperties(_props4, ['addArrayValue', 'asyncBlurFields', 'autofill', 'blur', 'change', 'destroy', 'focus', 'fields', 'form', 'initialValues', 'initialize', 'onSubmit', 'propNamespace', 'reset', 'removeArrayValue', 'returnRejectedSubmitPromise', 'startAsyncValidation', 'startSubmit', 'stopAsyncValidation', 'stopSubmit', 'submitFailed', 'swapArrayValues', 'touch', 'untouch', 'validate']); // eslint-disable-line no-redeclare


        var _allFields$_meta = allFields._meta,
            allPristine = _allFields$_meta.allPristine,
            allValid = _allFields$_meta.allValid,
            errors = _allFields$_meta.errors,
            formError = _allFields$_meta.formError,
            values = _allFields$_meta.values;


        var props = {
          // State:
          active: form._active,
          asyncValidating: form._asyncValidating,
          dirty: !allPristine,
          error: formError,
          errors: errors,
          fields: allFields,
          formKey: formKey,
          invalid: !allValid,
          pristine: allPristine,
          submitting: form._submitting,
          submitFailed: form._submitFailed,
          valid: allValid,
          values: values,

          // Actions:
          asyncValidate: (0, _silenceEvents2.default)(function () {
            return _this4.asyncValidate();
          }),
          // ^ doesn't just pass this.asyncValidate to disallow values passing
          destroyForm: (0, _silenceEvents2.default)(destroy),
          handleSubmit: this.handleSubmit,
          initializeForm: (0, _silenceEvents2.default)(function (initValues) {
            return initialize(initValues, fields);
          }),
          resetForm: (0, _silenceEvents2.default)(reset),
          touch: (0, _silenceEvents2.default)(function () {
            return touch.apply(undefined, arguments);
          }),
          touchAll: (0, _silenceEvents2.default)(function () {
            return touch.apply(undefined, fields);
          }),
          untouch: (0, _silenceEvents2.default)(function () {
            return untouch.apply(undefined, arguments);
          }),
          untouchAll: (0, _silenceEvents2.default)(function () {
            return untouch.apply(undefined, fields);
          })
        };
        var passedProps = propNamespace ? (_ref = {}, _ref[propNamespace] = props, _ref) : props;
        return React.createElement(WrappedComponent, _extends({}, passableProps, passedProps));
      };

      return ReduxForm;
    }(Component);

    ReduxForm.displayName = 'ReduxForm(' + (0, _getDisplayName2.default)(WrappedComponent) + ')';
    ReduxForm.WrappedComponent = WrappedComponent;
    ReduxForm.propTypes = {
      // props:
      alwaysAsyncValidate: PropTypes.bool,
      asyncBlurFields: PropTypes.arrayOf(PropTypes.string),
      asyncValidate: PropTypes.func,
      dispatch: PropTypes.func.isRequired,
      fields: PropTypes.arrayOf(PropTypes.string).isRequired,
      form: PropTypes.object,
      initialValues: PropTypes.any,
      onSubmit: PropTypes.func,
      onSubmitSuccess: PropTypes.func,
      onSubmitFail: PropTypes.func,
      overwriteOnInitialValuesChange: PropTypes.bool.isRequired,
      propNamespace: PropTypes.string,
      readonly: PropTypes.bool,
      returnRejectedSubmitPromise: PropTypes.bool,
      submitPassback: PropTypes.func.isRequired,
      validate: PropTypes.func,

      // actions:
      addArrayValue: PropTypes.func.isRequired,
      autofill: PropTypes.func.isRequired,
      blur: PropTypes.func.isRequired,
      change: PropTypes.func.isRequired,
      destroy: PropTypes.func.isRequired,
      focus: PropTypes.func.isRequired,
      initialize: PropTypes.func.isRequired,
      removeArrayValue: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
      startAsyncValidation: PropTypes.func.isRequired,
      startSubmit: PropTypes.func.isRequired,
      stopAsyncValidation: PropTypes.func.isRequired,
      stopSubmit: PropTypes.func.isRequired,
      submitFailed: PropTypes.func.isRequired,
      swapArrayValues: PropTypes.func.isRequired,
      touch: PropTypes.func.isRequired,
      untouch: PropTypes.func.isRequired
    };
    ReduxForm.defaultProps = {
      asyncBlurFields: [],
      form: _reducer.initialState,
      readonly: false,
      returnRejectedSubmitPromise: false,
      validate: function validate() {
        return {};
      }
    };

    // bind touch flags to blur and change
    var unboundActions = _extends({}, importedActions, {
      blur: (0, _bindActionData2.default)(importedActions.blur, {
        touch: !!config.touchOnBlur
      }),
      change: (0, _bindActionData2.default)(importedActions.change, {
        touch: !!config.touchOnChange
      })
    });

    // make redux connector with or without form key
    var decorate = formKey !== undefined && formKey !== null ? connect((0, _wrapMapStateToProps2.default)(mapStateToProps, function (state) {
      var formState = getFormState(state, reduxMountPoint);
      if (!formState) {
        throw new Error('You need to mount the redux-form reducer at "' + reduxMountPoint + '"');
      }
      return formState && formState[formName] && formState[formName][formKey];
    }), (0, _wrapMapDispatchToProps2.default)(mapDispatchToProps, (0, _bindActionData2.default)(unboundActions, {
      form: formName,
      key: formKey
    })), mergeProps, options) : connect((0, _wrapMapStateToProps2.default)(mapStateToProps, function (state) {
      var formState = getFormState(state, reduxMountPoint);
      if (!formState) {
        throw new Error('You need to mount the redux-form reducer at "' + reduxMountPoint + '"');
      }
      return formState && formState[formName];
    }), (0, _wrapMapDispatchToProps2.default)(mapDispatchToProps, (0, _bindActionData2.default)(unboundActions, { form: formName })), mergeProps, options);

    return decorate(ReduxForm);
  };
};

exports.default = createHigherOrderComponent;