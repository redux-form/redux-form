import React, { Component } from 'react'
import DynamicFormContainer from '../../examples/DynamicFormContainer'
import Example from '../../components/Example'
import explanation from './Dynamic.md'
import raw from '!!raw!../../examples/DynamicForm'
import rawContainer from '!!raw!../../examples/DynamicFormContainer'

class Dynamic extends Component {
  render() {
    return (
      <Example
        name="Dynamic Form"
        explanation={explanation}
        component={DynamicFormContainer}
        form="dynamic"
        fields={[ 'firstName', 'lastName', 'email', 'age', 'street', 'city' ]}
        files={{
          'DynamicFormContainer.js': rawContainer,
          'DynamicForm.js': raw
        }}/>
    )
  }
}

export default Dynamic
