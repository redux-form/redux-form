import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';

const fieldsFunction = (fields) =>
  ['firstName',
   'lastName',
   'employed',
   (fields.employed && fields.employed.value && 'employerName')].filter(f => f);

class FunctionalFieldsForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  };

  render() {
    const {
      fields: {firstName, lastName, employerName, employed},
      handleSubmit,
      resetForm
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
        <div className="form-group">
          <label className="col-xs-8 col-xs-offset-4 checkbox-inline">
            <input type="checkbox" {...employed}/> Employed?
          </label>
        </div>
        {
          employerName && (
            <div className="form-group">
              <label className="col-xs-4 control-label">Employer Name</label>
              <div className="col-xs-8">
                <input type="text" className="form-control" placeholder="Employer Name" {...employerName}/>
              </div>
            </div>)
        }
        <div className="text-center">
          <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit}>Submit</button>
          <button className="btn btn-default btn-lg" style={{margin: 10}} onClick={resetForm}>Clear Values</button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'fieldsFunction',
  fields: fieldsFunction
})(FunctionalFieldsForm);
