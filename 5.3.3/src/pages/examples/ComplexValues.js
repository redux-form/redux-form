import React, { Component } from 'react'
import ComplexValuesForm, { fields } from '../../examples/ComplexValuesForm'
import Example from '../../components/Example'
import explanation from './ComplexValues.md'
import raw from '!!raw!../../examples/ComplexValuesForm'
import rawObjectSelect from '!!raw!../../examples/ObjectSelect'

class ComplexValues extends Component {
  render() {
    return (
      <Example
        name="Complex Values"
        explanation={explanation}
        component={ComplexValuesForm}
        form="complexValues"
        fields={fields}
        files={{
          'ComplexValuesForm.js': raw,
          'ObjectSelect.js': rawObjectSelect
        }}/>
    )
  }
}

export default ComplexValues
