import React from 'react';
import {reduxForm} from 'redux-form';
import Code from './Code';

const FormValues = props =>
  <Code language="json">{JSON.stringify(props.values, null, 2)}</Code>;

export default reduxForm({readonly: true})(FormValues);
