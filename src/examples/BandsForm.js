import React, {Component, PropTypes} from 'react';
import generateBandName from '../util/generateBandName';
import BandForm from './BandForm';

const generateBands = num => {
  const result = [];
  for (let index = 0; index < num; index++) {
    result.push({
      name: generateBandName(),
      color: Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase()
    });
  }
  return result;
};

class BandsForm extends Component {
  static propTypes = {
    num: PropTypes.number.isRequired
  }

  state = {
    bands: [],
    editing: []
  }

  componentWillMount() {
    this.updateData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateData(nextProps);
  }

  onSubmit(index) {
    return data => {
      const bands = this.state.bands.slice();
      const editing = this.state.editing.slice();
      bands[index] = data;
      editing[index] = false;
      this.setState({bands, editing});
    };
  }

  onEdit(index) {
    return () => this.setEditing(index, true);
  }

  onCancel(index) {
    return () => this.setEditing(index, false);
  }

  setEditing(index, value) {
    const editing = this.state.editing.slice();
    editing[index] = value;
    this.setState({editing});
  }

  updateData({num}) {
    const {bands, editing} = this.state;
    if (bands.length < num) {
      this.setState({bands: bands.concat(generateBands(num - bands.length))});
    } else if (bands.length > num) {
      this.setState({
        bands: bands.slice(0, num),
        editing: editing.slice(0, num)
      });
    }
  }

  render() {
    const {bands, editing} = this.state;
    return (
      <div>
        <div className="row">
          <div className="col-xs-5" style={{fontWeight: 'bold'}}>Band Name</div>
          <div className="col-xs-5" style={{fontWeight: 'bold'}}>Favorite Color</div>
        </div>
        {bands.map((band, index) =>
          <div className="row" key={index} style={{margin: 10}}>
            {editing[index] && <BandForm
              formKey={index}
              initialValues={band}
              onSubmit={this.onSubmit(index)}
              onCancel={this.onCancel(index)}/>}
            {!editing[index] && <div>
              <div className="col-xs-5">{band.name}</div>
              <div className="col-xs-5" style={{
                border: '1px solid #666',
                height: 34,
                backgroundColor: '#' + band.color
              }}></div>
              <div className="col-xs-2">
                <button className="btn btn-primary" onClick={this.onEdit(index)}>
                  <i className="fa fa-pencil"/> {/* pencil icon */} Edit
                </button>
              </div>
            </div>}
          </div>
        )}
      </div>
    );
  }
}

export default BandsForm;
