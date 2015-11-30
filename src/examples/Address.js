import React, {Component, PropTypes} from 'react';

class Address extends Component {
  static propTypes = {
    street: PropTypes.object.isRequired,
    city: PropTypes.object.isRequired,
    phones: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  render() {
    const {street, city, phones} = this.props;
    return (<div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Street</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="Street" {...street} title={street.error}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">City</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="City" {...city} title={city.error}/>
          </div>
        </div>
        <div style={{textAlign: 'center', margin: 10}}>
          <button className="btn btn-success" onClick={event => {
            event.preventDefault();  // prevent form submission
            phones.addField();       // pushes empty phone field onto the end of the array
          }}><i className="fa fa-phone"/> Add Phone</button>
        </div>
        {phones.map((phone, index) =>
          <div className="form-group">
            <label className="col-xs-4 control-label">Phone #{index + 1}</label>
            <div className="col-xs-8">
              <input type="text" className="form-control" placeholder="Phone" {...phone} title={phone.error}/>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Address;
