import React from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['name', 'phone', 'email', 'min', 'max'];
const renderOptions = () =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 10]
    .map(option => <option key={option} value={option}>{option}</option>);

const NormalizingForm = props => {
  const {
    fields: {name, phone, email, min, max},
    handleSubmit,
    resetForm
    } = props;
  return (<form className="form-horizontal" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="col-xs-4 control-label">Name</label>
        <div className="col-xs-8">
          <input type="text" className="form-control" placeholder="Name" {...name}/>
        </div>
      </div>
      <div className="form-group">
        <label className="col-xs-4 control-label">Phone</label>
        <div className="col-xs-8">
          <input type="text" className="form-control" placeholder="999-999-9999" {...phone}/>
        </div>
      </div>
      <div className="form-group">
        <label className="col-xs-4 control-label">Email</label>
        <div className="col-xs-8">
          <input type="email" className="form-control" placeholder="Email" {...email}/>
        </div>
      </div>
      <div className="form-group">
        <label className="col-xs-4 control-label">Minimum Emails</label>
        <div className="col-xs-8">
          <select className="form-control" style={{width: 60}} {...min}>{renderOptions()}</select>
        </div>
      </div>
      <div className="form-group">
        <label className="col-xs-4 control-label">Maximum Emails</label>
        <div className="col-xs-8">
          <select className="form-control" style={{width: 60}} {...max}>{renderOptions()}</select>
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit}>Submit</button>
        <button className="btn btn-default btn-lg" style={{margin: 10}} onClick={resetForm}>Clear Values</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'normalizing',
  fields
})(NormalizingForm);
