import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {change, validate, reset} from './actions';

const getDisplayName = (Comp) => Comp.displayName || Comp.name || 'Component';

/**
 * @param sliceName The key in the state corresponding to the data in this form
 * @param changeCreator An action creator to accept changes in the form changeCreator(sliceName, field, value)
 */
export default function reduxForm(sliceName) {
  return DecoratedComponent => @connect(state => ({
    slice: state[sliceName]
  }))
  class ReduxForm extends Component {
    static displayName = `ReduxForm(${getDisplayName(DecoratedComponent)})`;
    static DecoratedComponent = DecoratedComponent;
    static propTypes = {
      slice: PropTypes.object,
      dispatch: PropTypes.func.isRequired
    }

    render() {
      const {slice, dispatch} = this.props;
      const handleChange = (name) => (event) => dispatch(change(sliceName, name, event.target.value));
      return (<DecoratedComponent
        handleChange={handleChange}
        validate={() => dispatch(validate(sliceName))}
        reset={() => dispatch(reset(sliceName))}
        {...slice}/>);
    }
  };
}
