import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import Code from './Code';
import stringify from '../util/stringify';

class FormValues extends Component {
  static propTypes = {
    values: PropTypes.object.isRequired
  }

  render() {
    return <Code language="json">{stringify(this.props.values)}</Code>;
  }
}

export default reduxForm({readonly: true})(FormValues);
