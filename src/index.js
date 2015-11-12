import React from 'react';
import createAll from './createAll';

export const {
  actionTypes,
  blur,
  change,
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
} = createAll(false, React);
