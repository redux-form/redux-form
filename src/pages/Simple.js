import React from 'react';
import SimpleForm, {fields} from '../examples/SimpleForm';
import Example from '../components/Example';
import raw from '!!raw!../examples/SimpleForm';

const Simple = () =>
  <Example
    name="Simple Example"
    formComponent={SimpleForm}
    form="simple"
    fields={fields}
    raw={raw}/>;

export default Simple;
