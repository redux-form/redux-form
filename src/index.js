import React from 'react';
import {connect} from 'react-redux';
import createAll from './createAll';

export const {
  blur,
  change,
  connectReduxForm,
  destroy,
  focus,
  reducer,
  reduxForm,
  initialize,
  initializeWithKey,
  reset,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  touch,
  untouch
} = createAll(false, React, connect);
