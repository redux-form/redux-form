import React from 'react';
import SubmitValidationForm, {fields} from '../../examples/SubmitValidationForm';
import Example from '../../components/Example';
import explanation from './SubmitValidation.md';
import raw from '!!raw!../../examples/SubmitValidationForm';

const SubmitValidation = () =>
  <Example
    name="Submit Validation"
    explanation={explanation}
    form="submitValidation"
    fields={fields}
    files={{'SubmitValidationForm.js': raw}}>
    <SubmitValidationForm/>
  </Example>;

export default SubmitValidation;
