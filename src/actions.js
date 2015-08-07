import { CHANGE, BLUR, SHOW_ALL, RESET } from './actionTypes';

export function change(form, field, value) {
  return {
    type: CHANGE,
    form: form,
    field: field,
    value: value
  };
}

export function blur(form, field) {
  return {
    type: BLUR,
    form: form,
    field: field
  };
}

export function showAll(form) {
  return {
    type: SHOW_ALL,
    form: form
  };
}

export function reset(form) {
  return {
    type: RESET,
    form: form
  };
}
