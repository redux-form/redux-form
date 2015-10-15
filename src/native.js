import React from 'react-native';
import {connect} from 'react-redux/native';
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
} = createAll(true, React, connect);
