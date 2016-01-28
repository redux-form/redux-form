import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['email', 'sex'];

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  }
  if (!values.sex) {
    errors.sex = 'Required';
  }
  return errors;
};

class WizardFormSecondPage extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired
  };

  render() {
    const {
      fields: {email, sex},
      handleSubmit,
      previousPage
      } = this.props;
    return (<form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-xs-4 control-label">Email</label>
          <div className={'col-xs-' + (email.touched && email.error ? '5' : '8')}>
            <input type="email" className="form-control" placeholder="Email" {...email}/>
          </div>
          {email.touched && email.error && <div className="col-xs-3 help-block">{email.error}</div>}
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Sex</label>
          <div className={'col-xs-' + (sex.touched && sex.error ? '5' : '8')}>
            <label className="radio-inline">
              <input type="radio" {...sex} value="male" checked={sex.value === 'male'}/> Male
            </label>
            <label className="radio-inline">
              <input type="radio" {...sex} value="female" checked={sex.value === 'female'}/> Female
            </label>
          </div>
          {sex.touched && sex.error && <div className="col-xs-3 help-block">{sex.error}</div>}
        </div>
        <div className="text-center">
          <button type="button" className="btn btn-default btn-lg" style={{margin: 10}} onClick={previousPage}>
            <i className="fa fa-chevron-left"/> Previous
          </button>
          <button type="submit" className="btn btn-primary btn-lg" style={{margin: 10}}>
            Next <i className="fa fa-chevron-right"/>
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'wizard',              // <------ same form name
  fields,                      // <------ only fields on this page
  destroyOnUnmount: false,     // <------ preserve form data
  validate                     // <------ only validates the fields on this page
})(WizardFormSecondPage);
