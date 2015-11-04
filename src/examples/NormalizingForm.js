import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['upper', 'phone', 'min', 'max'];
const renderOptions = () =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 10]
    .map(option => <option key={option} value={option}>{option}</option>);

class NormalizingForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  };

  render() {
    const {
      fields: {upper, phone, min, max},
      handleSubmit,
      resetForm
      } = this.props;
    return (<form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-xs-4 control-label">Uppercase</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="UPPERCASE" {...upper}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Phone</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="999-999-9999" {...phone}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Minimum Widgets</label>
          <div className="col-xs-8">
            <select className="form-control" style={{width: 60}} {...min}>
              <option/> // empty option for when value is undefined
              {renderOptions()}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Maximum Widgets</label>
          <div className="col-xs-8">
            <select className="form-control" style={{width: 60}} {...max}>
              <option/> // empty option for when value is undefined
              {renderOptions()}
            </select>
          </div>
        </div>
        <div className="text-center">
          <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit}>Submit</button>
          <button className="btn btn-default btn-lg" style={{margin: 10}} onClick={resetForm}>Clear Values</button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'normalizing',
  fields
})(NormalizingForm);
