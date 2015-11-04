import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
export const labels = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  age: 'Age',
  street: 'Street',
  city: 'City'
};

class DynamicForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  render() {
    const { fields, handleSubmit } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        {Object.keys(fields).map(name => {
          const field = fields[name];
          return (<div className="form-group" key={name}>
            <label className="col-xs-4 control-label">{labels[name]}</label>
            <div className="col-xs-8">
              <input type="text" className="form-control" placeholder={labels[name]} {...field}/>
            </div>
          </div>);
        })}
        <div className="text-center">
          <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    );
  }
}

export default reduxForm({form: 'dynamic'})(DynamicForm);
