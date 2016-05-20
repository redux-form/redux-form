import React, { Component, PropTypes } from 'react'
import prettify from '../util/prettify'

class Markdown extends Component {
  componentDidMount() {
    if (typeof window.PR !== 'undefined') {
      window.PR.prettyPrint()
    }
  }

  render() {
    const { value } = this.props
    return <div className="markdown" dangerouslySetInnerHTML={{ __html: prettify(value) }}/>
  }
}

Markdown.propTypes = {
  value: PropTypes.string.isRequired
}

export default Markdown
