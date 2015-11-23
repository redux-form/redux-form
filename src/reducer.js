import { BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION,
  STOP_SUBMIT, SUBMIT_FAILED, TOUCH, UNTOUCH } from './actionTypes';
import mapValues from './mapValues';

export const initialState = {
  _active: undefined,
  _asyncValidating: false,
  _error: undefined,
  _submitting: false,
  _submitFailed: false
};

export const getValues = (state) =>
  Object.keys(state).reduce((accumulator, name) => {
    if (name[0] !== '_') {
      accumulator[name] = state[name].value;
    }
    return accumulator;
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
        _submitting: false,
        _submitFailed: false
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
        _submitting: false,
        _submitFailed: false
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
        ...mapValues(state, value =>
          value && value.asyncError ? {...value, asyncError: undefined} : value
        ),
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
        _submitting: false,
        _submitFailed: !!(action.errors && Object.keys(action.errors).length)
      };
    case SUBMIT_FAILED:
      return {
        ...state,
        _submitFailed: true
      };
    case TOUCH:
      return {
        ...state,
        ...action.fields.reduce((accumulator, field) => {
          accumulator[field] = {
            ...state[field],
            touched: true
          };
          return accumulator;
        }, {})
      };
    case UNTOUCH:
      return {
        ...state,
        ...action.fields.reduce((accumulator, field) => {
          accumulator[field] = {
            ...state[field],
            touched: false
          };
          return accumulator;
        }, {})
      };
    default:
      return state;
  }
};

function formReducer(state = {}, action = {}) {
  const {form, key, ...rest} = action; // eslint-disable-line no-redeclare
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
          const runNormalize = (previous, currentResult) => {
            const previousValues = getValues({...initialState, ...previous
            });
            const formResult = {
              ...initialState,
              ...currentResult
            };
            return {
              ...formResult,
              ...mapValues(formNormalizers, (fieldNormalizer, field) => ({
                ...formResult[field],
                value: fieldNormalizer(
                    formResult[field] ? formResult[field].value : undefined,         // value
                    previous && previous[field] ? previous[field].value : undefined, // previous value
                    getValues(formResult),                                           // all field values
                    previousValues)                                                  // all previous field values
              }))
            };
          };
          if (action.key) {
            return {
              ...result[form], [action.key]: runNormalize(state[form][action.key], result[form][action.key])
            };
          }
          return runNormalize(state[form], result[form]);
        })
      };
    });
  };

  return target;
}

export default decorate(formReducer);
