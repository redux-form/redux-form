import React, { forwardRef } from 'react'

export const withDefaultProps = Component => defaultProps =>
  forwardRef((props, ref) => <Component {...defaultProps} {...props} ref={ref} />)
