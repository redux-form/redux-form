import React, {Component} from 'react';
import NormalizingForm, {fields} from '../../examples/NormalizingForm';
import Example from '../../components/Example';
import explanation from './Normalizing.md';
import raw from '!!raw!../../examples/NormalizingForm';

class Normalizing extends Component {
  render() {
    return (
      <Example
        name="Normalizing Form Data"
        explanation={explanation}
        component={NormalizingForm}
        form="normalizing"
        fields={fields}
        files={{'NormalizingForm.js': raw}}/>
    );
  }
}

export default Normalizing;
