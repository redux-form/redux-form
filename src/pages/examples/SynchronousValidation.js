import React from 'react';
import SynchronousValidationForm, {fields} from '../../examples/SynchronousValidationForm';
import Example from '../../components/Example';
import explanation from './SynchronousValidation.md';
import raw from '!!raw!../../examples/SynchronousValidationForm';

const SynchronousValidation = () =>
  <Example
    name="Synchronous Validation"
    explanation={explanation}
    component={SynchronousValidationForm}
    form="synchronousValidation"
    fields={fields}
    files={{'SynchronousValidationForm.js': raw}}/>;

export default SynchronousValidation;
