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
  const FieldLevelValidationForm = require('./FieldLevelValidationForm').default
  const readme = require('./FieldLevelValidation.md')
  const raw = require('!!raw-loader!./FieldLevelValidationForm')
  ReactDOM.hydrate(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="8.0.3"
        path="/examples/fieldLevelValidation"
        breadcrumbs={generateExampleBreadcrumbs(
          'fieldLevelValidation',
          'Field-Level Validation Example',
          '8.0.3'
        )}
      >
        <Markdown content={readme} />

        <div style={{ textAlign: 'center' }}>
          <a
            href="https://codesandbox.io/s/PNQYw1kVy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '1.5em' }}
          >
            <i className="fa fa-codepen" /> Open in Sandbox
          </a>
        </div>

        <h2>Form</h2>

        <FieldLevelValidationForm onSubmit={showResults} />

        <Values form="fieldLevelValidation" />

        <h2>Code</h2>

        <h3>FieldLevelValidationForm.js</h3>

        <Code source={raw} />
      </App>
    </Provider>,
    dest
  )
}

render()
