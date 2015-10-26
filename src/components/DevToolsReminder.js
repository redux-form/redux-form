import React, {Component} from 'react';
import {toggleVisibilityKey, changePositionKey} from './devToolsConfig';
import styles from './DevToolsReminder.scss';

class DevToolsReminder extends Component {
  render() {
    return (
      <div className={styles.reminder}>
        <i className="fa fa-info-circle"/> Toggle
        redux-devtools at any time with <code>Ctrl-{toggleVisibilityKey}</code>.
        Move with <code>Ctrl-{changePositionKey}</code>.
      </div>
    );
  }
}

export default DevToolsReminder;
