import 'babel/polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import store from 'redux/store';
import DevTools from './components/DevTools';
import component from './routes';
import Perf from 'react-addons-perf';

const dest = document.getElementById('content');
window.Perf = Perf;

render(
  (<Provider store={store}>
    <div>
      {component}
      {!window.devToolsExtension && <DevTools/>}
    </div>
  </Provider>),
  dest
);
