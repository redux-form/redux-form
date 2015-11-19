import React, {Component} from 'react';
import {toggleVisibilityKey, changePositionKey} from './devToolsConfig';
import styles from './DevToolsReminder.scss';

class DevToolsReminder extends Component {
  render() {
    return (
      <div className={styles.reminder}>
        {window.devToolsExtension && <div>
          <i className="fa fa-info-circle"/> Try opening your Redux DevTools extension
        </div>}
        {!window.devToolsExtension && <div>
          <i className="fa fa-info-circle"/> Toggle
          redux-devtools with <code>Ctrl-{toggleVisibilityKey}</code>.
          Move with <code>Ctrl-{changePositionKey}</code>.
        </div>}
      </div>
    );
  }
}

export default DevToolsReminder;
