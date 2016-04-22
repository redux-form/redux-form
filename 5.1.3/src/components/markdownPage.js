import React, { Component } from 'react'
import Markdown from './Markdown'

const markdownPage = markdown =>
  class MarkdownPage extends Component {
    render() {
      return <div className="container"><Markdown value={markdown}/></div>
    }
  }

export default markdownPage
