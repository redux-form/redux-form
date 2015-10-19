import 'babel/polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Router, Route} from 'react-router';

import App from 'pages/App';
import Home from 'pages/Home';
import Simple from 'pages/Simple';
import NotFound from 'pages/NotFound';

render((
  <Router>
    <Route component={App}>
      <Route path="/" component={Home}/>
      <Route path="/simple" component={Simple}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
), document.getElementById('content'));
