import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import { App, Code, Markdown, Values, generateExampleBreadcrumbs } from 'redux-form-website-template'
import account from './account'

const dest = document.getElementById('content')

const reducer = combineReducers({
  account,
  form: reduxFormReducer // mounted under "form"
})
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
  const InitializeFromStateForm = require('./InitializeFromStateForm').default
  const readme = require('./InitializeFromState.md')
  const raw = require('!!raw!./InitializeFromStateForm')
  const rawAccount = require('!!raw!./account')
  ReactDOM.render(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="6.4.2"
        path="/examples/initializeFromState"
        breadcrumbs={generateExampleBreadcrumbs('initializeFromState', 'Initialize From State Example', '6.4.2')}>

        <Markdown content={readme}/>

        <h2>Form</h2>

        <InitializeFromStateForm onSubmit={showResults}/>

        <Values form="initializeFromState"/>

        <h2>Code</h2>

        <h4>account.js</h4>

        <Code source={rawAccount}/>

        <h4>InitializeFromStateForm.js</h4>

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
  module.hot.accept('./InitializeFromStateForm', rerender)
  module.hot.accept('./InitializeFromState.md', rerender)
  module.hot.accept('!!raw!./InitializeFromStateForm', rerender)
}

render()
