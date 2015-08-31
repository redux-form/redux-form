import {connect} from 'react-redux';
import reduxForm from './reduxForm';

const connector = connect(state => ({
  form: state.form
}));

function reduceDecorators(...decorators) {
  return DecoratedComponent =>
    decorators.reduce((accumulator, decorator) =>
      decorator(accumulator), DecoratedComponent);
}

export default function connectReduxForm(...args) {
  return reduceDecorators(reduxForm(...args), connector);
}
