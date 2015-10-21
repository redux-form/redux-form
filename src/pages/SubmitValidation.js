import React from 'react';
import SubmitValidationForm, {fields} from '../examples/SubmitValidationForm';
import Example from '../components/Example';
import explanation from './SubmitValidation.md';
import raw from '!!raw!../examples/SubmitValidationForm';

const SubmitValidation = () =>
  <Example
    name="Submit Validation"
    explanation={explanation}
    formComponent={SubmitValidationForm}
    form="submitValidation"
    fields={fields}
    raw={raw}/>;

export default SubmitValidation;
