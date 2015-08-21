import { BLUR, CHANGE, INITIALIZE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION,
  STOP_SUBMIT, TOUCH, TOUCH_ALL, UNTOUCH, UNTOUCH_ALL } from './actionTypes';

export const initialState = {
  initial: {},
  data: {},
  touched: {},
  asyncValidating: false,
  asyncErrors: {valid: true},
  submitting: false
};

/**
 * Creates a state structure like:
 * {
 *   initial: {
 *     field1: 'value1',
 *     field2: 'value2'
 *   },
 *   data: {
 *     field1: 'value1',
 *     field2: 'value2'
 *   },
 *   touched: {
 *     field1: true,
 *     field2: false
 *   }
 * }
 *
 * @param name the name of the "state slice" where the data is stored
 * @param fields an array of field names, used when showing all values
 * @param config {
 *   touchOnBlur: [defaults to true],
 *   touchOnChange: [defaults to false]
 * }
 * @returns {Function} a form reducer
 */
export default function createFormReducer(name, fields, {touchOnBlur = true, touchOnChange = false} = {}) {
  const reducer = (s, action = {}) => {
    const state = s || initialState;
    switch (action.type) {
      case BLUR:
        const blurDiff = {
          data: {
            ...state.data,
            [action.field]: action.value
          }
        };
        if (touchOnBlur) {
          blurDiff.touched = {
            ...state.touched,
            [action.field]: true
          };
        }
        return {
          ...state,
          ...blurDiff
        };
      case CHANGE:
        const {[action.field]: oldError, valid, ...otherErrors} = state.asyncErrors;
        const changeDiff = {
          data: {
            ...state.data,
            [action.field]: action.value
          },
          asyncErrors: {
            ...otherErrors,
            valid: !Object.keys(otherErrors).length
          }
        };
        delete changeDiff.asyncErrors[action.field];

        if (touchOnChange) {
          changeDiff.touched = {
            ...state.touched,
            [action.field]: true
          };
        }
        return {
          ...state,
          ...changeDiff
        };
      case INITIALIZE:
        return {
          initial: action.data,
          data: action.data,
          asyncValidating: false,
          asyncErrors: {},
          touched: {}
        };
      case RESET:
        return {
          initial: state.initial,
          data: state.initial,
          touched: {},
          asyncValidating: false,
          asyncErrors: {}
        };
      case START_ASYNC_VALIDATION:
        return {
          ...state,
          asyncValidating: true
        };
      case START_SUBMIT:
        return {
          ...state,
          submitting: true
        };
      case STOP_ASYNC_VALIDATION:
        return {
          ...state,
          asyncValidating: false,
          asyncErrors: action.errors
        };
      case STOP_SUBMIT:
        return {
          ...state,
          submitting: false
        };
      case TOUCH:
        const touchDiff = {};
        action.fields.forEach(field => {
          if (typeof field !== 'string') {
            throw new Error('fields passed to touch() must be strings');
          }
          touchDiff[field] = true;
        });
        return {
          ...state,
          touched: {
            ...state.touched,
            ...touchDiff
          }
        };
      case TOUCH_ALL:
        const touchAllDiff = {};
        fields.forEach(field => touchAllDiff[field] = true); // mark all as touched
        return {
          ...state,
          touched: touchAllDiff
        };
      case UNTOUCH:
        const untouchDiff = {};
        action.fields.forEach(field => {
          if (typeof field !== 'string') {
            throw new Error('fields passed to untouch() must be strings');
          }
          untouchDiff[field] = false;
        });
        return {
          ...state,
          touched: {
            ...state.touched,
            ...untouchDiff
          }
        };
      case UNTOUCH_ALL:
        return {
          ...state,
          touched: {}
        };
      default:
        return state;
    }
  };
  return (state = null, action = {}) => {
    if (action.form !== name) {
      return state;
    }
    if (action.key) {
      return {
        ...state,
        [action.key]: reducer(state ? state[action.key] : undefined, action)
      };
    }
    return reducer(state, action);
  };
}
