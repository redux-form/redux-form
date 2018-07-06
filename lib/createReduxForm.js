'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createReduxFormConnector = require('./createReduxFormConnector');

var _createReduxFormConnector2 = _interopRequireDefault(_createReduxFormConnector);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The decorator that is the main API to redux-form
 */
var createReduxForm = function createReduxForm(isReactNative, React, connect) {
  var Component = React.Component;

  var reduxFormConnector = (0, _createReduxFormConnector2.default)(isReactNative, React, connect);
  return function (config, mapStateToProps, mapDispatchToProps, mergeProps, options) {
    return function (WrappedComponent) {
      var ReduxFormConnector = reduxFormConnector(WrappedComponent, mapStateToProps, mapDispatchToProps, mergeProps, options);
      var configWithDefaults = _extends({
        overwriteOnInitialValuesChange: true,
        touchOnBlur: true,
        touchOnChange: false,
        destroyOnUnmount: true
      }, config);

      var ConnectedForm = function (_Component) {
        _inherits(ConnectedForm, _Component);

        function ConnectedForm(props) {
          _classCallCheck(this, ConnectedForm);

          var _this = _possibleConstructorReturn(this, _Component.call(this, props));

          _this.handleSubmitPassback = _this.handleSubmitPassback.bind(_this);
          return _this;
        }

        ConnectedForm.prototype.handleSubmitPassback = function handleSubmitPassback(submit) {
          this.submit = submit;
        };

        ConnectedForm.prototype.render = function render() {
          return React.createElement(ReduxFormConnector, _extends({}, configWithDefaults, this.props, {
            submitPassback: this.handleSubmitPassback }));
        };

        return ConnectedForm;
      }(Component);

      return (0, _hoistNonReactStatics2.default)(ConnectedForm, WrappedComponent);
    };
  };
};

exports.default = createReduxForm;