import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
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

const theme = createMuiTheme({
  overrides: {
    MuiFormControl: {
      root: {
        '& p': {
          fontSize: 12,
          border: 0,
          marginTop: 2,
          padding: 0
        }
      }
    },
    MuiSelect: {
      select: {
        paddingBotton: 10
      }
    }
  }
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
  const MaterialUiForm = require('./MaterialUiForm').default
  const readme = require('./MaterialUi.md')
  const raw = require('!!raw-loader!./MaterialUiForm')
  const asyncValidateraw = require('!!raw-loader!./asyncValidate')
  ReactDOM.hydrate(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App
          /**
           * This <App/> component only provides the site wrapper.
           * Remove it on your dev server if you wish. It will not affect the functionality.
           */
          version="8.2.0"
          path="/examples/material-ui/"
          breadcrumbs={generateExampleBreadcrumbs(
            'material-ui',
            'Material Ui Form Example',
            '8.2.0'
          )}
        >
          <Markdown content={readme} />

          <div style={{ textAlign: 'center' }}>
            <a
              href="https://codesandbox.io/s/W6YnZm1po"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '1.5em' }}
            >
              <i className="fa fa-codepen" /> Open in Sandbox
            </a>
          </div>

          <h2>Form </h2>

          <MaterialUiForm onSubmit={showResults} />

          <Values form="MaterialUiForm" />

          <h2>Code</h2>

          <h4>asyncValidate.js</h4>

          <Code source={asyncValidateraw} />

          <h4>MaterialUiForm.js</h4>

          <Code source={raw} />
        </App>
      </MuiThemeProvider>
    </Provider>,
    dest
  )
}

render()
