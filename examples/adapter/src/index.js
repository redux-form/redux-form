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
  const AdapterForm = require('./AdapterForm').default
  const readme = require('./Adapter.md')
  const raw = require('!!raw!./AdapterForm')
  const adapterRaw = require('!!raw!./adapter')
  ReactDOM.render(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="6.0.0-alpha.13"
        path="/examples/adapter/"
        breadcrumbs={generateExampleBreadcrumbs('adapter', 'Adapter Example', '6.0.0-alpha.13')}>

        <Markdown content={readme}/>

        <h2>Form</h2>

        <AdapterForm onSubmit={showResults}/>

        <Values form="adapterExample"/>

        <h2>Code</h2>

        <h4>adapter.js</h4>

        <Code source={adapterRaw}/>

        <h4>AdapterForm.js</h4>

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
  module.hot.accept('./AdapterForm', rerender)
  module.hot.accept('./Adapter.md', rerender)
  module.hot.accept('!!raw!./AdapterForm', rerender)
  module.hot.accept('!!raw!./adapter', rerender)
}

render()
