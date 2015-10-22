import React from 'react';
import SynchronousValidationForm, {fields} from '../../examples/SynchronousValidationForm';
import Example from '../../components/Example';
import explanation from './SynchronousValidation.md';
import raw from '!!raw!../../examples/SynchronousValidationForm';

const SynchronousValidation = () =>
  <Example
    name="Synchronous Validation"
    explanation={explanation}
    formComponent={SynchronousValidationForm}
    form="synchronousValidation"
    fields={fields}
    raw={raw}/>;

export default SynchronousValidation;
