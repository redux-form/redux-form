import {createStore, combineReducers, compose } from 'redux';
import {reducer as form} from 'redux-form';
import account from './modules/account';
import submission from './modules/submission';
import normalizePhone from './normalizers/normalizePhone';
import normalizeMax from './normalizers/normalizeMax';
import normalizeMin from './normalizers/normalizeMin';
import devToolsEnabled from '../devToolsEnabled';

const normalizePhoneArray = (array, previousArray) => {
  return array && array.map((item, index) =>
    item && {
      ...item,
      value: normalizePhone(item.value, previousArray && previousArray[index] && previousArray[index].value)
    });
};

const getCreateStore = () => {
  if (devToolsEnabled) {
    const {persistState} = require('redux-devtools');
    const DevTools = require('../components/DevTools');
    return compose(
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  }
  return createStore;
};

const reducer = combineReducers({
  alternate: form,  // for alternate mount point example
  form: form.normalize({
    deep: {
      'billing.phones[]': normalizePhoneArray,
      'shipping.phones[]': normalizePhoneArray
    },
    normalizing: {
      upper: value => value && value.toUpperCase(),
      phone: normalizePhone,
      min: normalizeMin,
      max: normalizeMax
    }
  }),
  account,
  submission
});
const store = getCreateStore()(reducer);

export default store;
