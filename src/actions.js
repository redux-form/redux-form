import { ADD_ARRAY_VALUE, BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, REMOVE_ARRAY_VALUE, RESET, START_ASYNC_VALIDATION,
  START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, SUBMIT_FAILED, TOUCH, UNTOUCH } from './actionTypes';

export function addArrayValue(path, value, index) {
  return {type: ADD_ARRAY_VALUE, path, value, index};
}

export function blur(field, value) {
  return {type: BLUR, field, value};
}

export function change(field, value) {
  return {type: CHANGE, field, value};
}

export function destroy() {
  return {type: DESTROY};
}

export function focus(field) {
  return {type: FOCUS, field};
}

export function initialize(data) {
  return {type: INITIALIZE, data};
}

export function removeArrayValue(path, index) {
  return {type: REMOVE_ARRAY_VALUE, path, index};
}

export function reset() {
  return {type: RESET};
}

export function startAsyncValidation() {
  return {type: START_ASYNC_VALIDATION};
}

export function startSubmit() {
  return {type: START_SUBMIT};
}

export function stopAsyncValidation(errors) {
  return {type: STOP_ASYNC_VALIDATION, errors};
}

export function stopSubmit(errors) {
  return {type: STOP_SUBMIT, errors};
}

export function submitFailed() {
  return {type: SUBMIT_FAILED};
}

export function touch(...fields) {
  return {type: TOUCH, fields};
}

export function untouch(...fields) {
  return {type: UNTOUCH, fields};
}
