import React from 'react';
import {toggleVisibilityKey, changePositionKey} from './devToolsConfig';
import styles from './DevToolsReminder.scss';

const DevToolsReminder = () =>
  <div className={styles.reminder}>
    <i className="fa fa-info-circle"/> Show
    redux-devtools at any time with <code>Ctrl-{toggleVisibilityKey}</code>.
    Move with <code>Ctrl-{changePositionKey}</code>.
  </div>;

export default DevToolsReminder;
