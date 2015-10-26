import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import Code from './Code';

class FormValues extends Component {
  static propTypes = {
    values: PropTypes.object.isRequired
  }

  render() {
    return <Code language="json">{JSON.stringify(this.props.values, null, 2)}</Code>;
  }
}

export default reduxForm({readonly: true})(FormValues);
