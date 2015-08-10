import { BLUR, CHANGE, INITIALIZE, RESET, TOUCH, TOUCH_ALL, UNTOUCH, UNTOUCH_ALL } from './actionTypes';

export function blur(form, field, value) {
  return {
    type: BLUR,
    form: form,
    field: field,
    value: value
  };
}

export function change(form, field, value) {
  return {
    type: CHANGE,
    form: form,
    field: field,
    value: value
  };
}

export function initialize(form, data) {
  return {
    type: INITIALIZE,
    form: form,
    data: data
  };
}

export function reset(form) {
  return {
    type: RESET,
    form: form
  };
}

export function touch(form, ...fields) {
  return {
    type: TOUCH,
    form: form,
    fields: fields
  };
}

export function touchAll(form) {
  return {
    type: TOUCH_ALL,
    form: form
  };
}

export function untouch(form, ...fields) {
  return {
    type: UNTOUCH,
    form: form,
    fields: fields
  };
}

export function untouchAll(form) {
  return {
    type: UNTOUCH_ALL,
    form: form
  };
}
