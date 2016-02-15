import React, {Component, PropTypes} from 'react';
import {reset} from 'redux-form';     // reset action creator exported by redux-form
import {connect} from 'react-redux';  // needed to bind reset action creator to dispatch
import SubmitFromParentForm from './SubmitFromParentForm';

class SubmitFromParentContainer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,  // shows a dialog box
    reset: PropTypes.func.isRequired      // reset action bound to dispatch
  };

  constructor(props) {
    super(props);
    // Pro tip: The best place to bind your member functions is in the component constructor
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  handleSubmit() {
    this.refs.myForm.submit();  // will return a promise
  }

  resetForm() {
    this.props.reset('submitFromParent'); // pass form name to bound action creator
  }

  render() {
    const {onSubmit} = this.props;
    return (
      <div className="form-horizontal">
        <SubmitFromParentForm ref="myForm" onSubmit={onSubmit}/>
        <div className="text-center">
          <button type="button" className="btn btn-primary btn-lg" style={{margin: 10}} onClick={this.handleSubmit}>
            <i className="fa fa-paper-plane"/> Submit
          </button>
          <button type="button" className="btn btn-default btn-lg" style={{margin: 10}} onClick={this.resetForm}>
            Clear Values
          </button>
        </div>
      </div>
    );
  }
}

export default connect(undefined, {reset})(SubmitFromParentContainer);
