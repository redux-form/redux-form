import { BLUR, CHANGE, FOCUS, INITIALIZE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION,
  STOP_SUBMIT, TOUCH, UNTOUCH } from './actionTypes';
import mapValues from './mapValues';
import { getIn, setIn } from './getSet';

export const initialState = {
  _asyncValidating: false,
  _submitting: false,
  _active: undefined
};

const getValues = (state) =>
  Object.keys(state).reduce((accumulator, name) =>
    name[0] === '_' ? accumulator : {
      ...accumulator,
      [name]: state[name].value
    }, {});

const reducer = (state = initialState, action = {}) => {
  let path;
  switch (action.type) {
    case BLUR:
      path = action.field.split('.');
      return {
        ...setIn(state, path, {
          ...getIn(state, path),
          value: action.value,
          touched: !!(action.touch || (state[action.field] || {}).touched)
        }),
        _active: undefined
      }
    case CHANGE:
      path = action.field.split('.');
      return setIn(state, path, {
        ...getIn(state, path),
        value: action.value,
        touched: !!(action.touch || (getIn(state, path) || {}).touched),
        asyncError: null,
        submitError: null
      });
    case FOCUS:
      path = action.field.split('.');
      return {
        ...setIn(state, path, {
          ...getIn(state, path),
          visited: true
        }),
        _active: action.field
      }
    case INITIALIZE:
      return {
        ...mapValues(action.data, (value) => ({
          initial: value,
          value: value
        })),
        _asyncValidating: false,
        _submitting: false,
        _active: undefined
      };
    case RESET:
      return {
        ...mapValues(state, (field, name) => {
          return name[0] === '_' ? field : {
            initial: field.initial,
            value: field.initial
          };
        }),
        _active: undefined,
        _asyncValidating: false,
        _submitting: false
      };
    case START_ASYNC_VALIDATION:
      return {
        ...state,
        _asyncValidating: true
      };
    case START_SUBMIT:
      return {
        ...state,
        _submitting: true
      };
    case STOP_ASYNC_VALIDATION:
      return {
        ...state,
        ...mapValues(action.errors, (error, key) => ({
          ...state[key],
          asyncError: error
        })),
        _asyncValidating: false
      };
    case STOP_SUBMIT:
      return {
        ...state,
        ...(action.errors ? mapValues(action.errors, (error, key) => ({
          ...state[key],
          submitError: error
        })) : {}),
        _submitting: false
      };
    case TOUCH:
      return {
        ...state,
        ...action.fields.reduce((accumulator, field) => ({
          ...accumulator,
          [field]: {
            ...state[field],
            touched: true
          }
        }), {})
      };
    case UNTOUCH:
      return {
        ...state,
        ...action.fields.reduce((accumulator, field) => ({
          ...accumulator,
          [field]: {
            ...state[field],
            touched: false
          }
        }), {})
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

/**
 * Adds additional functionality to the reducer
 */
function decorate(target) {
  target.plugin = function plugin(reducers) {
    return decorate((state = {}, action = {}) => {
      const result = this(state, action);
      return {
        ...result,
        ...mapValues(reducers, (red, key) => red(result[key] || initialState, action))
      };
    });
  };

  target.normalize = function normalize(normalizers) {
    return decorate((state = {}, action = {}) => {
      const result = this(state, action);
      return {
        ...result,
        ...mapValues(normalizers, (formNormalizers, form) => ({
          ...result[form],
          ...mapValues(formNormalizers, (fieldNormalizer, field) => ({
            ...result[form][field],
            value: fieldNormalizer(
              result[form][field] ? result[form][field].value : undefined,                // value
              state[form] && state[form][field] ? state[form][field].value : undefined,   // previous value
              getValues(result[form]))                                                    // all field values
          }))
        }))
      };
    });
  };

  return target;
}

export default decorate(formReducer);
