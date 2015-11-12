import getValue from './getValue';
const createOnBlur =
  (name, blur, isReactNative, afterBlur) =>
    event => {
      const value = getValue(event, isReactNative);
      blur(name, value);
      if (afterBlur) {
        afterBlur(name, value);
      }
    };
export default createOnBlur;
