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
  const AsyncValidationForm = require('./AsyncValidationForm').default
  const readme = require('./AsyncValidation.md')
  const raw = require('!!raw!./AsyncValidationForm')
  const rawValidate = require('!!raw!./validate')
  const rawAsyncValidate = require('!!raw!./asyncValidate')
  ReactDOM.render(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version={REDUX_FORM_VERSION}
        path="/examples/asyncValidation"

        breadcrumbs={generateExampleBreadcrumbs('asyncValidation', 'Async Validation Example', REDUX_FORM_VERSION)}>

        <Markdown content={readme}/>

        <h2>Form</h2>

        <AsyncValidationForm onSubmit={showResults}/>

        <Values form="asyncValidation"/>

        <h2>Code</h2>

        <h4>validate.js</h4>

        <Code source={rawValidate}/>

        <h4>asyncValidate.js</h4>

        <Code source={rawAsyncValidate}/>

        <h4>AsyncValidationForm.js</h4>

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
  module.hot.accept('./AsyncValidationForm', rerender)
  module.hot.accept('./AsyncValidation.md', rerender)
  module.hot.accept('!!raw!./AsyncValidationForm', rerender)
  module.hot.accept('!!raw!./asyncValidate', rerender)
  module.hot.accept('!!raw!./validate', rerender)
}

render()
