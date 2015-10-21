import 'babel/polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Router, Route} from 'react-router';
import {Provider} from 'react-redux';
import store from 'redux/store';
import DevTools from './components/DevTools';

import App from 'pages/App';
import Home from 'pages/Home';
import Simple from 'pages/Simple';
import SynchronousValidation from 'pages/SynchronousValidation';
import SubmitValidation from 'pages/SubmitValidation';

const component = (
  <Router>
    <Route component={App}>
      <Route path="/" component={Home}/>
      <Route path="/simple" component={Simple}/>
      <Route path="/submit-validation" component={SubmitValidation}/>
      <Route path="/synchronous-validation" component={SynchronousValidation}/>
      <Route path="*" component={Home}/>
    </Route>
  </Router>
);
const dest = document.getElementById('content');

render(
  (<Provider store={store}>
    <div>
      {component}
      <DevTools/>
    </div>
  </Provider>),
  dest
);
