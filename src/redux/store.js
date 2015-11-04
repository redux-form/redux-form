import {createStore, combineReducers, compose } from 'redux';
import {reducer as form} from 'redux-form';
import submission from './modules/submission';
import normalizePhone from './normalizers/normalizePhone';
import normalizeMax from './normalizers/normalizeMax';
import normalizeMin from './normalizers/normalizeMin';

const getCreateStore = () => {
  const {persistState} = require('redux-devtools');
  const DevTools = require('../components/DevTools');
  return compose(
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
};

const reducer = combineReducers({
  alternate: form,  // for alternate mount point example
  form: form.normalize({
    normalizing: {
      upper: value => value && value.toUpperCase(),
      phone: normalizePhone,
      min: normalizeMin,
      max: normalizeMax
    }
  }),
  submission
});
const store = getCreateStore()(reducer);

export default store;
