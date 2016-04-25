import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

console.info('window is', typeof window)
if (typeof window !== 'undefined') {
  console.info('defining initReact')
  window.initReact = props =>
    ReactDOM.render(<App {...props}/>, document.getElementById('content'))
}
