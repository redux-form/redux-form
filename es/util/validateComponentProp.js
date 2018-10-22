import { isValidElementType } from 'react-is';

var validateComponentProp = function validateComponentProp(props, propName, componentName) {
  if (!isValidElementType(props[propName])) {
    return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`.');
  }
  return null;
};

export default validateComponentProp;