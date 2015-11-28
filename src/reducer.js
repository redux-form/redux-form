import { ADD_ARRAY_VALUE, BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, REMOVE_ARRAY_VALUE, RESET, START_ASYNC_VALIDATION,
  START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, SUBMIT_FAILED, TOUCH, UNTOUCH } from './actionTypes';
import mapValues from './mapValues';
import read from './read';
import write from './write';

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

const behaviors = {
  [ADD_ARRAY_VALUE](state, {path, index, value}) {
    const array = read(path, state);
    const stateCopy = {...state};
    const arrayCopy = array ? [...array] : [];
    const newValue = {value};
    if (index === undefined) {
      arrayCopy.push(newValue);
    } else {
      arrayCopy.splice(index, 0, newValue);
    }
    return write(path, arrayCopy, stateCopy);
  },
  [BLUR](state, {field, value, touch}) {
    // remove _active from state
    let {_active, ...stateCopy} = state;  // eslint-disable-line prefer-const
    if (value !== undefined) {
      stateCopy = write(`${field}.value`, value, stateCopy);
    }
    if (touch) {
      stateCopy = write(`${field}.touched`, true, stateCopy);
    }
    return stateCopy;
  },
  [CHANGE](state, {field, value, touch}) {
    let stateCopy = {...state};
    stateCopy = write(`${field}.value`, value, stateCopy);
    if (touch) {
      stateCopy = write(`${field}.touched`, true, stateCopy);
    }
    delete stateCopy.asyncError;
    delete stateCopy.submitError;
    return stateCopy;
  },
  [DESTROY]() {
    return undefined;
  },
  [FOCUS](state, {field}) {
    let stateCopy = {...state};
    stateCopy = write(field + '.visited', true, stateCopy);
    stateCopy._active = field;
    return stateCopy;
  },
  [INITIALIZE](state, {data}) {
    return {
      ...mapValues(data, (value) => ({
        initial: value,
        value: value
      })),
      _asyncValidating: false,
      _active: undefined,
      _error: undefined,
      _submitting: false,
      _submitFailed: false
    };
  },
  [REMOVE_ARRAY_VALUE](state, {path, index}) {
    const array = read(path, state);
    const stateCopy = {...state};
    const arrayCopy = array ? [...array] : [];
    if (index === undefined) {
      arrayCopy.pop();
    } else if (isNaN(index)) {
      delete arrayCopy[index];
    } else {
      arrayCopy.splice(index, 1);
    }
    return write(path, arrayCopy, stateCopy);
  },
  [RESET](state) {
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
  },
  [START_ASYNC_VALIDATION](state) {
    return {
      ...state,
      _asyncValidating: true
    };
  },
  [START_SUBMIT](state) {
    return {
      ...state,
      _submitting: true
    };
  },
  [STOP_ASYNC_VALIDATION](state, {errors}) {
    return {
      ...mapValues(state, value =>
        value && value.asyncError ? {...value, asyncError: undefined} : value
      ),
      ...mapValues(errors, (error, key) => ({
        ...state[key],
        asyncError: error
      })),
      _asyncValidating: false,
      _error: errors && errors._error
    };
  },
  [STOP_SUBMIT](state, {errors}) {
    return {
      ...state,
      ...(errors ? mapValues(errors, (error, key) => ({
        ...state[key],
        submitError: error
      })) : {}),
      _error: errors && errors._error,
      _submitting: false,
      _submitFailed: !!(errors && Object.keys(errors).length)
    };
  },
  [SUBMIT_FAILED](state) {
    return {
      ...state,
      _submitFailed: true
    };
  },
  [TOUCH](state, {fields}) {
    return {
      ...state,
      ...fields.reduce((accumulator, field) => {
        accumulator[field] = {
          ...state[field],
          touched: true
        };
        return accumulator;
      }, {})
    };
  },
  [UNTOUCH](state, {fields}) {
    return {
      ...state,
      ...fields.reduce((accumulator, field) => {
        accumulator[field] = {
          ...state[field],
          touched: false
        };
        return accumulator;
      }, {})
    };
  }
};

const reducer = (state = initialState, action = {}) => {
  const behavior = behaviors[action.type];
  return behavior ? behavior(state, action) : state;
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
