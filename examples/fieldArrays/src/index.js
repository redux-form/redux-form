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
  const FieldArraysForm = require('./FieldArraysForm').default
  const readme = require('./FieldArrays.md')
  const raw = require('!!raw-loader!./FieldArraysForm')
  const rawValidate = require('!!raw-loader!./validate')
  ReactDOM.hydrate(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="8.0.1"
        path="/examples/fieldArrays"
        breadcrumbs={generateExampleBreadcrumbs(
          'syncValidation',
          'Field Arrays Example',
          '8.0.1'
        )}
      >
        <Markdown content={readme} />

        <div style={{ textAlign: 'center' }}>
          <a
            href="https://codesandbox.io/s/Ww4QG1Wx"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '1.5em' }}
          >
            <i className="fa fa-codepen" /> Open in Sandbox
          </a>
        </div>

        <h2>Form</h2>

        <FieldArraysForm onSubmit={showResults} />

        <Values form="fieldArrays" />

        <h2>Code</h2>

        <h3>FieldArraysForm.js</h3>

        <Code source={raw} />

        <h3>validate.js</h3>

        <Code source={rawValidate} />
      </App>
    </Provider>,
    dest
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render
  const renderError = error => {
    const RedBox = require('redbox-react')
    ReactDOM.hydrate(<RedBox error={error} className="redbox" />, dest)
  }
  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }
  const rerender = () => {
    setTimeout(render)
  }
  module.hot.accept('./validate', rerender)
  module.hot.accept('./FieldArraysForm', rerender)
  module.hot.accept('./FieldArrays.md', rerender)
  module.hot.accept('!!raw-loader!./FieldArraysForm', rerender)
}

render()
