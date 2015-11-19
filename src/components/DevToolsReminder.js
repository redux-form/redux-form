import React, {Component} from 'react';
import {toggleVisibilityKey, changePositionKey} from './devToolsConfig';
import styles from './DevToolsReminder.scss';

class DevToolsReminder extends Component {
  render() {
    if (window.devToolsExtension) {
      return (
        <a className={styles.reminder} href="#" onClick={event => {
          event.preventDefault();
          window.devToolsExtension.open();
        }}>
          <i className="fa fa-info-circle"/> Click here to open Redux DevTools
        </a>
      );
    }
    return (
      <div className={styles.reminder}>
        <i className="fa fa-info-circle"/> Toggle
        redux-devtools with <code>Ctrl-{toggleVisibilityKey}</code>.
        Move with <code>Ctrl-{changePositionKey}</code>.
      </div>
    );
  }
}

export default DevToolsReminder;
