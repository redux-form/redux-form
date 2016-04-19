import React, { Component } from 'react'
import { toggleVisibilityKey, changePositionKey } from './devToolsConfig'
import styles from './DevToolsReminder.scss'
import devToolsEnabled from '../devToolsEnabled'

class DevToolsReminder extends Component {
  render() {
    if (devToolsEnabled) {
      if (window.devToolsExtension) {
        return (
          <a className={styles.reminder} href="#" onClick={event => {
            event.preventDefault()
            window.devToolsExtension.open()
          }}>
            <i className="fa fa-info-circle"/> Click here to open Redux DevTools
          </a>
        )
      }
      return (
        <div className={styles.reminder}>
          <i className="fa fa-info-circle"/> Toggle
          redux-devtools with <code>{toggleVisibilityKey}</code>.
          Move with <code>{changePositionKey}</code>.
        </div>
      )
    }
    return (
      <div className={styles.reminder}>
        <i className="fa fa-ban"/> DevTools Disabled
      </div>
    )
  }
}

export default DevToolsReminder
