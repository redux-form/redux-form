'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var wrapMapDispatchToProps = function wrapMapDispatchToProps(mapDispatchToProps, actionCreators) {
  if (mapDispatchToProps) {
    if (typeof mapDispatchToProps === 'function') {
      if (mapDispatchToProps.length > 1) {
        return function (dispatch, ownProps) {
          return _extends({
            dispatch: dispatch
          }, mapDispatchToProps(dispatch, ownProps), (0, _redux.bindActionCreators)(actionCreators, dispatch));
        };
      }
      return function (dispatch) {
        return _extends({
          dispatch: dispatch
        }, mapDispatchToProps(dispatch), (0, _redux.bindActionCreators)(actionCreators, dispatch));
      };
    }
    return function (dispatch) {
      return _extends({
        dispatch: dispatch
      }, (0, _redux.bindActionCreators)(mapDispatchToProps, dispatch), (0, _redux.bindActionCreators)(actionCreators, dispatch));
    };
  }
  return function (dispatch) {
    return _extends({
      dispatch: dispatch
    }, (0, _redux.bindActionCreators)(actionCreators, dispatch));
  };
};

exports.default = wrapMapDispatchToProps;