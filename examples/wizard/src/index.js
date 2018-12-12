import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import {
  App,
  Code,
  Markdown,
  Values,
  generateExampleBreadcrumbs
} from 'redux-form-website-template'

const dest = document.getElementById('content')
const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
})
const store = (window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore)(reducer)

const showResults = values =>
  new Promise(resolve => {
    setTimeout(() => {
      // simulate server latency
      window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
      resolve()
    }, 500)
  })

let render = () => {
  const WizardForm = require('./WizardForm').default
  const readme = require('./Wizard.md')
  const rawWizard = require('!!raw-loader!./WizardForm')
  const rawValidate = require('!!raw-loader!./validate')
  const rawRenderField = require('!!raw-loader!./renderField')
  const WizardFormFirstPage = require('!!raw-loader!./WizardFormFirstPage')
  const WizardFormSecondPage = require('!!raw-loader!./WizardFormSecondPage')
  const WizardFormThirdPage = require('!!raw-loader!./WizardFormThirdPage')
  ReactDOM.hydrate(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="8.0.4"
        path="/examples/wizard"
        breadcrumbs={generateExampleBreadcrumbs(
          'wizard',
          'Wizard Form Example',
          '8.0.4'
        )}
      >
        <Markdown content={readme} />

        <div style={{ textAlign: 'center' }}>
          <a
            href="https://codesandbox.io/s/0Qzz3843"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '1.5em' }}
          >
            <i className="fa fa-codepen" /> Open in Sandbox
          </a>
        </div>

        <h2>Form</h2>

        <WizardForm onSubmit={showResults} />

        <Values form="wizard" />

        <h2>Code</h2>

        <h4>renderField.js</h4>

        <Code source={rawRenderField} />

        <h4>WizardForm.js</h4>

        <Code source={rawWizard} />

        <h4>validate.js</h4>

        <Code source={rawValidate} />

        <h4>WizardFormFirstPage.js</h4>

        <Code source={WizardFormFirstPage} />

        <h4>WizardFormSecondPage.js</h4>

        <Code source={WizardFormSecondPage} />

        <h4>WizardFormThirdPage.js</h4>

        <Code source={WizardFormThirdPage} />
      </App>
    </Provider>,
    dest
  )
}

render()
