import React from 'react';
import AsynchronousBlurValidationForm, {fields} from '../../examples/AsynchronousBlurValidationForm';
import Example from '../../components/Example';
import explanation from './AsynchronousBlurValidation.md';
import raw from '!!raw!../../examples/AsynchronousBlurValidationForm';

const AsynchronousBlurValidation = () =>
  <Example
    name="Asynchronous Blur Validation"
    explanation={explanation}
    component={AsynchronousBlurValidationForm}
    form="asynchronousBlurValidation"
    fields={fields}
    files={{'AsynchronousBlurValidationForm.js': raw}}/>;

export default AsynchronousBlurValidation;
