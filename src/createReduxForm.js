import createReduxFormConnector from './createReduxFormConnector';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';

/**
 * The decorator that is the main API to redux-form
 */
const createReduxForm =
  (isReactNative, React, connect) => {
    const {Component} = React;
    const reduxFormConnector = createReduxFormConnector(isReactNative, React, connect);
    return (config, mapStateToProps, mapDispatchToProps, mergeProps, options) =>
      WrappedComponent => {
        const ReduxFormConnector = reduxFormConnector(WrappedComponent, mapStateToProps, mapDispatchToProps, mergeProps, options);
        const { withRef = false } = (options || {});
        const configWithDefaults = {
          overwriteOnInitialValuesChange: true,
          touchOnBlur: true,
          touchOnChange: false,
          destroyOnUnmount: true,
          ...config
        };
        class ConnectedForm extends Component {
          constructor(props) {
            super(props);

            this.handleSubmitPassback = this.handleSubmitPassback.bind(this);
          }

          getWrappedInstance() {
            invariant(withRef,
              `To access the wrapped instance, you need to specify ` +
              `{ withRef: true } as the fourth argument of the connect() call.`
            );
            return this.refs.wrappedInstance.refs.wrappedInstance.getWrappedInstance().refs.wrappedInstance;
          }

          handleSubmitPassback(submit) {
            this.submit = submit;
          }

          render() {
            if ( withRef ) {
              return (<ReduxFormConnector
                {...configWithDefaults}
                {...this.props}
                ref="wrappedInstance"
                submitPassback={this.handleSubmitPassback}/>);
            }
            return (<ReduxFormConnector
              {...configWithDefaults}
              {...this.props}
              submitPassback={this.handleSubmitPassback}/>);
          }
        }
        return hoistStatics(ConnectedForm, WrappedComponent);
      };
  };

export default createReduxForm;
