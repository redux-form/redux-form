import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {load as loadAccount} from '../redux/modules/account';
export const fields = ['firstName', 'lastName', 'age', 'bio'];
const data = {  // used to populate "account" reducer when "Load" is clicked
  firstName: 'John',
  lastName: 'Doe',
  age: '42',
  bio: 'Born to write amazing Redux code.'
};

class InitializingFromStateForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired
  };

  render() {
    const {fields: {firstName, lastName, age, bio}, handleSubmit, load} = this.props;
    return (
      <div>
        <div style={{textAlign: 'center', marginBottom: 20}}>
          <button onClick={() => load(data)} className="btn btn-success btn-lg">Load Account</button>
        </div>
        <form className="form-horizontal" onSubmit={handleSubmit}>
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
            <label className="col-xs-4 control-label">Age</label>
            <div className="col-xs-8">
              <input type="number" className="form-control" placeholder="Age" {...age}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-4 control-label">Occupation</label>
            <div className="col-xs-8">
              <textarea className="form-control" placeholder="Biography" {...bio}/>
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit}>Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'initializing',
  fields
},
state => ({ // mapStateToProps
  initialValues: state.account.data // will pull state into form's initialValues
}),
{load: loadAccount}      // mapDispatchToProps (will bind action creator to dispatch)
)(InitializingFromStateForm);
