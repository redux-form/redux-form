import {createStore, combineReducers, compose } from 'redux';
import {reducer as form} from 'redux-form';

const getCreateStore = () => {
  const {persistState} = require('redux-devtools');
  const DevTools = require('../components/DevTools');
  return compose(
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
};

const reducer = combineReducers({form});
const store = getCreateStore()(reducer);

export default store;
