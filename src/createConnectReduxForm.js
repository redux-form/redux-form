import {connect} from 'react-redux';
import createReduxForm from './createReduxForm';

const connector = connect(state => ({
  form: state.form
}));

function reduceDecorators(...decorators) {
  return DecoratedComponent =>
    decorators.reduce((accumulator, decorator) =>
      decorator(accumulator), DecoratedComponent);
}

export default function createConnectReduxForm(isReactNative, React) {
  const reduxForm = createReduxForm(isReactNative, React);
  return function connectReduxForm(...args) {
    return reduceDecorators(reduxForm(...args), connector);
  };
}
