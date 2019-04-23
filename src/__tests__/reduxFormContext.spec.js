import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'

import { renderChildren } from '../ReduxFormContext'

describe('renderChildren func', () => {
  const Component = props => <div {...props} />
  const forwardedRef = React.createRef()
  const externalReduxForm = 'external prop'
  const reduxForm = 'inner prop'

  it('should pass "_reduxForm" argument to created component', () => {
    const renderer = new ShallowRenderer()
    const children = renderChildren(Component, {
      forwardedRef,
      _reduxForm: externalReduxForm
    })
    renderer.render(children(reduxForm))
    const result = renderer.getRenderOutput()

    expect(result.type).toBe('div')
    expect(result.props._reduxForm).toBe(reduxForm)
  })
})
