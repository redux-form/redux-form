import React, {Component} from 'react';
import FunctionalFieldsForm from '../../examples/FunctionalFieldsForm';
import Example from '../../components/Example';
import explanation from './FunctionalFields.md';
import raw from '!!raw!../../examples/FunctionalFieldsForm';

class FunctionalFields extends Component {
  render() {
    return (
      <Example
        name="Fields as a Function"
        explanation={explanation}
        component={FunctionalFieldsForm}
        form="fieldsFunction"
        fields={['firstName', 'lastName', 'employed', 'employerName']}
        files={{'FunctionalFields.js': raw}}/>
    );
  }
}

export default FunctionalFields;
