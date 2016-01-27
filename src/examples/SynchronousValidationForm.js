import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['username', 'email', 'age'];

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.age) {
    errors.age = 'Required';
  } else if (isNaN(Number(values.age))) {
    errors.age = 'Must be a number';
  } else if (Number(values.age) < 18) {
    errors.age = 'Sorry, you must be at least 18 years old';
  }
  return errors;
};

class SynchronousValidationForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {fields: {username, email, age}, resetForm, handleSubmit, submitting} = this.props;
    return (<form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={'form-group' + (username.touched && username.error ? ' has-error' : '')}>
          <label className="col-xs-4 control-label">Username</label>
          <div className={'col-xs-' + (username.touched && username.error ? '5' : '8')}>
            <input type="text" className="col-xs-8 form-control" placeholder="Username" {...username}/>
          </div>
          {username.touched && username.error && <div className="col-xs-3 help-block">{username.error}</div>}
        </div>
        <div className={'form-group' + (email.touched && email.error ? ' has-error' : '')}>
          <label className="col-xs-4 control-label">Email</label>
          <div className={'col-xs-' + (email.touched && email.error ? '5' : '8')}>
            <input type="text" className="col-xs-8 form-control" placeholder="Email" {...email}/>
          </div>
          {email.touched && email.error && <div className="col-xs-3 help-block">{email.error}</div>}
        </div>
        <div className={'form-group' + (age.touched && age.error ? ' has-error' : '')}>
          <label className="col-xs-4 control-label">Age</label>
          <div className={'col-xs-' + (age.touched && age.error ? '5' : '8')}>
            <input type="text" className="col-xs-8 form-control" placeholder="Age" {...age}/>
          </div>
          {age.touched && age.error && <div className="col-xs-3 help-block">{age.error}</div>}
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
  form: 'synchronousValidation',
  fields,
  validate
})(SynchronousValidationForm);
