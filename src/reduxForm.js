import React, {Component, PropTypes} from 'react';
import * as formActions from './actions';
import {getDisplayName, isPristine} from './util';
import bindActionData from './bindActionData';
import {initialState} from './reducer';

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
    return passedValue;
  }
  const {target: {type, value, checked}} = event;
  if (type === 'checkbox') {
    return checked;
  }
  return value;
}

function createReduxFormDecorator(formName, fields, syncValidate, touchOnBlur, touchOnChange, asyncValidate, asyncBlurFields) {
  function combineValidationErrors(form) {
    const syncErrors = syncValidate(form.data);
    const asyncErrors = {valid: true, ...form.asyncErrors};
    const valid = !!(syncErrors.valid && asyncErrors.valid);  // !! to convert falsy to boolean
    return {
      ...syncErrors,
      ...asyncErrors,
      valid
    };
  }

  return DecoratedComponent =>
    class ReduxForm extends Component {
      static displayName = `ReduxForm(${getDisplayName(DecoratedComponent)})`;
      static DecoratedComponent = DecoratedComponent;
      static propTypes = {
        formName: PropTypes.string,
        formKey: PropTypes.string,
        form: PropTypes.object,
        onSubmit: PropTypes.func,
        dispatch: PropTypes.func.isRequired
      }
      static defaultProps = {
        formName
      }

      render() {
        const {formName, form, formKey, dispatch, ...passableProps} = this.props; // eslint-disable-line no-shadow
        const subForm = getSubForm(form, formName, formKey);
        const {blur, change, initialize, reset, startAsyncValidation, startSubmit, stopAsyncValidation,
          stopSubmit, touch, untouch} = formKey ?
          bindActionData(formActions, {form: formName, key: formKey}) :
          bindActionData(formActions, {form: formName});
        const runAsyncValidation = asyncValidate ? () => {
          dispatch(startAsyncValidation(formKey));
          const promise = asyncValidate(subForm.data);
          if (!promise || typeof promise.then !== 'function') {
            throw new Error('asyncValidate function passed to reduxForm must return a promise!');
          }
          return promise.then(asyncErrors => {
            dispatch(stopAsyncValidation(asyncErrors));
            return !!asyncErrors.valid;
          });
        } : undefined;
        const handleBlur = (name, value) => (event) => {
          const fieldValue = getValue(value, event);
          const doBlur = bindActionData(blur, {touch: touchOnBlur});
          dispatch(doBlur(name, fieldValue));
          if (runAsyncValidation && ~asyncBlurFields.indexOf(name)) {
            const syncError = syncValidate({
              ...subForm.data,
              [name]: fieldValue
            })[name];
            // only dispatch async call if all synchronous client-side validation passes for this field
            if (!syncError) {
              runAsyncValidation();
            }
          }
        };
        const pristine = isPristine(subForm.initial, subForm.data);
        const {valid, ...errors} = combineValidationErrors(subForm);
        const handleChange = (name, value) => (event) => {
          const doChange = bindActionData(change, {touch: touchOnChange});
          dispatch(doChange(name, getValue(value, event)));
        };
        const handleSubmit = submitOrEvent => {
          const createEventHandler = submit => event => {
            if (event) {
              event.preventDefault();
            }
            const submitWithPromiseCheck = () => {
              const result = submit(subForm.data);
              if (result && typeof result.then === 'function') {
                // you're showing real promise, kid!
                const stopAndReturn = (x) => {
                  dispatch(stopSubmit());
                  return x;
                };
                dispatch(startSubmit());
                result.then(stopAndReturn, stopAndReturn);
              }
            };
            dispatch(touch(...fields));
            if (runAsyncValidation) {
              return runAsyncValidation().then(asyncValid => {
                if (valid && asyncValid) {
                  return submitWithPromiseCheck(subForm.data);
                }
              });
            } else if (valid) {
              return submitWithPromiseCheck(subForm.data);
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
        return (<DecoratedComponent
          asyncValidate={runAsyncValidation}
          asyncValidating={subForm.asyncValidating}
          data={subForm.data}
          dirty={!pristine}
          dispatch={dispatch}
          errors={errors}
          formKey={formKey}
          handleBlur={handleBlur}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          initializeForm={data => dispatch(initialize(data))}
          invalid={!valid}
          pristine={pristine}
          resetForm={() => dispatch(reset())}
          submitting={subForm.submitting}
          touch={(...touchFields) => dispatch(touch(...touchFields))}
          touched={subForm.touched}
          touchAll={() => dispatch(touch(...fields))}
          untouch={(...untouchFields) => dispatch(untouch(...untouchFields))}
          untouchAll={() => dispatch(untouchAll(...fields))}
          valid={valid}
          {...passableProps}/>); // pass other props
      }
    };
}

export default
function reduxForm(formName, fields, syncValidate = () => ({valid: true}), touchOnBlur = true, touchOnChange = false) {
  const decorator = createReduxFormDecorator(formName, fields, syncValidate, !!touchOnBlur, !!touchOnChange);
  decorator.async = (asyncValidate, ...blurFields) => {
    return createReduxFormDecorator(formName, fields, syncValidate, !!touchOnBlur, !!touchOnChange, asyncValidate,
      Array.isArray(blurFields[0]) ? blurFields[0] : blurFields);
  };
  return decorator;
}
