import LazyCache from 'react-lazy-cache/noGetters';
import getDisplayName from './getDisplayName';
import createHigherOrderComponent from './createHigherOrderComponent';

/**
 * This component tracks props that affect how the form is mounted to the store. Normally these should not change,
 * but if they do, the connected components below it need to be redefined.
 */
const createReduxFormConnector =
  (isReactNative, React, connect) =>
    (WrappedComponent, mapStateToProps, mapDispatchToProps, mergeProps, options) => {
      const {Component, PropTypes} = React;
      class ReduxFormConnector extends Component {
        constructor(props) {
          super(props);
          this.cache = new LazyCache(this, {
            ReduxForm: {
              params: [
                // props that effect how redux-form connects to the redux store
                'reduxMountPoint',
                'form',
                'formKey',
                'getFormState'
              ],
              fn: createHigherOrderComponent(props, isReactNative, React, connect, WrappedComponent,
                mapStateToProps, mapDispatchToProps, mergeProps, options)
            }
          });
        }

        componentWillReceiveProps(nextProps) {
          this.cache.componentWillReceiveProps(nextProps);
        }

        render() {
          const ReduxForm = this.cache.get('ReduxForm');
          // remove some redux-form config-only props
          const {reduxMountPoint, destroyOnUnmount, form, getFormState, touchOnBlur, touchOnChange,
            ...passableProps } = this.props; // eslint-disable-line no-redeclare
          return <ReduxForm {...passableProps}/>;
        }
      }
      ReduxFormConnector.displayName = `ReduxFormConnector(${getDisplayName(WrappedComponent)})`;
      ReduxFormConnector.WrappedComponent = WrappedComponent;
      ReduxFormConnector.propTypes = {
        destroyOnUnmount: PropTypes.bool,
        reduxMountPoint: PropTypes.string,
        form: PropTypes.string.isRequired,
        formKey: PropTypes.string,
        getFormState: PropTypes.func,
        touchOnBlur: PropTypes.bool,
        touchOnChange: PropTypes.bool
      };
      ReduxFormConnector.defaultProps = {
        reduxMountPoint: 'form',
        getFormState: (state, reduxMountPoint) => state[reduxMountPoint]
      };
      return ReduxFormConnector;
    };

export default createReduxFormConnector;
