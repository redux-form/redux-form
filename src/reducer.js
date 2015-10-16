import { BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION,
  STOP_SUBMIT, TOUCH, UNTOUCH } from './actionTypes';
import mapValues from './mapValues';
import isPristine from './isPristine';

export const initialState = {
  _active: undefined,
  _asyncValidating: false,
  _error: undefined,
  _submitting: false,
  _dirty: false
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
      const actionFieldIsDirty = !isPristine(action.value, state[action.field] && state[action.field].initial);
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value,
          touched: !!(action.touch || (state[action.field] || {}).touched),
          dirty: actionFieldIsDirty,
          asyncError: null,
          submitError: null
        },
        _dirty: actionFieldIsDirty || Object.keys(state).reduce((accumulator, fieldName) =>
            accumulator || ((fieldName !== action.field && fieldName[0] !== '_') ? state[fieldName].dirty : false)
          , false),
        _error: undefined
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
          value: value,
          dirty: false
        })),
        _asyncValidating: false,
        _active: undefined,
        _error: undefined,
        _submitting: false,
        _dirty: false
      };
    case RESET:
      return {
        ...mapValues(state, (field, name) => {
          return name[0] === '_' ? field : {
            initial: field.initial,
            value: field.initial,
            dirty: false
          };
        }),
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _dirty: false
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
        _error: action.errors._error
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
        [form]: Object.keys(state[form]).reduce((accumulator, stateKey) =>
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
        ...mapValues(reducers, (red, key) => red(result[key] || initialState, action))
      };
    });
  };

  target.normalize = function normalize(normalizers) {
    return decorate((state = {}, action = {}) => {
      const result = this(state, action);
      return {
        ...result,
        ...mapValues(normalizers, (formNormalizers, form) => {
          const formResult = {
            ...initialState,
            ...result[form]
          };
          return {
            ...formResult,
            ...mapValues(formNormalizers, (fieldNormalizer, field) => ({
              ...formResult[field],
              value: fieldNormalizer(
                formResult[field] ? formResult[field].value : undefined,                // value
                state[form] && state[form][field] ? state[form][field].value : undefined,   // previous value
                getValues(formResult))                                                    // all field values
            }))
          };
        })
      };
    });
  };

  return target;
}

export default decorate(formReducer);
