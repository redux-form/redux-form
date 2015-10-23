import React, {Component} from 'react';
import BandsForm from '../../examples/BandsForm';
import Example from '../../components/Example';
import explanation from './Multirecord.md';
import rawBandsForm from '!!raw!../../examples/BandsForm';
import rawBandForm from '!!raw!../../examples/BandForm';

class Multirecord extends Component {
  state = {
    num: 5
  }

  handleChange(event) {
    this.setState({num: event.target.value});
  }

  render() {
    const {num} = this.state;
    return (
      <Example
        name="Multirecord Form"
        explanation={explanation}
        form="band"
        files={{
          'BandsForm.js': rawBandsForm,
          'BandForm.js': rawBandForm
        }}>
        <div style={{marginBottom: 10}} className="form-inline">
          <div className="form-group">
            <label htmlFor="numRecords" className="col-xs-3 col-xs-offset-3">Number of records</label>
            <select className="form-control col-xs-3" id="numRecords" onChange={::this.handleChange}>
              <option value={5}>5</option>
              <option value={20}>20</option>
              <option value={100}>100</option>
              <option value={1000}>1000</option>
            </select>
          </div>
        </div>
        <BandsForm num={num}/>
      </Example>
    );
  }
}

export default Multirecord;
