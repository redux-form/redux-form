import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { App, Code, Markdown, Values, generateExampleBreadcrumbs } from 'redux-form-website-template'
import reducer from './reducer'

const dest = document.getElementById('content')
const store =
  (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(reducer)

const showResults = values =>
  new Promise(resolve => {
    setTimeout(() => {  // simulate server latency
      window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
      resolve()
    }, 500)
  })

let render = () => {
  const SyncValidationForm = require('./SyncValidationForm').default
  const readme = require('./SyncValidation.md')
  const raw = require('!!raw!./SyncValidationForm')
  const rawReducer = require('!!raw!./reducer')
  const rawValidate = require('!!raw!./validate')
  ReactDOM.render(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version={REDUX_FORM_VERSION}
        path="/examples/syncValidation"
        breadcrumbs={generateExampleBreadcrumbs('syncValidation',
          'Synchronous Validation Example', REDUX_FORM_VERSION)}>

        <Markdown content={readme}/>

        <h2>Form</h2>

        <SyncValidationForm onSubmit={showResults}/>

        <Values form="syncValidation"/>

        <h2>Code</h2>

        <h3>reducer.js</h3>

        <Code source={rawReducer}/>

        <h3>validate.js</h3>

        <Code source={rawValidate}/>

        <h3>SyncValidationForm.js</h3>

        <Code source={raw}/>

      </App>
    </Provider>,
    dest
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(
      <RedBox error={error} className="redbox"/>,
      dest
    )
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
  module.hot.accept('!!raw!./SyncValidationForm', rerender)
  module.hot.accept('!!raw!./reducer', rerender)
  module.hot.accept('!!raw!./validate', rerender)
}

render()
