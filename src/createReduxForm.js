import createReduxFormConnector from './createReduxFormConnector';

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
        return props => (<ReduxFormConnector
          {...configWithDefaults}
          {...props}/>);
      };
  };

export default createReduxForm;
