import * as React from 'react'

export const ReduxFormContext = React.createContext(null)

export const withReduxForm = Component => {
  class Hoc extends React.Component {
    render() {
      const { forwardedRef, ...rest } = this.props
      return React.createElement(ReduxFormContext.Consumer, {
        children: _reduxForm =>
          React.createElement(Component, {
            _reduxForm,
            ref: forwardedRef,
            ...rest
          })
      })
    }
  }

  const ref = React.forwardRef((props, ref) =>
    React.createElement(Hoc, { ...props, forwardedRef: ref })
  )
  ref.displayName = Component.displayName || Component.name || 'Component'
  return ref
}
