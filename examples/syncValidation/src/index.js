import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'
import {reducer as reduxFormReducer} from 'redux-form'
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
  const SyncValidationForm = require('./SyncValidationForm').default
  const readme = require('./SyncValidation.md')
  const raw = require('!!raw-loader!./SyncValidationForm')
  ReactDOM.render(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="6.7.0"
        path="/examples/syncValidation"
        breadcrumbs={generateExampleBreadcrumbs(
          'syncValidation',
          'Synchronous Validation Example',
          '6.7.0'
        )}
      >

        <Markdown content={readme} />

        <div style={{textAlign: 'center'}}>
          <a
            href="https://codesandbox.io/s/pQj03w7Y6"
            target="_blank"
            style={{fontSize: '1.5em'}}
          >
            <i className="fa fa-codepen" /> Open in Sandbox
          </a>
        </div>

        <h2>Form</h2>

        <SyncValidationForm onSubmit={showResults} />

        <Values form="syncValidation" />

        <h2>Code</h2>

        <h3>SyncValidationForm.js</h3>

        <Code source={raw} />

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
    ReactDOM.render(<RedBox error={error} className="redbox" />, dest)
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
  module.hot.accept('./SyncValidationForm', rerender)
  module.hot.accept('./SyncValidation.md', rerender)
  module.hot.accept('!!raw-loader!./SyncValidationForm', rerender)
}

render()
