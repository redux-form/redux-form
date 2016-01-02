import * as importedActions from './actions';
import getDisplayName from './getDisplayName';
import {initialState} from './reducer';
import deepEqual from 'deep-equal';
import bindActionData from './bindActionData';
import getValues from './getValues';
import isValid from './isValid';
import readFields from './readFields';
import handleSubmit from './handleSubmit';
import asyncValidation from './asyncValidation';
import silenceEvents from './events/silenceEvents';
import silenceEvent from './events/silenceEvent';
import wrapMapDispatchToProps from './wrapMapDispatchToProps';
import wrapMapStateToProps from './wrapMapStateToProps';

/**
 * Creates a HOC that knows how to create redux-connected sub-components.
 */
const createHigherOrderComponent = (config,
                                    isReactNative,
                                    React,
                                    connect,
                                    WrappedComponent,
                                    mapStateToProps,
                                    mapDispatchToProps) => {
  const {Component, PropTypes} = React;
  return (reduxMountPoint, formName, formKey, getFormState) => {
    class ReduxForm extends Component {
      constructor(props) {
        super(props);
        // bind functions
        this.asyncValidate = this.asyncValidate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fields = readFields(props, {}, {}, this.asyncValidate, isReactNative);
      }

      componentWillMount() {
        const {fields, form, initialize, initialValues} = this.props;
        if (initialValues && !form._initialized) {
          initialize(initialValues, fields);
        }
      }

      componentWillReceiveProps(nextProps) {
        if (!deepEqual(this.props.fields, nextProps.fields) || !deepEqual(this.props.form, nextProps.form)) {
          this.fields = readFields(nextProps, this.props, this.fields, this.asyncValidate, isReactNative);
        }
        if (!deepEqual(this.props.initialValues, nextProps.initialValues)) {
          this.props.initialize(nextProps.initialValues, nextProps.fields);
        }
      }

      componentWillUnmount() {
        if (config.destroyOnUnmount) {
          this.props.destroy();
        }
      }

      asyncValidate(name, value) {
        const {asyncValidate, dispatch, fields, form, startAsyncValidation, stopAsyncValidation, validate} = this.props;
        if (asyncValidate) {
          const values = getValues(fields, form);
          if (name) {
            values[name] = value;
          }
          const syncErrors = validate(values, this.props);

          // if blur validating, only run async validate if sync validation passes
          if (!name || isValid(syncErrors[name])) {
            return asyncValidation(() =>
              asyncValidate(values, dispatch, this.props), startAsyncValidation, stopAsyncValidation, name);
          }
        }
      }

      handleSubmit(submitOrEvent) {
        const {onSubmit, fields, form} = this.props;
        const check = submit => {
          if (!submit || typeof submit !== 'function') {
            throw new Error('You must either pass handleSubmit() an onSubmit function or pass onSubmit as a prop');
          }
          return submit;
        };
        return !submitOrEvent || silenceEvent(submitOrEvent) ?
          // submitOrEvent is an event: fire submit
          handleSubmit(check(onSubmit), getValues(fields, form), this.props, this.asyncValidate) :
          // submitOrEvent is the submit function: return deferred submit thunk
          silenceEvents(event => {
            silenceEvent(event);
            handleSubmit(check(submitOrEvent), getValues(fields, form), this.props, this.asyncValidate);
          });
      }

      render() {
        const allFields = this.fields;
        const {addArrayValue, asyncBlurFields, blur, change, destroy, focus, fields, form, initialValues, initialize,
          onSubmit, propNamespace, reset, removeArrayValue, returnRejectedSubmitPromise, startAsyncValidation,
          startSubmit, stopAsyncValidation, stopSubmit, submitFailed, touch, untouch, validate,
          ...passableProps} = this.props; // eslint-disable-line no-redeclare
        const {allPristine, allValid, errors, formError, values} = allFields._meta;

        const props = {
          // State:
          active: form._active,
          asyncValidating: form._asyncValidating,
          dirty: !allPristine,
          error: formError,
          errors,
          fields: allFields,
          formKey,
          invalid: !allValid,
          pristine: allPristine,
          submitting: form._submitting,
          submitFailed: form._submitFailed,
          valid: allValid,
          values,

          // Actions:
          asyncValidate: silenceEvents(() => this.asyncValidate()),
          // ^ doesn't just pass this.asyncValidate to disallow values passing
          destroyForm: silenceEvents(destroy),
          handleSubmit: this.handleSubmit,
          initializeForm: silenceEvents(initValues => initialize(initValues, fields)),
          resetForm: silenceEvents(reset),
          touch: silenceEvents((...touchFields) => touch(...touchFields)),
          touchAll: silenceEvents(() => touch(...fields)),
          untouch: silenceEvents((...untouchFields) => untouch(...untouchFields)),
          untouchAll: silenceEvents(() => untouch(...fields))
        };
        const passedProps = propNamespace ? {[propNamespace]: props} : props;
        return (<WrappedComponent {...{
          ...passableProps, // contains dispatch
          ...passedProps
        }}/>);
      }
    }
    ReduxForm.displayName = `ReduxForm(${getDisplayName(WrappedComponent)})`;
    ReduxForm.WrappedComponent = WrappedComponent;
    ReduxForm.propTypes = {
      // props:
      asyncBlurFields: PropTypes.arrayOf(PropTypes.string),
      asyncValidate: PropTypes.func,
      dispatch: PropTypes.func.isRequired,
      fields: PropTypes.arrayOf(PropTypes.string).isRequired,
      form: PropTypes.object,
      initialValues: PropTypes.any,
      onSubmit: PropTypes.func,
      propNamespace: PropTypes.string,
      readonly: PropTypes.bool,
      returnRejectedSubmitPromise: PropTypes.bool,
      validate: PropTypes.func,

      // actions:
      addArrayValue: PropTypes.func.isRequired,
      blur: PropTypes.func.isRequired,
      change: PropTypes.func.isRequired,
      destroy: PropTypes.func.isRequired,
      focus: PropTypes.func.isRequired,
      initialize: PropTypes.func.isRequired,
      removeArrayValue: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
      startAsyncValidation: PropTypes.func.isRequired,
      startSubmit: PropTypes.func.isRequired,
      stopAsyncValidation: PropTypes.func.isRequired,
      stopSubmit: PropTypes.func.isRequired,
      submitFailed: PropTypes.func.isRequired,
      touch: PropTypes.func.isRequired,
      untouch: PropTypes.func.isRequired
    };
    ReduxForm.defaultProps = {
      asyncBlurFields: [],
      form: initialState,
      readonly: false,
      returnRejectedSubmitPromise: false,
      validate: () => ({})
    };

    // bind touch flags to blur and change
    const unboundActions = {
      ...importedActions,
      blur: bindActionData(importedActions.blur, {
        touch: !!config.touchOnBlur
      }),
      change: bindActionData(importedActions.change, {
        touch: !!config.touchOnChange
      })
    };

    // make redux connector with or without form key
    const decorate = formKey !== undefined && formKey !== null ?
      connect(
        wrapMapStateToProps(mapStateToProps, state => {
          const formState = getFormState(state, reduxMountPoint);
          if (!formState) {
            throw new Error(`You need to mount the redux-form reducer at "${reduxMountPoint}"`);
          }
          return formState && formState[formName] && formState[formName][formKey];
        }),
        wrapMapDispatchToProps(mapDispatchToProps, bindActionData(unboundActions, {form: formName, key: formKey}))
      ) :
      connect(
        wrapMapStateToProps(mapStateToProps, state => {
          const formState = getFormState(state, reduxMountPoint);
          if (!formState) {
            throw new Error(`You need to mount the redux-form reducer at "${reduxMountPoint}"`);
          }
          return formState && formState[formName];
        }),
        wrapMapDispatchToProps(mapDispatchToProps, bindActionData(unboundActions, {form: formName}))
      );

    return decorate(ReduxForm);
  };
};

export default createHigherOrderComponent;
