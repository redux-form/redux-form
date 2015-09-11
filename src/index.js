import reducer from './reducer';
import reduxForm from './reduxForm';
import connectReduxForm from './connectReduxForm';
import mapValues from './mapValues';
import bindActionData from './bindActionData';
import * as actions from './actions';

// bind form as first parameter of action creators
const boundActions = {
  ...mapValues({
    ...actions,
    initializeWithKey: (key, data) => bindActionData(actions.initialize, {key})(data)
  }, action => (form, ...args) => bindActionData(action, {form})(...args))
};

const blur = boundActions.blur;
const change = boundActions.change;
const focus = boundActions.focus;
const initialize = boundActions.initialize;
const initializeWithKey = boundActions.initializeWithKey;
const reset = boundActions.reset;
const startAsyncValidation = boundActions.startAsyncValidation;
const startSubmit = boundActions.startSubmit;
const stopAsyncValidation = boundActions.stopAsyncValidation;
const stopSubmit = boundActions.stopSubmit;
const touch = boundActions.touch;
const untouch = boundActions.untouch;

export {
  blur,
  change,
  connectReduxForm,
  focus,
  reducer,
  initialize,
  initializeWithKey,
  reset,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  touch,
  untouch
};
export default reduxForm;
