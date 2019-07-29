// Note: feel free to put this helper on npm or something.
// It would probably make a nice Jest matcher?
// e.g. expect(<Child />).toThrowRendering('...')
// Feel free to tweak it to your needs!
// https://gist.github.com/gaearon/adf9d5500e11a4e7b2c6f7ebf994fe56

import React from 'react'
import TestUtils from 'react-dom/test-utils'

export function expectRenderError(element, expectedError) {
  // Noop error boundary for testing.
  class TestBoundary extends React.Component {
    constructor(props) {
      super(props)
      this.state = { didError: false }
    }
    componentDidCatch(err) {
      this.setState({ didError: true })
    }
    render() {
      return this.state.didError ? null : this.props.children
    }
  }

  // Record all errors.
  let topLevelErrors = []
  function handleTopLevelError(event) {
    topLevelErrors.push(event.error)
    // Prevent logging
    event.preventDefault()
  }

  window.addEventListener('error', handleTopLevelError)
  try {
    TestUtils.renderIntoDocument(
      <React.StrictMode>
        <TestBoundary>{element}</TestBoundary>
      </React.StrictMode>
    )
  } finally {
    window.removeEventListener('error', handleTopLevelError)
  }

  expect(topLevelErrors.length).toBe(1)
  expect(topLevelErrors[0].message).toMatch(expectedError)
}
