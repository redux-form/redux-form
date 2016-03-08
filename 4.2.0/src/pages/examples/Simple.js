import React, {Component} from 'react';
import SimpleForm, {fields} from '../../examples/SimpleForm';
import Example from '../../components/Example';
import explanation from './Simple.md';
import raw from '!!raw!../../examples/SimpleForm';

class Simple extends Component {
  render() {
    return (
      <Example
        name="Simple Form"
        explanation={explanation}
        component={SimpleForm}
        form="simple"
        fields={fields}
        files={{'SimpleForm.js': raw}}/>
    );
  }
}

export default Simple;
