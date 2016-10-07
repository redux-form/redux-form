import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { App, Code, Markdown, generateExampleBreadcrumbs } from 'redux-form-website-template'
import Values from './ImmutableValues'
import reducer from './reducer'

const dest = document.getElementById('content')

const store =
  (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(reducer)

const showResults = values =>
  new Promise(resolve => {
    setTimeout(() => {  // simulate server latency
      window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
      resolve()
    }, 500) })

let render = () => {
  const ImmutableForm = require('./ImmutableForm').default
  const readme = require('./Immutable.md')
  const raw = require('!!raw!./ImmutableForm')
  const rawValidate = require('!!raw!./validate')
  const rawReducer = require('!!raw!./reducer')
  ReactDOM.render(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="6.1.0"
        path="/examples/immutable"
        breadcrumbs={generateExampleBreadcrumbs('immutable', 'Immutable JS Example', '6.1.0')}>

        <Markdown content={readme}/>

        <h2>Form</h2>

        <ImmutableForm onSubmit={showResults}/>

        <Values form="immutableExample"/>

        <h2>Code</h2>

        <h3>reducer.js</h3>

        <Code source={rawReducer}/>

        <h3>validate.js</h3>

        <Code source={rawValidate}/>

        <h3>ImmutableForm.js</h3>

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
  module.hot.accept('./ImmutableForm', rerender)
  module.hot.accept('./Immutable.md', rerender)
  module.hot.accept('!!raw!./ImmutableForm', rerender)
  module.hot.accept('!!raw!./reducer', rerender)
  module.hot.accept('!!raw!./validate', rerender)
}

render()
