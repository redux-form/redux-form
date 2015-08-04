import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {change, showAll, reset} from './actions';

const getDisplayName = (Comp) => Comp.displayName || Comp.name || 'Component';

/**
 * @param sliceName The key in the state corresponding to the data in this form
 * @param validate A validation function that takes all the data and returns all the errors
 */
export default function reduxForm(sliceName, validate) {
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
      const {slice, dispatch, ...passableProps} = this.props;
      const handleChange = (name) => (event) => dispatch(change(sliceName, name, event.target.value));
      return (<DecoratedComponent
        handleChange={handleChange}
        showAll={() => dispatch(showAll(sliceName))}
        reset={() => dispatch(reset(sliceName))}
        errors={validate(slice.data)}
        data={slice.data}
        visited={slice.visited}
        {...passableProps}/>); // pass other props
    }
  };
}
