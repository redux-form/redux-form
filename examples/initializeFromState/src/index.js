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
import account from './account'

const dest = document.getElementById('content')

const reducer = combineReducers({
  account,
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
  const InitializeFromStateForm = require('./InitializeFromStateForm').default
  const readme = require('./InitializeFromState.md')
  const raw = require('!!raw-loader!./InitializeFromStateForm')
  const rawAccount = require('!!raw-loader!./account')
  ReactDOM.hydrate(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="8.2.2"
        path="/examples/initializeFromState"
        breadcrumbs={generateExampleBreadcrumbs(
          'initializeFromState',
          'Initialize From State Example',
          '8.2.2'
        )}
      >
        <Markdown content={readme} />

        <div style={{ textAlign: 'center' }}>
          <a
            href="https://codesandbox.io/s/MQnD536Km"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '1.5em' }}
          >
            <i className="fa fa-codepen" /> Open in Sandbox
          </a>
        </div>

        <h2>Form</h2>

        <InitializeFromStateForm onSubmit={showResults} />

        <Values form="initializeFromState" />

        <h2>Code</h2>

        <h4>account.js</h4>

        <Code source={rawAccount} />

        <h4>InitializeFromStateForm.js</h4>

        <Code source={raw} />
      </App>
    </Provider>,
    dest
  )
}

render()
