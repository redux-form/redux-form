import {connect} from 'react-redux';
import * as unboundActions from './actions';
import getDisplayName from './getDisplayName';
import {initialState} from './reducer';
import deepEqual from 'deep-equal';
import bindActionData from './bindActionData';
import readFields from './readFields';
import silenceEvents from './events/silenceEvents';

/**
 * Creates a HOC that knows how to create redux-connected sub-components.
 */
const createHigherOrderComponent = (config, isReactNative, React, WrappedComponent) => {
  const {Component, PropTypes} = React;
  return (reduxMountPoint, formName, formKey) => {
    class ReduxFormHOC extends Component {
      static displayName = `ReduxFormHOC(${getDisplayName(WrappedComponent)})`;
      static propTypes = {
        // props:
        dispatch: PropTypes.func.isRequired,
        fields: PropTypes.arrayOf(PropTypes.string).isRequired,
        form: PropTypes.func,
        initialValues: PropTypes.object,
        onSubmit: PropTypes.func,
        validate: PropTypes.func,

        // actions:
        blur: PropTypes.func.isRequired,
        change: PropTypes.func.isRequired,
        destroy: PropTypes.func.isRequired,
        focus: PropTypes.func.isRequired,
        initialize: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        startAsyncValidation: PropTypes.func.isRequired,
        startSubmit: PropTypes.func.isRequired,
        stopAsyncValidation: PropTypes.func.isRequired,
        stopSubmit: PropTypes.func.isRequired,
        touch: PropTypes.func.isRequired,
        untouch: PropTypes.func.isRequired
      }

      static defaultProps = {
        form: initialState,
        validate: () => {
        }
      }

      constructor(props) {
        super(props);
        this.fields = readFields(props, {}, isReactNative);
      }

      componentWillReceiveProps(nextProps) {
        if (!deepEqual(this.props.fields, nextProps.fields) || !deepEqual(this.props.form, nextProps.form)) {
          this.fields = readFields(nextProps, this.fields, isReactNative);
        }
      }

      componentWillUnmount() {
        if (config.destroyOnUnmount) {
          this.props.destroy();
        }
      }

      static WrappedComponent = WrappedComponent;

      render() {
        const allFields = this.fields;
        const {form, blur, change, destroy, focus, fields, initialValues, initialize, onSubmit, reset,
          startAsyncValidation, startSubmit, stopAsyncValidation, stopSubmit, touch, untouch, validate,
          ...passableProps} = this.props;
        const {allPristine, syncErrors, values} = allFields;
        let {
          allValid
          }
          = allFields;
        const formError = syncErrors._error || form._error;
        if (formError) {
          allValid = false;
        }

        return (<WrappedComponent {...{
          ...passableProps, // contains dispatch

          // State:
          active: form._active,
          asyncValidating: form._asyncValidating,
          dirty: !allPristine,
          error: formError,
          fields: allFields,
          formKey,
          invalid: !allValid,
          pristine: allPristine,
          submitting: form._submitting,
          valid: allValid,
          values,

          // Actions:
          //asyncValidate: silenceEvents(() => this.runAsyncValidation(actions, values)),
          destroyForm: silenceEvents(destroy),
          //handleSubmit: silenceEvents(handleSubmit),
          initializeForm: silenceEvents(initialize),
          resetForm: silenceEvents(reset),
          touch: silenceEvents((...touchFields) => touch(...touchFields)),
          touchAll: silenceEvents(() => touch(...fields)),
          untouch: silenceEvents((...untouchFields) => untouch(...untouchFields)),
          untouchAll: silenceEvents(() => untouch(...fields))
        }}/>);
      }
    }


    unboundActions.blur = bindActionData(unboundActions.blur, {touch: config.touchOnBlur});
    unboundActions.change = bindActionData(unboundActions.change, {touch: config.touchOnChange});

    const decorate = formKey ?
      connect(state => state[reduxMountPoint][formName][formKey],
        bindActionData(unboundActions, {form: formName, key: formKey})) :
      connect(state => state[reduxMountPoint][formName],
        bindActionData(unboundActions, {form: formName}));

    return decorate(ReduxFormHOC);
  };
};

export default createHigherOrderComponent;
