import reducer from './reducer';
import createReduxForm from './createReduxForm';
import mapValues from './mapValues';
import bindActionData from './bindActionData';
import * as actions from './actions';
import * as actionTypes from './actionTypes';
import createPropTypes from './createPropTypes';
import getValues from './getValuesFromState';

// bind form as first parameter of action creators
const boundActions = {
  ...mapValues({
    ...actions,
    autofillWithKey: (key, ...args) => bindActionData(actions.autofill, {key})(...args),
    changeWithKey: (key, ...args) => bindActionData(actions.change, {key})(...args),
    initializeWithKey: (key, ...args) => bindActionData(actions.initialize, {key})(...args),
    reset: (key) => bindActionData(actions.reset, {key})(),
    touchWithKey: (key, ...args) => bindActionData(actions.touch, {key})(...args),
    untouchWithKey: (key, ...args) => bindActionData(actions.untouch, {key})(...args),
    destroy: (key) => bindActionData(actions.destroy, {key})()
  }, action => (form, ...args) => bindActionData(action, {form})(...args))
};

const addArrayValue = boundActions.addArrayValue;
const autofill = boundActions.autofill;
const autofillWithKey = boundActions.autofillWithKey;
const blur = boundActions.blur;
const change = boundActions.change;
const changeWithKey = boundActions.changeWithKey;
const destroy = boundActions.destroy;
const focus = boundActions.focus;
const initialize = boundActions.initialize;
const initializeWithKey = boundActions.initializeWithKey;
const removeArrayValue = boundActions.removeArrayValue;
const reset = boundActions.reset;
const startAsyncValidation = boundActions.startAsyncValidation;
const startSubmit = boundActions.startSubmit;
const stopAsyncValidation = boundActions.stopAsyncValidation;
const stopSubmit = boundActions.stopSubmit;
const submitFailed = boundActions.submitFailed;
const swapArrayValues = boundActions.swapArrayValues;
const touch = boundActions.touch;
const touchWithKey = boundActions.touchWithKey;
const untouch = boundActions.untouch;
const untouchWithKey = boundActions.untouchWithKey;

export default function createAll(isReactNative, React, connect) {
  return {
    actionTypes,
    addArrayValue,
    autofill,
    autofillWithKey,
    blur,
    change,
    changeWithKey,
    destroy,
    focus,
    getValues,
    initialize,
    initializeWithKey,
    propTypes: createPropTypes(),
    reduxForm: createReduxForm(isReactNative, React, connect),
    reducer,
    removeArrayValue,
    reset,
    startAsyncValidation,
    startSubmit,
    stopAsyncValidation,
    stopSubmit,
    submitFailed,
    swapArrayValues,
    touch,
    touchWithKey,
    untouch,
    untouchWithKey
  };
}
