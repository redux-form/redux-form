import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {load as loadAccount} from '../redux/modules/account';
export const fields = ['firstName', 'lastName', 'age', 'color', 'bio'];
const data = {  // used to populate "account" reducer when "Load" is clicked
  firstName: 'John',
  lastName: 'Doe',
  age: '42',
  color: 'Blue',
  bio: 'Born to write amazing Redux code.'
};
const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];

class InitializingFromStateForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {fields: {firstName, lastName, age, color, bio}, handleSubmit, load, submitting} = this.props;
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
            <label className="col-xs-4 control-label">Favorite Color</label>
            <div className="col-xs-8">
              <select className="form-control" {...color}>
                <option value="">Select a color...</option>
                {colors.map(colorOption => <option value={colorOption} key={colorOption}>{colorOption}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-4 control-label">Occupation</label>
            <div className="col-xs-8">
              <textarea className="form-control" placeholder="Biography" {...bio}/>
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-primary btn-lg" style={{margin: 10}} disabled={submitting} onClick={handleSubmit}>
              {submitting ? <i className="fa fa-cog fa-spin"/> : <i className="fa fa-paper-plane"/>} Submit
            </button>
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
