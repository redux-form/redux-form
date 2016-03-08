import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['firstName', 'lastName'];

class AlternateMountPointForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.resetForm,
    submitting: PropTypes.bool.isRequired
  }

  render() {
    const {
      fields: {firstName, lastName},
      handleSubmit,
      resetForm,
      submitting
      } = this.props;
    return (<form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-xs-4 control-label">First Name</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="First Name" {...firstName}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Last Name</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="Last Name" {...lastName}/>
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg" style={{margin: 10}} disabled={submitting}>
            {submitting ? <i className="fa fa-cog fa-spin"/> : <i className="fa fa-paper-plane"/>} Submit
          </button>
          <button type="button" className="btn btn-default btn-lg" style={{margin: 10}} disabled={submitting} onClick={resetForm}>
            Clear Values
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'alternateMountPoint',
  fields,
  reduxMountPoint: 'alternate'  // <-------- alternate mount point specified
})(AlternateMountPointForm);
