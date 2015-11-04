import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {load as loadAccount} from '../redux/modules/account';
export const fields = ['firstName', 'lastName', 'age', 'occupation'];
const data = {  // used to populate "account" reducer when "Load" is clicked
  firstName: 'John',
  lastName: 'Doe',
  age: '42',
  occupation: 'Redux Coding Ninja'
};

class InitializingFromStateForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  };

  render() {
    const {
      fields: {firstName, lastName, age, occupation},
      handleSubmit,
      load,
      resetForm
      } = this.props;
    return (<div>
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
              <input type="text" className="form-control" placeholder="Occupation" {...occupation}/>
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit}>Submit</button>
            <button className="btn btn-default btn-lg" style={{margin: 10}} onClick={resetForm}>Reset To Initialized Values</button>
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
