import { BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION,
  STOP_SUBMIT, TOUCH, UNTOUCH } from './actionTypes';
import mapValues from './mapValues';

export const initialState = {
  _active: undefined,
  _asyncValidating: false,
  _error: undefined,
  _submitting: false
};

const getValues = (state) =>
  Object.keys(state).reduce((accumulator, name) =>
    name[0] === '_' ? accumulator : {
      ...accumulator,
      [name]: state[name].value
    }, {});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case BLUR:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value === undefined ? (state[action.field] || {}).value : action.value,
          touched: !!(action.touch || (state[action.field] || {}).touched)
        },
        _active: undefined
      };
    case CHANGE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value,
          touched: !!(action.touch || (state[action.field] || {}).touched),
          asyncError: undefined,
          submitError: undefined
        }
      };
    case DESTROY:
      return undefined;
    case FOCUS:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          visited: true
        },
        _active: action.field
      };
    case INITIALIZE:
      return {
        ...mapValues(action.data, (value) => ({
          initial: value,
          value: value
        })),
        _asyncValidating: false,
        _active: undefined,
        _error: undefined,
        _initializedAt: action.timestamp,
        _submitting: false
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
        _error: undefined,
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
        _asyncValidating: false,
        _error: action.errors && action.errors._error
      };
    case STOP_SUBMIT:
      return {
        ...state,
        ...(action.errors ? mapValues(action.errors, (error, key) => ({
          ...state[key],
          submitError: error
        })) : {}),
        _error: action.errors && action.errors._error,
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
    if (action.type === DESTROY) {
      return {
        ...state,
        [form]: state[form] && Object.keys(state[form]).reduce((accumulator, stateKey) =>
          stateKey === key ? accumulator : {
            ...accumulator,
            [stateKey]: state[form][stateKey]
          }, {})
      };
    }
    return {
      ...state,
      [form]: {
        ...state[form],
        [key]: reducer((state[form] || {})[key], rest)
      }
    };
  }
  if (action.type === DESTROY) {
    return Object.keys(state).reduce((accumulator, formName) =>
      formName === form ? accumulator : {
        ...accumulator,
        [formName]: state[formName]
      }, {});
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
        ...mapValues(reducers, (pluginReducer, key) => pluginReducer(result[key] || initialState, action))
      };
    });
  };

  target.normalize = function normalize(normalizers) {
    return decorate((state = {}, action = {}) => {
      const result = this(state, action);
      return {
        ...result,
        ...mapValues(normalizers, (formNormalizers, form) => {
          const previousValues = getValues({...initialState, ...state[form]});
          const formResult = {
            ...initialState,
            ...result[form]
          };
          return {
            ...formResult,
            ...mapValues(formNormalizers, (fieldNormalizer, field) => ({
              ...formResult[field],
              value: fieldNormalizer(
                formResult[field] ? formResult[field].value : undefined,                  // value
                state[form] && state[form][field] ? state[form][field].value : undefined, // previous value
                getValues(formResult),                                                    // all field values
                previousValues)                                                           // all previous field values
            }))
          };
        })
      };
    });
  };

  return target;
}

export default decorate(formReducer);
