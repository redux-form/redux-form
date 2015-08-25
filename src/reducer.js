import { BLUR, CHANGE, INITIALIZE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION,
  STOP_SUBMIT, TOUCH, UNTOUCH } from './actionTypes';
import mapValues from './mapValues';

export const initialState = {
  asyncErrors: {valid: true},
  asyncValidating: false,
  data: {},
  initial: {},
  submitting: false,
  touched: {}
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case BLUR:
      const blurDiff = {
        data: {
          ...state.data,
          [action.field]: action.value
        }
      };
      if (action.touch) {
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

      if (action.touch) {
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
        asyncErrors: {},
        asyncValidating: false,
        data: action.data,
        initial: action.data,
        submitting: false,
        touched: {}
      };
    case RESET:
      return {
        asyncErrors: {},
        asyncValidating: false,
        data: state.initial,
        initial: state.initial,
        submitting: false,
        touched: {}
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
    default:
      return state;
  }
};

function formReducer(state = {}, action = {}) {
  const {form, key, ...rest} = action;
  if (!form) {
    return state;
  }
  if (key) {
    return {
      ...state,
      [form]: {
        ...state[form],
        [key]: reducer((state[form] || {})[key], rest)
      }
    };
  }
  return {
    ...state,
    [form]: reducer(state[form], rest)
  };
}

formReducer.plugin = reducers => (state = {}, action = {}) => {
  const result = formReducer(state, action);
  return {
    ...result,
    ...mapValues(reducers, (red, key) => red(result[key] || initialState, action))
  };
};

export default formReducer;
