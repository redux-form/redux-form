import React from 'react';
import {reduxForm} from 'redux-form';
import {show as showResults} from '../redux/modules/submission';
export const fields = ['username', 'password'];

const submit = (values, dispatch) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!['john', 'paul', 'george', 'ringo'].includes(values.username)) {
        reject({username: 'User does not exist'});
      } else if (values.password !== 'redux-form') {
        reject({password: 'Wrong password'});
      } else {
        dispatch(showResults(values));
        resolve();
      }
    }, 1000); // simulate server latency
  });
};

const SubmitValidationForm = props => {
  const {fields: {username, password}, resetForm, handleSubmit, submitting} = props;
  return (<form className="form-horizontal" onSubmit={handleSubmit(submit)}>
      <div className={'form-group' + (username.touched && username.error ? ' has-error' : '')}>
        <label className="col-xs-4 control-label">Username</label>
        <div className={'col-xs-' + (username.touched && username.error ? '5' : '8')}>
          <input type="text" className="col-xs-8 form-control" placeholder="Username" {...username}/>
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
        <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit(submit)}>
          {!submitting && <i className="fa fa-key"/> /* key icon */}
          {submitting && <i className="fa fa-cog fa-spin"/> /* spinning cog icon */} Log In
        </button>
        <button className="btn btn-default btn-lg" style={{margin: 10}} onClick={resetForm}>Clear Values</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'submitValidation',
  fields
})(SubmitValidationForm);
