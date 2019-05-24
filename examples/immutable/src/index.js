import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {
  App,
  Code,
  Markdown,
  generateExampleBreadcrumbs
} from 'redux-form-website-template'
import Values from './ImmutableValues'
import reducer from './reducer'

const dest = document.getElementById('content')

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
  const ImmutableForm = require('./ImmutableForm').default
  const readme = require('./Immutable.md')
  const raw = require('!!raw-loader!./ImmutableForm')
  const rawValidate = require('!!raw-loader!./validate')
  const rawWarn = require('!!raw-loader!./warn')
  const rawReducer = require('!!raw-loader!./reducer')
  ReactDOM.hydrate(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="8.2.1"
        path="/examples/immutable"
        breadcrumbs={generateExampleBreadcrumbs(
          'immutable',
          'Immutable JS Example',
          '8.2.1'
        )}
      >
        <Markdown content={readme} />

        <div style={{ textAlign: 'center' }}>
          <a
            href="https://codesandbox.io/s/ZVGJQBJMw"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '1.5em' }}
          >
            <i className="fa fa-codepen" /> Open in Sandbox
          </a>
        </div>

        <h2>Form</h2>

        <ImmutableForm onSubmit={showResults} />

        <Values form="immutableExample" />

        <h2>Code</h2>

        <h3>reducer.js</h3>

        <Code source={rawReducer} />

        <h3>validate.js</h3>

        <Code source={rawValidate} />

        <h3>warn.js</h3>

        <Code source={rawWarn} />

        <h3>ImmutableForm.js</h3>

        <Code source={raw} />
      </App>
    </Provider>,
    dest
  )
}

render()
