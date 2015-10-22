import React from 'react';
import AsynchronousBlurValidationForm, {fields} from '../../examples/AsynchronousBlurValidationForm';
import Example from '../../components/Example';
import explanation from './AsynchronousBlurValidation.md';
import raw from '!!raw!../../examples/AsynchronousBlurValidationForm';

const AsynchronousBlurValidation = () =>
  <Example
    name="Asynchronous Blur Validation"
    explanation={explanation}
    formComponent={AsynchronousBlurValidationForm}
    form="asynchronousBlurValidation"
    fields={fields}
    raw={raw}/>;

export default AsynchronousBlurValidation;
