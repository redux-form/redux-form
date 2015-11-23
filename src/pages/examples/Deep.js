import React, {Component} from 'react';
import DeepForm, {fields} from '../../examples/DeepForm';
import Example from '../../components/Example';
import explanation from './Deep.md';
import raw from '!!raw!../../examples/DeepForm';
import rawAddress from '!!raw!../../examples/Address';

class Deep extends Component {
  render() {
    return (
      <Example
        name="Deep Form"
        explanation={explanation}
        component={DeepForm}
        form="deep"
        fields={fields}
        files={{
          'DeepForm.js': raw,
          'Address.js': rawAddress
        }}/>
    );
  }
}

export default Deep;
