import {createStore, combineReducers, compose } from 'redux';
import {reducer as form} from 'redux-form';
import submission from './modules/submission';

const getCreateStore = () => {
  const {persistState} = require('redux-devtools');
  const DevTools = require('../components/DevTools');
  return compose(
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
};

const reducer = combineReducers({form, submission});
const store = getCreateStore()(reducer);

export default store;
