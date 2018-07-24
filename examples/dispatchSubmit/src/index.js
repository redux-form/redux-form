import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import createSagaMiddleware from 'redux-saga'
import { createEpicMiddleware } from 'redux-observable'
import {
  App,
  Code,
  Markdown,
  Values,
  generateExampleBreadcrumbs
} from 'redux-form-website-template'

import { helloSaga } from './saga'
import { formEpic } from './epic'
const dest = document.getElementById('content')

const sagaMiddleware = createSagaMiddleware()
const epicMiddleware = createEpicMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
})

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, epicMiddleware))
)

sagaMiddleware.run(helloSaga)
epicMiddleware.run(formEpic)

let render = () => {
  const DispatchSubmit = require('./DispatchSubmit').default
  const readme = require('./DispatchSubmit.md')
  const raw = require('!!raw-loader!./DispatchSubmit')
  const rawSubmit = require('!!raw-loader!./submit')
  const rawEpic = require('!!raw-loader!./epic')
  const rawSaga = require('!!raw-loader!./saga')

  ReactDOM.hydrate(
    <Provider store={store}>
      <App
        /**
         * This <App/> component only provides the site wrapper.
         * Remove it on your dev server if you wish. It will not affect the functionality.
         */
        version="7.4.2"
        path="/examples/dispatchSubmit"
        breadcrumbs={generateExampleBreadcrumbs(
          'dispatchSubmit',
          'Dispatch Submit Example',
          '7.4.2'
        )}
      >
        <Markdown content={readme} />

        {/* <div style={{ textAlign: 'center' }}>
          <a
            href="https://codesandbox.io/s/ElYvJR21K"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '1.5em' }}
          >
            <i className="fa fa-codepen" /> Open in Sandbox
          </a>
        </div> */}

        <h2>Form</h2>

        <DispatchSubmit />

        <Values form="dispatchSubmit" />

        <h2>Code</h2>

        <h4>submit.js</h4>

        <Code source={rawSubmit} />

        <h4>saga.js</h4>

        <Code source={rawSaga} />

        <h4>epic.js</h4>

        <Code source={rawEpic} />

        <h4>DispatchSubmit.js</h4>

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
  module.hot.accept('./DispatchSubmit', rerender)
  module.hot.accept('./DispatchSubmit.md', rerender)
  module.hot.accept('./saga', rerender)
  module.hot.accept('./epic', rerender)
  module.hot.accept('./submit', rerender)
  module.hot.accept('!!raw-loader!./DispatchSubmit', rerender)
  module.hot.accept('!!raw-loader!./submit', rerender)
  module.hot.accept('!!raw-loader!./saga', rerender)
  module.hot.accept('!!raw-loader!./epic', rerender)
}

render()
