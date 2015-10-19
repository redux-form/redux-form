import createReduxFormConnector from './createReduxFormConnector';
import hoistStatics from 'hoist-non-react-statics';

/**
 * The decorator that is the main API to redux-form
 */
const createReduxForm =
  (isReactNative, React) => {
    const reduxFormConnector = createReduxFormConnector(isReactNative, React);
    return (config, mapDispatchToProps) =>
      WrappedComponent => {
        const ReduxFormConnector = reduxFormConnector(WrappedComponent, mapDispatchToProps);
        const configWithDefaults = {
          touchOnBlur: true,
          touchOnChange: false,
          destroyOnUnmount: true,
          ...config
        };
        const ConnectedForm = props => (<ReduxFormConnector
          {...configWithDefaults}
          {...props}/>);
        return hoistStatics(ConnectedForm, WrappedComponent);
      };
  };

export default createReduxForm;
