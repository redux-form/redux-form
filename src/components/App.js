import React from 'react'
import styles from './App.scss'

/*
   <navbar>
        <img src={require('./brand.png')} className={styles.brand}/> Redux Form
        <nav>
          <a href="/getting-started">Getting Started</a>
          <a href="/faq">FAQ</a>
          <a href="/api">API</a>
          <a href="/api/reduxForm"><code>reduxForm()</code></a>
          <a href="/api/reducer"><code>reducer</code></a>
          <a
            href="/api/reducer/normalize"><code>reducer.normalize()</code></a>
          <a href="/api/reducer/plugin"><code>reducer.plugin()</code></a>
          <a href="/api/props"><code>props</code></a>
          <a href="/api/action-creators">Action Creators</a>
          <a href="/api/get-values"><code>getValues()</code></a>
          <a href="/examples">All Examples</a>
          <a href="/examples/simple">Simple</a>
          <a href="/examples/synchronous-validation">Synchronous
            Validation</a>
          <a href="/examples/submit-validation">Submit Validation</a>
          <a href="/examples/asynchronous-blur-validation">Asynchronous Blur
            Validation</a>
          <a href="/examples/initializing-from-state">Initializing From
            State</a>
          <a href="/examples/deep">Deep Forms</a>
          <a href="/examples/complex">Complex Values</a>
          <a href="/examples/file">File Inputs</a>
          <a href="/examples/dynamic">Dynamic Forms</a>
          <a href="/examples/multirecord">Multirecord Forms</a>
          <a href="/examples/wizard">Multi-Page "Wizard" Forms</a>
          <a href="/examples/normalizing">Normalizing Form Values</a>
          <a href="/examples/submit-from-parent">Submit From Parent</a>
          <a href="/examples/alternate-mount-point">Alternate Redux Mount
            Point</a>
          <a href="https://github.com/erikras/redux-form"
            className={styles.iconLink}
            target="_blank" title="View on Github"><i className="fa fa-github"/></a>
        </nav>
      </navbar>
      <div className={styles.appContent}>
        {children}
      </div>
      <navbar className={styles.bottom}>
        Have questions? Ask for help
        <a href="https://github.com/erikras/redux-form/issues" target="_blank">on Github</a>
        or in the
        <a href="https://discordapp.com/channels/102860784329052160/105736485537374208"
          target="_blank">#redux-form</a>
        Discord channel.
      </navbar>
 */

const App = ({ children, version }) => {
  return (
    <div className={styles.app}>
      <h1>Hello redux-form {version} world.</h1>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default App
