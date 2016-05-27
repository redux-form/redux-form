import React, { Component } from 'react'
import AsynchronousBlurValidationForm, { fields } from '../../examples/AsynchronousBlurValidationForm'
import Example from '../../components/Example'
import explanation from './AsynchronousBlurValidation.md'
import raw from '!!raw!../../examples/AsynchronousBlurValidationForm'

class AsynchronousBlurValidation extends Component {
  render() {
    return (
      <Example
        name="Asynchronous Blur Validation"
        explanation={explanation}
        component={AsynchronousBlurValidationForm}
        form="asynchronousBlurValidation"
        fields={fields}
        files={{ 'AsynchronousBlurValidationForm.js': raw }}/>
    )
  }
}

export default AsynchronousBlurValidation
