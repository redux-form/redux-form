import React from 'react'
import marked from 'marked'
import Prism from '../vendor/prism'

const prettify = markdown =>
  markdown.replace(/```(?:javascript|js)([\s\S]+?)```/g,
    (match, code) =>
      `<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(code, Prism.languages.jsx)}</code></pre>`)

const Markdown = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: marked(prettify(content)) }}/>
}

export default Markdown
