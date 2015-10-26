import React from 'react';
import SubmitValidationForm, {fields} from '../../examples/SubmitValidationForm';
import Example from '../../components/Example';
import explanation from './SubmitValidation.md';
import raw from '!!raw!../../examples/SubmitValidationForm';

const SubmitValidation = () =>
  <Example
    name="Submit Validation"
    explanation={explanation}
    component={SubmitValidationForm}
    form="submitValidation"
    fields={fields}
    files={{'SubmitValidationForm.js': raw}}/>;

export default SubmitValidation;
