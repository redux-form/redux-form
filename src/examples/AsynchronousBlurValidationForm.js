import React from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['username', 'password'];

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

const asyncValidate = (values/*, dispatch */) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (['john', 'paul', 'george', 'ringo'].includes(values.username)) {
        reject({username: 'That username is taken'});
      } else {
        resolve();
      }
    }, 1000); // simulate server latency
  });
};

const AsynchronousBlurValidationForm = props => {
  const {asyncValidating, fields: {username, password}, resetForm, handleSubmit} = props;
  return (<form className="form-horizontal" onSubmit={handleSubmit}>
      <div className={'form-group' + (username.touched && username.error ? ' has-error' : '')}>
        <label className="col-xs-4 control-label">Username</label>
        <div className={'col-xs-' + (username.touched && username.error ? '5' : '8')} style={{position: 'relative'}}>
          <input type="text" className="col-xs-8 form-control" placeholder="Username" {...username}/>
          {asyncValidating && <i className="fa fa-cog fa-spin" /* spinning cog */ style={{
            position: 'absolute',
            right: 25,
            top: 10
          }}/>}
        </div>
        {username.touched && username.error && <div className="col-xs-3 help-block">{username.error}</div>}
      </div>
      <div className={'form-group' + (password.touched && password.error ? ' has-error' : '')}>
        <label className="col-xs-4 control-label">Email</label>
        <div className={'col-xs-' + (password.touched && password.error ? '5' : '8')}>
          <input type="password" className="col-xs-8 form-control" placeholder="Password" {...password}/>
        </div>
        {password.touched && password.error && <div className="col-xs-3 help-block">{password.error}</div>}
      </div>
      <div className="text-center">
        <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit}>Sign Up</button>
        <button className="btn btn-default btn-lg" style={{margin: 10}} onClick={resetForm}>Clear Values</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'asynchronousBlurValidation',
  fields,
  asyncValidate,
  asyncBlurFields: ['username'],
  validate
})(AsynchronousBlurValidationForm);
