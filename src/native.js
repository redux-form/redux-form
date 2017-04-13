import React from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import createAll from './createAll';

export const {
  actionTypes,
  addArrayValue,
  autofill,
  autofillWithKey,
  blur,
  change,
  changeWithKey,
  destroy,
  focus,
  reducer,
  reduxForm,
  getValues,
  initialize,
  initializeWithKey,
  propTypes,
  removeArrayValue,
  reset,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  swapArrayValues,
  touch,
  touchWithKey,
  untouch,
  untouchWithKey
} = createAll(true, React, PropTypes, connect);
