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
  const ReactWidgetsForm = require('./ReactWidgetsForm').default
  const readme = require('./ReactWidgets.md')
  const raw = require('!!raw-loader!./ReactWidgetsForm')
  ReactDOM.hydrate(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="8.0.1"
        path="/examples/react-widgets/"
        breadcrumbs={generateExampleBreadcrumbs(
          'react-widgets',
          'React Widgets Form Example',
          '8.0.1'
        )}
      >
        <Markdown content={readme} />

        <h2>Form</h2>

        <ReactWidgetsForm onSubmit={showResults} />

        <Values form="reactWidgets" />

        <h2>Code</h2>

        <h4>ReactWidgetsForm.js</h4>

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
  module.hot.accept('./ReactWidgetsForm', rerender)
  module.hot.accept('./ReactWidgets.md', rerender)
  module.hot.accept('!!raw-loader!./ReactWidgetsForm', rerender)
}

render()
