import React from 'react';
import AsynchronousBlurValidationForm, {fields} from '../../examples/AsynchronousBlurValidationForm';
import Example from '../../components/Example';
import explanation from './AsynchronousBlurValidation.md';
import raw from '!!raw!../../examples/AsynchronousBlurValidationForm';

const AsynchronousBlurValidation = () =>
  <Example
    name="Asynchronous Blur Validation"
    explanation={explanation}
    form="asynchronousBlurValidation"
    fields={fields}
    files={{'AsynchronousBlurValidationForm.js': raw}}>
    <AsynchronousBlurValidationForm/>
  </Example>;

export default AsynchronousBlurValidation;
