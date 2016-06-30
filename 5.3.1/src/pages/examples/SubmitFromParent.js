import React, { Component } from 'react'
import { fields } from '../../examples/SubmitFromParentForm'
import SubmitFromParentContainer from '../../examples/SubmitFromParentContainer'
import Example from '../../components/Example'
import explanation from './SubmitFromParent.md'
import raw from '!!raw!../../examples/SubmitFromParentForm'
import rawContainer from '!!raw!../../examples/SubmitFromParentContainer'

class SubmitFromParent extends Component {
  render() {
    return (
      <Example
        name="Submit From Parent"
        explanation={explanation}
        component={SubmitFromParentContainer}
        form="synchronousValidation"
        fields={fields}
        files={{
          'SubmitFromParentContainer.js': rawContainer,
          'SubmitFromParentForm.js': raw
        }}/>
    )
  }
}

export default SubmitFromParent
