import React from 'react';
import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import {toggleVisibilityKey, changePositionKey} from './devToolsConfig';

export default createDevTools(
  <DockMonitor
    {...{toggleVisibilityKey, changePositionKey}}
    defaultIsVisible={false}
    defaultPosition="right">
    <LogMonitor/>
  </DockMonitor>
);

