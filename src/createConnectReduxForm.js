import createReduxForm from './createReduxForm';

function reduceDecorators(...decorators) {
  return DecoratedComponent =>
    decorators.reduce((accumulator, decorator) =>
      decorator(accumulator), DecoratedComponent);
}

export default function createConnectReduxForm(isReactNative, React, connect) {
  const reduxForm = createReduxForm(isReactNative, React);
  const connector = connect(state => ({
    form: state.form
  }));
  return function connectReduxForm(...args) {
    return reduceDecorators(reduxForm(...args), connector);
  };
}
