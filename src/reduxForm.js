import React, {Component, PropTypes} from 'react';
import * as formActions from './actions';
import {getDisplayName, isPristine} from './util';
import bindSliceKey from './bindSliceKey';
import {initialState} from './createFormReducer';

function createReduxFormDecorator(sliceName, syncValidate, asyncValidate, asyncBlurFields) {
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
        sliceName: PropTypes.string,
        sliceKey: PropTypes.string,
        form: PropTypes.object,
        onSubmit: PropTypes.func,
        dispatch: PropTypes.func.isRequired
      }
      static defaultProps = {
        sliceName
      }

      render() {
        const {form, sliceName, sliceKey, dispatch, ...passableProps} = this.props; // eslint-disable-line no-shadow
        const reslicedForm = (sliceKey && form ? form[sliceKey] : form) || initialState;
        const {blur, change, initialize, reset, startAsyncValidation, startSubmit, stopAsyncValidation,
          stopSubmit, touch, touchAll, untouch, untouchAll} =
          sliceKey ? bindSliceKey(formActions, sliceKey) : formActions;
        const runAsyncValidation = asyncValidate ? () => {
          dispatch(startAsyncValidation(sliceName, sliceKey));
          const promise = asyncValidate(reslicedForm.data);
          if (!promise || typeof promise.then !== 'function') {
            throw new Error('asyncValidate function passed to reduxForm must return a promise!');
          }
          return promise.then(asyncErrors => {
            dispatch(stopAsyncValidation(sliceName, asyncErrors, sliceKey));
            return !!asyncErrors.valid;
          });
        } : undefined;
        const handleBlur = (name, value) => (event) => {
          const fieldValue = value || event.target.value;
          dispatch(blur(sliceName, name, fieldValue, sliceKey));
          if (runAsyncValidation && ~asyncBlurFields.indexOf(name)) {
            const syncError = syncValidate({
              ...reslicedForm.data,
              [name]: fieldValue
            })[name];
            // only dispatch async call if all synchronous client-side validation passes for this field
            if (!syncError) {
              runAsyncValidation();
            }
          }
        };
        const pristine = isPristine(reslicedForm.initial, reslicedForm.data);
        const {valid, ...errors} = combineValidationErrors(reslicedForm);
        const handleChange = (name, value) => (event) => dispatch(change(sliceName, name, value || event.target.value, sliceKey));
        const handleSubmit = submitOrEvent => {
          const createEventHandler = submit => event => {
            if (event) {
              event.preventDefault();
            }
            const submitWithPromiseCheck = () => {
              const result = submit(reslicedForm.data);
              if (result && typeof result.then === 'function') {
                // you're showing real promise, kid!
                const stopAndReturn = (x) => {
                  dispatch(stopSubmit(sliceName));
                  return x;
                };
                dispatch(startSubmit(sliceName));
                result.then(stopAndReturn, stopAndReturn);
              }
            };
            dispatch(touchAll(sliceName, sliceKey));
            if (runAsyncValidation) {
              return runAsyncValidation().then(asyncValid => {
                if (valid && asyncValid) {
                  return submitWithPromiseCheck(reslicedForm.data);
                }
              });
            } else if (valid) {
              return submitWithPromiseCheck(reslicedForm.data);
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
          asyncValidating={reslicedForm.asyncValidating}
          data={reslicedForm.data}
          dirty={!pristine}
          dispatch={dispatch}
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          initializeForm={data => dispatch(initialize(sliceName, data, sliceKey))}
          invalid={!valid}
          pristine={pristine}
          resetForm={() => dispatch(reset(sliceName, sliceKey))}
          sliceKey={sliceKey}
          submitting={reslicedForm.submitting}
          touch={(...touchFields) => dispatch(touch(sliceName, ...touchFields, sliceKey))}
          touched={reslicedForm.touched}
          touchAll={() => dispatch(touchAll(sliceName, sliceKey))}
          untouch={(...untouchFields) => dispatch(untouch(sliceName, ...untouchFields, sliceKey))}
          untouchAll={() => dispatch(untouchAll(sliceName, sliceKey))}
          valid={valid}
          {...passableProps}/>); // pass other props
      }
    };
}

export default function reduxForm(sliceName, syncValidate = () => ({valid: true})) {
  const decorator = createReduxFormDecorator(sliceName, syncValidate);
  decorator.async = (asyncValidate, ...fields) => {
    const blurFields = Array.isArray(fields[0]) ? fields[0] : fields;
    return createReduxFormDecorator(sliceName, syncValidate, asyncValidate, blurFields);
  };
  return decorator;
}
