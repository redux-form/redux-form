import lazyCache from 'react-lazy-cache';
import getDisplayName from './getDisplayName';
import createHigherOrderComponent from './createHigherOrderComponent';

/**
 * This component tracks props that affect how the form is mounted to the store. Normally these should not change,
 * but if they do, the connected components below it need to be redefined.
 */
const createReduxFormConnector =
  (isReactNative, React) =>
    (WrappedComponent, mapDispatchToProps) => {
      const {Component, PropTypes} = React;
      return class ReduxFormConnector extends Component {
        static displayName = `ReduxFormConnector(${getDisplayName(WrappedComponent)})`;
        static WrappedComponent = WrappedComponent;
        static propTypes = {
          reduxMountPoint: PropTypes.string,
          form: PropTypes.string.isRequired,
          formKey: PropTypes.string
        }

        static defaultProps = {
          reduxMountPoint: 'form'
        }

        constructor(props) {
          super(props);
          this.cache = lazyCache(this, {
            ReduxForm: {
              params: [
                // props that effect how redux-form connects to the redux store
                'reduxMountPoint',
                'form',
                'formKey',
                'initialValues'
              ],
              fn: createHigherOrderComponent(props, isReactNative, React, WrappedComponent, mapDispatchToProps)
            }
          });
        }

        componentWillReceiveProps(nextProps) {
          this.cache.componentWillReceiveProps(nextProps);
        }

        render() {
          const {ReduxForm} = this.cache;
          // remove some redux-form config-only props
          const {reduxMountPoint, form, touchOnBlur, touchOnChange, ...passableProps} = this.props;
          return <ReduxForm {...passableProps}/>;
        }
      };
    };

export default createReduxFormConnector;
