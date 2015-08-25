import {connect} from 'react-redux';
import reduxForm from './reduxForm';

const connector = connect(state => ({
  form: state.form
}));

function createDecorator(...decorators) {
  return DecoratedComponent =>
    decorators.reduce((accumulator, decorator) =>
      decorator(accumulator), DecoratedComponent);
}

export default function connectReduxForm(...args) {
  const decorator = createDecorator(reduxForm(...args), connector);
  decorator.async = (...asyncArgs) => createDecorator(reduxForm(...args).async(...asyncArgs), connector);
  return decorator;
}
