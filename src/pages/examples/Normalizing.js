import React, {Component} from 'react';
import NormalizingForm, {fields} from '../../examples/NormalizingForm';
import Example from '../../components/Example';
import explanation from './Normalizing.md';
import raw from '!!raw!../../examples/NormalizingForm';
import rawNormalizePhone from '!!raw!../../redux/normalizers/normalizePhone';
import rawNormalizeMax from '!!raw!../../redux/normalizers/normalizeMax';
import rawNormalizeMin from '!!raw!../../redux/normalizers/normalizeMin';

class Normalizing extends Component {
  render() {
    return (
      <Example
        name="Normalizing Form Data"
        explanation={explanation}
        component={NormalizingForm}
        form="normalizing"
        fields={fields}
        files={{
          'normalizePhone.js': rawNormalizePhone,
          'normalizeMax.js': rawNormalizeMax,
          'normalizeMin.js': rawNormalizeMin,
          'NormalizingForm.js': raw
        }}/>
    );
  }
}

export default Normalizing;
