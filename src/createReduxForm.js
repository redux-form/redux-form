import createReduxFormConnector from './createReduxFormConnector';
import hoistStatics from 'hoist-non-react-statics';

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
        const configWithDefaults = {
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

          handleSubmitPassback(submit) {
            this.submit = submit;
          }

          render() {
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
