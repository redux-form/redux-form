import React, { Component } from 'react'
import WizardForm from '../../examples/WizardForm'
import { fields } from '../../examples/WizardFormThirdPage'
import Example from '../../components/Example'
import explanation from './Wizard.md'
import raw from '!!raw!../../examples/WizardForm'
import rawFirstPage from '!!raw!../../examples/WizardFormFirstPage'
import rawSecondPage from '!!raw!../../examples/WizardFormSecondPage'
import rawThirdPage from '!!raw!../../examples/WizardFormThirdPage'

class Wizard extends Component {
  render() {
    return (
      <Example
        name="Wizard Form"
        explanation={explanation}
        component={WizardForm}
        form="wizard"
        fields={fields}
        files={{
          'WizardForm.js': raw,
          'WizardFormFirstPage.js': rawFirstPage,
          'WizardFormSecondPage.js': rawSecondPage,
          'WizardFormThirdPage.js': rawThirdPage
        }}/>
    )
  }
}

export default Wizard
