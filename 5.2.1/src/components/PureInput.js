import React, { Component, PropTypes } from 'react'

class PureInput extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.field !== nextProps.field
  }

  render() {
    const { field, ...rest } = this.props
    return <input {...field} {...rest}/>
  }
}

PureInput.propTypes = {
  field: PropTypes.object.isRequired
}

export default PureInput
