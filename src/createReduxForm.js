import createReduxFormConnector from './createReduxFormConnector';

/**
 * The decorator that is the main API to redux-form
 */
const createReduxForm =
  (isReactNative, React) => {
    const ReduxFormConnector = createReduxFormConnector(isReactNative, React);
    return (config, mapDispatchToProps) =>
      WrappedComponent =>
        props => (<ReduxFormConnector
          {...config}
          {...props}
          {...{
            mapDispatchToProps,
            WrappedComponent
          }}/>);
  };

export default createReduxForm;
