import React, {Component, PropTypes} from 'react';
import {blur, change, initialize, reset, startAsyncValidation, stopAsyncValidation,
  touch, touchAll, untouch, untouchAll} from './actions';
import {getDisplayName, isPristine} from './util';

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
        form: PropTypes.object.isRequired,
        onSubmit: PropTypes.func,
        dispatch: PropTypes.func.isRequired
      }
      static defaultProps = {
        sliceName
      }

      render() {
        const {form, sliceName, dispatch, ...passableProps} = this.props; // eslint-disable-line no-shadow
        const runAsyncValidation = asyncValidate ? () => {
          dispatch(startAsyncValidation(sliceName));
          const promise = asyncValidate(form.data);
          if (!promise || typeof promise.then !== 'function') {
            throw new Error('asyncValidate function passed to reduxForm must return a promise!');
          }
          return promise.then(asyncErrors => {
            dispatch(stopAsyncValidation(sliceName, asyncErrors));
            return !!asyncErrors.valid;
          });
        } : undefined;
        const handleBlur = (name, value) => (event) => {
          const fieldValue = value || event.target.value;
          dispatch(blur(sliceName, name, fieldValue));
          if (runAsyncValidation && ~asyncBlurFields.indexOf(name)) {
            const syncError = syncValidate({
              ...form.data,
              [name]: fieldValue
            })[name];
            // only dispatch async call if all synchronous client-side validation passes for this field
            if (!syncError) {
              runAsyncValidation();
            }
          }
        };
        const pristine = isPristine(form.initial, form.data);
        const {valid, ...errors} = combineValidationErrors(form);
        const handleChange = (name, value) => (event) => dispatch(change(sliceName, name, value || event.target.value));
        const handleSubmit = submitOrEvent => {
          const createEventHandler = submit => event => {
            if (event) {
              event.preventDefault();
            }
            dispatch(touchAll(sliceName));
            if (runAsyncValidation) {
              runAsyncValidation().then(asyncValid => {
                if (valid && asyncValid) {
                  submit(form.data);
                }
              });
            } else if (valid) {
              submit(form.data);
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
          asyncValidating={form.asyncValidating}
          data={form.data}
          dirty={!pristine}
          dispatch={dispatch}
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          initializeForm={data => dispatch(initialize(sliceName, data))}
          invalid={!valid}
          pristine={pristine}
          resetForm={() => dispatch(reset(sliceName))}
          touch={(...touchFields) => dispatch(touch(sliceName, ...touchFields))}
          touched={form.touched}
          touchAll={() => dispatch(touchAll(sliceName))}
          untouch={(...untouchFields) => dispatch(untouch(sliceName, ...untouchFields))}
          untouchAll={() => dispatch(untouchAll(sliceName))}
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
