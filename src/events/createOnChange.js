import getValue from './getValue';
const createOnChange =
  (name, change, isReactNative) =>
    event => change(name, getValue(event, isReactNative));
export default createOnChange;
