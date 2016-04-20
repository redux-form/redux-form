import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import marked from 'marked'
import styles from './Nav.scss'

const formatLabel = label => /<p>(.+)<\/p>/.exec(marked(label))[ 1 ]

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
        className={cx(styles[`indent${indent}`], { [styles.active]: href === path })}
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
    const { url } = this.props
    return (
      <div className={cx(styles.nav, { [styles.open]: open })}>
        <button type="button" onClick={this.open}/>
        <div className={styles.overlay} onClick={this.close}>
          <i className="fa fa-times"/> Close
        </div>
        <div className={styles.placeholder}/>
        <nav className={styles.menu}>
          <a href={url} className={styles.brand}>Redux Form</a>
          {this.renderItem('/docs/GettingStarted.md', 'Getting Started')}
          {this.renderItem('/docs/MigrationGuide.md', '`v6` Migration Guide')}
          {this.renderItem('/docs/api', 'API')}
          {this.renderItem('/docs/api/ReduxForm.md', '`reduxForm()`', 1)}
          {this.renderItem('/docs/api/Props.md', '`props`', 1)}
          {this.renderItem('/docs/api/Field.md', '`Field`', 1)}
          {this.renderItem('/docs/api/Reducer.md', '`reducer`', 1)}
          {this.renderItem('/docs/api/ReducerSyncValidation.md', '`reducer.syncValidation()`', 2)}
          {this.renderItem('/docs/api/SubmissionError.md', '`SubmissionError`', 1)}
          {this.renderItem('/docs/api/ActionCreators.md', 'Action Creators', 1)}
          {this.renderItem('/docs/faq', 'FAQ')}
          {this.renderItem('/examples', 'Examples')}
          {this.renderItem('/examples/simple', 'Simple Form', 1)}
          {this.renderItem('/examples/syncValidation', 'Sync Validation', 1)}
          {this.renderItem('/examples/submitValidation', 'Submit Validation', 1)}
          {this.renderItem('/examples/asyncValidation', 'Async Validation', 1)}
          {this.renderItem('/examples/initializeFromState', 'Initializing from State', 1)}
          {this.renderItem('/examples/immutable', 'Immutable JS', 1)}
          {this.renderItem('/docs/DocumentationVersions.md', 'Older Versions')}
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
