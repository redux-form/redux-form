'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var wrapMapStateToProps = function wrapMapStateToProps(mapStateToProps, getForm) {
  if (mapStateToProps) {
    if (typeof mapStateToProps !== 'function') {
      throw new Error('mapStateToProps must be a function');
    }
    if (mapStateToProps.length > 1) {
      return function (state, ownProps) {
        return _extends({}, mapStateToProps(state, ownProps), {
          form: getForm(state)
        });
      };
    }
    return function (state) {
      return _extends({}, mapStateToProps(state), {
        form: getForm(state)
      });
    };
  }
  return function (state) {
    return {
      form: getForm(state)
    };
  };
};

exports.default = wrapMapStateToProps;