import React from 'react';
import {connect} from 'react-redux';
import createAll from './createAll';

export const {
  blur,
  change,
  connectReduxForm,
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
  untouch,
  destroy
} = createAll(false, React, connect);
