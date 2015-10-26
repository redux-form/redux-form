import React, {Component} from 'react';
import SynchronousValidationForm, {fields} from '../../examples/SynchronousValidationForm';
import Example from '../../components/Example';
import explanation from './SynchronousValidation.md';
import raw from '!!raw!../../examples/SynchronousValidationForm';

class SynchronousValidation extends Component {
  render() {
    return (
      <Example
        name="Synchronous Validation"
        explanation={explanation}
        component={SynchronousValidationForm}
        form="synchronousValidation"
        fields={fields}
        files={{'SynchronousValidationForm.js': raw}}/>
    );
  }
}

export default SynchronousValidation;
