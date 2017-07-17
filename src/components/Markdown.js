import React from 'react'
import marked from 'marked'
import Prism from '../vendor/prism'
import styles from './Markdown.scss'

const prettify = markdown =>
  markdown.replace(/```(?:javascript|js)([\s\S]+?)```/g,
    (match, code) =>
      `<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(code, Prism.languages.jsx)}</code></pre>`)

const renderer = new marked.Renderer()
renderer.heading = (text, level) => {
  const id = text.toLowerCase().replace(/[^\w]+/g, '-')
  return `<h${level} class="${styles.heading}" id="${id}">${text} <a href="#${id}" class="${styles.anchor}">#</a></h${level}>`
}

const Markdown = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: marked(prettify(content), { renderer }) }}/>
}

export default Markdown
