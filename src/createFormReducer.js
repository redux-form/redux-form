import { BLUR, CHANGE, INITIALIZE, RESET, TOUCH, TOUCH_ALL, UNTOUCH, UNTOUCH_ALL } from './actionTypes';

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
  return (state = {initial: {}, data: {}, touched: {}}, action = {}) => {
    if (action.form !== name) {
      return state;
    }
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
        const changeDiff = {
          data: {
            ...state.data,
            [action.field]: action.value
          }
        };
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
          touched: {}
        };
      case RESET:
        return {
          initial: state.initial,
          data: state.initial,
          touched: {}
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
}
