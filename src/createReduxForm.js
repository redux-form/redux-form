import createReduxFormConnector from './createReduxFormConnector';

/**
 * The decorator that is the main API to redux-form
 */
const createReduxForm =
  (isReactNative, React) => {
    const ReduxFormConnector = createReduxFormConnector(isReactNative, React);
    return config =>
      DecoratedComponent =>
        props => <ReduxFormConnector {...config} {...props} DecoratedComponent={DecoratedComponent}/>;
  };

export default createReduxForm;
