import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

if (typeof window !== 'undefined') {
  window.initReact = props =>
    ReactDOM.render(<App {...props}/>, document.getElementById('content'))
}
