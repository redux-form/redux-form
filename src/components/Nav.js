import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import marked from 'marked'
import styles from './Nav.scss'

const formatLabel = label => /<p>(.+)<\/p>/.exec(marked(label))[ 1 ]

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

class Nav extends Component {
  constructor(props) {
    super(props)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.state = {
      open: false
    }
  }

  renderItem(href, label, indent = 0) {
    const { path, url } = this.props
    return (
      <a href={`${url || ''}${href}`}
        className={cx(styles[`indent${indent}`], {[styles.active]: href === path})}
        dangerouslySetInnerHTML={{ __html: formatLabel(label) }}/>
    )
  }

  open() {
    this.setState({ open: true })
  }

  close() {
    this.setState({ open: false })
  }

  render() {
    const { open } = this.state
    return (
      <div className={cx(styles.nav, { [styles.open]: open })}>
        <button type="button" onClick={this.open}/>
        <div className={styles.overlay} onClick={this.close}>
          <i className="fa fa-times"/> Close
        </div>
        <div className={styles.placeholder}/>
        <nav className={styles.menu}>
          <a href="http://redux-form.com" className={styles.brand}>Redux Form</a>
          {this.renderItem('/docs/GettingStarted.md', 'Getting Started')}
          {this.renderItem('/docs/api', 'API')}
          {this.renderItem('/docs/api/ReduxForm.md', '`reduxForm()`', 1)}
          {this.renderItem('/docs/api/Props.md', '`props`', 1)}
          {this.renderItem('/docs/api/Field.md', '`Field`', 1)}
          {this.renderItem('/docs/api/Reducer.md', '`reducer`', 1)}
          {this.renderItem('/docs/api/ReducerSyncValidation.md', '`reducer.syncValidation()`', 2)}
          {this.renderItem('/docs/api/SubmissionError.md', '`SubmissionError`', 1)}
          {this.renderItem('/docs/api/ActionCreators.md', 'Action Creators', 1)}
          {this.renderItem('/docs/api/MigrationGuide.md', '`v6` Migration Guide', 1)}
          {this.renderItem('/docs/faq', 'FAQ')}
          {this.renderItem('/examples', 'Examples')}
          {this.renderItem('/examples/simple', 'Simple Form', 1)}
          {this.renderItem('/examples/syncValidation', 'Sync Validation', 1)}
          {this.renderItem('/examples/submitValidation', 'Submit Validation', 1)}
          {this.renderItem('/examples/asyncValidation', 'Async Validation', 1)}
          {this.renderItem('/examples/initializeFromState', 'Initializing from State', 1)}
          {this.renderItem('/examples/immutable', 'Immutable JS', 1)}
        </nav>
      </div>
    )
  }
}

Nav.propTypes = {
  path: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}

export default Nav
