import React from 'react';
import {connect} from 'react-redux';
import createAll from './createAll';

export const {
  actionTypes,
  blur,
  change,
  changeWithKey,
  destroy,
  focus,
  reducer,
  reduxForm,
  initialize,
  initializeWithKey,
  propTypes,
  reset,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  touch,
  touchWithKey,
  untouch,
  untouchWithKey
} = createAll(false, React, connect);
