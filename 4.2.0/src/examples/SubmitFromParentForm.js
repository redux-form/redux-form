import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['username', 'password'];

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

class SubmitFromParentForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired
  };

  render() {
    const {fields: {username, password}} = this.props;
    return (
      <div>
        <div className={'form-group' + (username.touched && username.error ? ' has-error' : '')}>
          <label className="col-xs-4 control-label">Username</label>
          <div className={'col-xs-' + (username.touched && username.error ? '5' : '8')}>
            <input type="text" className="col-xs-8 form-control" placeholder="Username" {...username}/>
          </div>
          {username.touched && username.error && <div className="col-xs-3 help-block">{username.error}</div>}
        </div>
        <div className={'form-group' + (password.touched && password.error ? ' has-error' : '')}>
          <label className="col-xs-4 control-label">Password</label>
          <div className={'col-xs-' + (password.touched && password.error ? '5' : '8')}>
            <input type="password" className="col-xs-8 form-control" placeholder="Password" {...password}/>
          </div>
          {password.touched && password.error && <div className="col-xs-3 help-block">{password.error}</div>}
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'submitFromParent',
  fields,
  validate
})(SubmitFromParentForm);
