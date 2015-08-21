import createFormReducer from './createFormReducer';
import reduxForm from './reduxForm';
import bindSliceKey from './bindSliceKey';
import {blur, change, initialize, reset, startAsyncValidation,
  stopAsyncValidation, touch, touchAll, untouch, untouchAll} from './actions';

const initializeWithKey = (form, key, data) => bindSliceKey(initialize, key)(form, data);

export default reduxForm;
export {
  blur,
  change,
  createFormReducer,
  initialize,
  initializeWithKey,
  reset,
  startAsyncValidation,
  stopAsyncValidation,
  touch,
  touchAll,
  untouch,
  untouchAll
};
