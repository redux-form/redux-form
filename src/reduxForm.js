import React, {Component, PropTypes} from 'react';
import * as formActions from './actions';
import getDisplayName from './getDisplayName';
import isPristine from './isPristine';
import isValid from './isValid';
import bindActionData from './bindActionData';
import {initialState} from './reducer';

function isReadonly(prop) {
  const writeProps = ['asyncValidate', 'handleBlur', 'handleChange', 'handleFocus',
    'handleSubmit', 'onBlur', 'onChange', 'onFocus'];
  return !~writeProps.indexOf(prop);
}

function getSubForm(form, formName, formKey) {
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

function getValue(passedValue, event) {
  if (passedValue !== undefined || !event) {
    // extract value from { value: value } structure. https://github.com/nikgraf/belle/issues/58
    return typeof passedValue === 'object' && passedValue.value ? passedValue.value : passedValue;
  }
  if (event.nativeEvent !== undefined && event.nativeEvent.text !== undefined) {
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

export default function reduxForm(config) {
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

      componentWillMount() {
        const {initialValues, dispatch, formName, formKey} = this.props; // eslint-disable-line no-shadow
        if (initialValues) {
          const {initialize} = formKey ?
            bindActionData(formActions, {form: formName, key: formKey}) :
            bindActionData(formActions, {form: formName});
          dispatch(initialize(initialValues));
        }
      }

      render() {

        // Read props
        const {formName, form, formKey, dispatch, ...passableProps} = this.props; // eslint-disable-line no-shadow
        if (!formName) {
          throw new Error('No form name given to redux-form. Must be passed to ' +
            'connectReduxForm({form: [form name]}) or as a "formName" prop');
        }
        const subForm = getSubForm(form, formName, formKey);

        // Calculate calculable state
        let allValid = true;
        let allPristine = true;
        const values = fields.reduce((accumulator, field) => ({
          ...accumulator,
          [field]: subForm[field] ? subForm[field].value : undefined
        }), {});

        // Create actions
        const {blur, change, focus, initialize, reset, startAsyncValidation, startSubmit, stopAsyncValidation,
          stopSubmit, touch, untouch} = formKey ?
          bindActionData(formActions, {form: formName, key: formKey}) :
          bindActionData(formActions, {form: formName});

        function runAsyncValidation() {
          dispatch(startAsyncValidation(formKey));
          const promise = asyncValidate(values, dispatch);
          if (!promise || typeof promise.then !== 'function') {
            throw new Error('asyncValidate function passed to reduxForm must return a promise!');
          }
          return promise.then(asyncErrors => {
            dispatch(stopAsyncValidation(asyncErrors));
            return isAsyncValid(asyncErrors);
          }, (err) => {
            dispatch(stopAsyncValidation({}));
            throw new Error('redux-form: Asynchronous validation failed: ' + err);
          });
        }

        const handleBlur = (name, value) => (event) => {
          const fieldValue = getValue(value, event);
          const doBlur = bindActionData(blur, {touch: touchOnBlur});
          dispatch(doBlur(name, fieldValue));
          if (asyncValidate && ~asyncBlurFields.indexOf(name)) {
            const syncError = syncValidate({
              ...values,
              [name]: fieldValue
            })[name];
            // only dispatch async call if all synchronous client-side validation passes for this field
            if (!syncError) {
              runAsyncValidation();
            }
          }
        };
        const handleFocus = (name) => () => {
          dispatch(focus(name));
        };
        const handleChange = (name, value) => (event) => {
          const doChange = bindActionData(change, {touch: touchOnChange});
          dispatch(doChange(name, getValue(value, event)));
        };
        const handleSubmit = submitOrEvent => {
          const createEventHandler = submit => event => {
            if (event && event.preventDefault) {
              event.preventDefault();
              event.stopPropagation();
            }
            const submitWithPromiseCheck = () => {
              const result = submit(values);
              if (result && typeof result.then === 'function') {
                // you're showing real promise, kid!
                dispatch(startSubmit());
                return result.then(x => {
                  dispatch(stopSubmit());
                  return x;
                }, x => {
                  dispatch(stopSubmit(x));
                  return x;
                });
              }
            };
            dispatch(touch(...fields));
            if (allValid) {
              if (asyncValidate) {
                return runAsyncValidation().then(asyncValid => {
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
        const syncErrors = syncValidate(values);
        const allFields = fields.reduce((accumulator, name) => {
          const field = subForm[name] || {};
          const pristine = isPristine(field.value, field.initial);
          const error = syncErrors[name] || field.asyncError || field.submitError;
          const valid = isValid(error);
          const fieldBlur = handleBlur(name);
          const fieldChange = handleChange(name);
          const fieldFocus = handleFocus(name);
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
              handleBlur: fieldBlur,
              handleChange: fieldChange,
              handleFocus: fieldFocus,
              invalid: !valid,
              name,
              onBlur: fieldBlur,
              onChange: fieldChange,
              onFocus: fieldFocus,
              onUpdate: fieldChange, // alias to support belle. https://github.com/nikgraf/belle/issues/58
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
          asyncValidate: silenceEvents(runAsyncValidation),
          handleBlur: silenceEvents(handleBlur),
          handleChange: silenceEvents(handleChange),
          handleFocus,
          handleSubmit: silenceEvents(handleSubmit),
          initializeForm: silenceEvents(initialValues => dispatch(initialize(initialValues))),
          resetForm: silenceEvents(() => dispatch(reset())),
          touch: silenceEvents((...touchFields) => dispatch(touch(...touchFields))),
          touchAll: silenceEvents(() => dispatch(touch(...fields))),
          untouch: silenceEvents((...untouchFields) => dispatch(untouch(...untouchFields))),
          untouchAll: silenceEvents(() => dispatch(untouch(...fields))),

          // Other:
          dispatch,
          ...passableProps
        }}/>);
      }
    };
}

