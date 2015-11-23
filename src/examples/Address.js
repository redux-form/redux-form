import React, {Component, PropTypes} from 'react';

class Address extends Component {
  static propTypes = {
    street: PropTypes.object.isRequired,
    city: PropTypes.object.isRequired
  };

  render() {
    const {street, city} = this.props;
    return (<div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Street</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="Street" {...street}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">City</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="City" {...city}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Address;
