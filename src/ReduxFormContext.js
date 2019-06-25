import * as React from 'react'

export const ReduxFormContext = React.createContext(null)

export const renderChildren = (
  Component,
  { forwardedRef, ...rest }
) => _reduxForm =>
  React.createElement(Component, {
    ...rest,
    _reduxForm,
    ref: forwardedRef
  })

export const withReduxForm = Component => {
  class Hoc extends React.Component {
    render() {
      return React.createElement(ReduxFormContext.Consumer, {
        children: renderChildren(Component, this.props)
      })
    }
  }

  const ref = React.forwardRef((props, ref) =>
    React.createElement(Hoc, { ...props, forwardedRef: ref })
  )
  ref.displayName = Component.displayName || Component.name || 'Component'
  return ref
}
