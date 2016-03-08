import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {show as showResults} from '../redux/modules/submission';
export const fields = ['username', 'password'];

const submit = (values, dispatch) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!['john', 'paul', 'george', 'ringo'].includes(values.username)) {
        reject({username: 'User does not exist', _error: 'Login failed!'});
      } else if (values.password !== 'redux-form') {
        reject({password: 'Wrong password', _error: 'Login failed!'});
      } else {
        dispatch(showResults(values));
        resolve();
      }
    }, 1000); // simulate server latency
  });
};

class SubmitValidationForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {fields: {username, password}, error, resetForm, handleSubmit, submitting} = this.props;
    return (<form className="form-horizontal" onSubmit={handleSubmit(submit)}>
        <div className={'form-group' + (username.touched && username.error ? ' has-error' : '')}>
          <label className="col-xs-4 control-label">Username</label>
          <div className={'col-xs-' + (username.touched && username.error ? '5' : '8')}>
            <input type="text" className="form-control" placeholder="Username" {...username}/>
          </div>
          {username.touched && username.error && <div className="col-xs-3 help-block">{username.error}</div>}
        </div>
        <div className={'form-group' + (password.touched && password.error ? ' has-error' : '')}>
          <label className="col-xs-4 control-label">Password</label>
          <div className={'col-xs-' + (password.touched && password.error ? '5' : '8')}>
            <input type="password" className="form-control" placeholder="Password" {...password}/>
          </div>
          {password.touched && password.error && <div className="col-xs-3 help-block">{password.error}</div>}
        </div>
        {error && <div className="text-center text-danger">{error}</div>}
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg" style={{margin: 10}} disabled={submitting}>
            {submitting ? <i className="fa fa-cog fa-spin"/> : <i className="fa fa-paper-plane"/>} Log In
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
  form: 'submitValidation',
  fields
})(SubmitValidationForm);
