import React from 'react';
import SimpleForm, {fields} from '../examples/SimpleForm';
import Example from '../components/Example';
import explanation from './Simple.md';
import raw from '!!raw!../examples/SimpleForm';

const Simple = () =>
  <Example
    name="Simple Form"
    explanation={explanation}
    formComponent={SimpleForm}
    form="simple"
    fields={fields}
    raw={raw}/>;

export default Simple;
