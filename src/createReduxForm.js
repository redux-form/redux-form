import * as formActions from './actions';
import getDisplayName from './getDisplayName';
import isPristine from './isPristine';
import isValid from './isValid';
import bindActionData from './bindActionData';
import {initialState} from './reducer';
import lazyCache from 'react-lazy-cache';

function isReadonly(prop) {
  const writeProps = ['asyncValidate', 'handleBlur', 'handleChange', 'handleFocus',
    'handleSubmit', 'onBlur', 'onChange', 'onFocus'];
  return !~writeProps.indexOf(prop);
}


function silenceEvents(fn) {
  return (event, ...args) => {
    if (event && event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
      return fn(...args);
    }
    return fn(event, ...args);
  };
}

function isAsyncValid(errors) {
  return !errors || Object.keys(errors).reduce((valid, error) => valid && isValid(errors[error]), true);
}

export default function createReduxForm(isReactNative, React) {
  const {Component, PropTypes} = React;

  function getValue(passedValue, event) {
    if (passedValue !== undefined || !event) {
      // extract value from { value: value } structure. https://github.com/nikgraf/belle/issues/58
      return typeof passedValue === 'object' && passedValue.value ? passedValue.value : passedValue;
    }
    if (!isReactNative && event.nativeEvent !== undefined && event.nativeEvent.text !== undefined) {
      return event.nativeEvent.text;
    }
    if (isReactNative && event.nativeEvent !== undefined) {
      return event.nativeEvent.text;
    }
    if (event.target === undefined) {  // is it a value instead of an event?
      return event;
    }
    const {target: {type, value, checked, files}, dataTransfer} = event;
    if (type === 'checkbox') {
      return checked;
    }
    if (type === 'file') {
      return files || dataTransfer && dataTransfer.files;
    }
    return value;
  }

  return function reduxForm(config) {
    const { form: formName, fields, validate: syncValidate, readonly, touchOnBlur, touchOnChange, asyncValidate, asyncBlurFields } = {
      validate: () => ({}),
      touchOnBlur: true,
      touchOnChange: false,
      readonly: false,
      asyncValidate: null,
      asyncBlurFields: [],
      ...config
    };
    if (!fields || !fields.length) {
      throw new Error('No fields passed to redux-form. Must be passed to ' +
        'connectReduxForm({fields: ["my", "field", "names"]})');
    }

    const filterProps = props => readonly ?
      Object.keys(props).reduce((accumulator, prop) =>
        isReadonly(prop) ? ({
          ...accumulator,
          [prop]: props[prop]
        }) : accumulator, {}) : props;

    return DecoratedComponent =>
      class ReduxForm extends Component {
        static displayName = `ReduxForm(${getDisplayName(DecoratedComponent)})`;
        static DecoratedComponent = DecoratedComponent;
        static propTypes = {
          formName: PropTypes.string,
          formKey: PropTypes.string,
          form: PropTypes.object,
          onSubmit: PropTypes.func,
          dispatch: PropTypes.func.isRequired,
          initialValues: PropTypes.object
        }
        static defaultProps = {
          formName
        }

        constructor(props) {
          super(props);
          this.cache = lazyCache(this, {
            _actions: {
              params: ['formName', 'formKey'],
              fn: (formName, formKey) => // eslint-disable-line no-shadow
                formKey ?
                  bindActionData(formActions, {form: formName, key: formKey}) :
                  bindActionData(formActions, {form: formName})
            },

            _handleBlur: {
              params: ['_actions', 'dispatch'],
              fn: (actions, dispatch) => (name, value) => (event) => {
                const fieldValue = getValue(value, event);
                const doBlur = bindActionData(actions.blur, {touch: touchOnBlur});
                dispatch(doBlur(name, fieldValue));
                if (asyncValidate && ~asyncBlurFields.indexOf(name)) {
                  const values = this.getValues();
                  const syncError = syncValidate({
                    ...values,
                    [name]: fieldValue
                  })[name];
                  // only dispatch async call if all synchronous client-side validation passes for this field
                  if (!syncError) {
                    this.runAsyncValidation(actions, values);
                  }
                }
              }
            },
            _handleFocus: {
              params: ['_actions', 'dispatch'],
              fn: (actions, dispatch) => (name) => () => dispatch(actions.focus(name))
            },
            _handleChange: {
              params: ['_actions', 'dispatch'],
              fn: (actions, dispatch) => (name, value) => {
                const doChange = bindActionData(actions.change, {touch: touchOnChange});

                return value ? dispatch(doChange(name, getValue(value)))
                  : (event) => dispatch(doChange(name, getValue(value, event)));
              }
            },
            _fieldActions: {
              params: ['_handleBlur', '_handleChange', '_handleFocus'],
              fn: (handleBlur, handleChange, handleFocus) =>
                fields.reduce((accumulator, name) => {
                  const fieldBlur = handleBlur(name);
                  const fieldChange = handleChange(name);
                  const fieldFocus = handleFocus(name);
                  return {
                    ...accumulator,
                    [name]: filterProps({
                      handleBlur: fieldBlur,
                      handleChange: fieldChange,
                      handleFocus: fieldFocus,
                      name,
                      onBlur: fieldBlur,
                      onChange: fieldChange,
                      onDrop: event => {
                        fieldChange(event.dataTransfer.getData('value'));
                      },
                      onFocus: fieldFocus,
                      onUpdate: fieldChange // alias to support belle. https://github.com/nikgraf/belle/issues/58
                    })
                  };
                }, {})
            }
          });
        }

        componentWillMount() {
          const {initialValues, dispatch} = this.props; // eslint-disable-line no-shadow
          if (initialValues) {
            const {initialize} = this.cache._actions;
            dispatch(initialize(initialValues));
          }
        }

        runAsyncValidation(actions, values) {
          const {dispatch, formKey} = this.props; // eslint-disable-line no-shadow
          dispatch(actions.startAsyncValidation(formKey));
          const promise = asyncValidate(values, dispatch);
          if (!promise || typeof promise.then !== 'function') {
            throw new Error('asyncValidate function passed to reduxForm must return a promise!');
          }
          const handleErrors = asyncErrors => {
            dispatch(actions.stopAsyncValidation(asyncErrors));
            return isAsyncValid(asyncErrors);
          };
          return promise.then(handleErrors, handleErrors);
        }

        getSubForm() {
          const {formName, form, formKey} = this.props; // eslint-disable-line no-shadow
          if (form && form[formName]) {
            if (formKey) {
              if (form[formName][formKey]) {
                return form[formName][formKey];
              }
            } else {
              return form[formName];
            }
          }
          return initialState;
        }

        getValues() {
          const subForm = this.getSubForm();
          return fields.reduce((accumulator, field) => ({
            ...accumulator,
            [field]: subForm[field] ? subForm[field].value : undefined
          }), {});
        }

        componentWillReceiveProps(nextProps) {
          this.cache.componentWillReceiveProps(nextProps);
        }

        render() {
          // Read props
          const {formName, form, formKey, dispatch, ...passableProps} = this.props; // eslint-disable-line no-shadow
          if (!formName) {
            throw new Error('No form name given to redux-form. Must be passed to ' +
              'connectReduxForm({form: [form name]}) or as a "formName" prop');
          }
          const {
            _actions: actions,
            _fieldActions: fieldActions,
            _handleBlur: handleBlur,
            _handleChange: handleChange,
            _handleFocus: handleFocus } = this.cache;
          const subForm = this.getSubForm();

          // Calculate calculable state
          let allValid = true;
          let allPristine = true;

          const handleSubmit = submitOrEvent => {
            const createEventHandler = submit => event => {
              if (event && event.preventDefault) {
                event.preventDefault();
                event.stopPropagation();
              }
              const values = this.getValues();
              const submitWithPromiseCheck = () => {
                const result = submit(values);
                if (result && typeof result.then === 'function') {
                  // you're showing real promise, kid!
                  dispatch(actions.startSubmit());
                  return result.then(submitResult => {
                    dispatch(actions.stopSubmit());
                    return submitResult;
                  }, submitError => {
                    dispatch(actions.stopSubmit(submitError));
                    return submitError;
                  });
                }
              };
              dispatch(actions.touch(...fields));
              if (allValid) {
                if (asyncValidate) {
                  return this.runAsyncValidation(actions, values).then(asyncValid => {
                    if (allValid && asyncValid) {
                      return submitWithPromiseCheck(values);
                    }
                  });
                }
                return submitWithPromiseCheck(values);
              }
            };
            if (typeof submitOrEvent === 'function') {
              return createEventHandler(submitOrEvent);
            }
            const {onSubmit} = this.props;
            if (!onSubmit) {
              throw new Error('You must either pass handleSubmit() an onSubmit function or pass onSubmit as a prop');
            }
            createEventHandler(onSubmit)(submitOrEvent /* is event */);
          };

          // Define fields
          const values = this.getValues();
          const syncErrors = syncValidate(values);
          const allFields = fields.reduce((accumulator, name) => {
            const field = subForm[name] || {};
            const pristine = isPristine(field.value, field.initial);
            const error = syncErrors[name] || field.asyncError || field.submitError;
            const valid = isValid(error);
            if (!valid) {
              allValid = false;
            }
            if (!pristine) {
              allPristine = false;
            }
            return {
              ...accumulator,
              [name]: filterProps({
                active: subForm._active === name,
                checked: typeof field.value === 'boolean' ? field.value : undefined,
                dirty: !pristine,
                error,
                ...fieldActions[name],
                invalid: !valid,
                name,
                onDrag: event => event.dataTransfer.setData('value', field.value),
                pristine,
                touched: field.touched,
                valid: valid,
                value: field.value,
                visited: field.visited
              })
            };
          }, {});
          const formError = syncErrors._error || subForm._error;
          if (formError) {
            allValid = false;
          }

          // Return decorated component
          return (<DecoratedComponent {...{
            // State:
            active: subForm._active,
            asyncValidating: subForm._asyncValidating,
            dirty: !allPristine,
            error: formError,
            fields: allFields,
            formKey,
            invalid: !allValid,
            pristine: allPristine,
            submitting: subForm._submitting,
            valid: allValid,
            values,

            // Actions:
            asyncValidate: silenceEvents(() => this.runAsyncValidation(actions, values)),
            handleBlur: silenceEvents(handleBlur),
            handleChange: silenceEvents(handleChange),
            handleFocus,
            handleSubmit: silenceEvents(handleSubmit),
            initializeForm: silenceEvents(initialValues => dispatch(actions.initialize(initialValues))),
            resetForm: silenceEvents(() => dispatch(actions.reset())),
            touch: silenceEvents((...touchFields) => dispatch(actions.touch(...touchFields))),
            touchAll: silenceEvents(() => dispatch(actions.touch(...fields))),
            untouch: silenceEvents((...untouchFields) => dispatch(actions.untouch(...untouchFields))),
            untouchAll: silenceEvents(() => dispatch(actions.untouch(...fields))),

            // Other:
            dispatch,
            ...passableProps
          }}/>);
        }
      };
  };
}
