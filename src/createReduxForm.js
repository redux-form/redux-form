import createReduxFormConnector from './createReduxFormConnector';
import hoistStatics from 'hoist-non-react-statics';

/**
 * The decorator that is the main API to redux-form
 */
const createReduxForm =
  (isReactNative, React) => {
    const {Component} = React;
    const reduxFormConnector = createReduxFormConnector(isReactNative, React);
    return (config, mapStateToProps, mapDispatchToProps) =>
      WrappedComponent => {
        const ReduxFormConnector = reduxFormConnector(WrappedComponent, mapStateToProps, mapDispatchToProps);
        const configWithDefaults = {
          touchOnBlur: true,
          touchOnChange: false,
          destroyOnUnmount: true,
          ...config
        };
        class ConnectedForm extends Component {
          render() {
            return (<ReduxFormConnector
              {...configWithDefaults}
              {...this.props}/>);
          }
        }
        return hoistStatics(ConnectedForm, WrappedComponent);
      };
  };

export default createReduxForm;
