import React, {Component} from 'react';
import FileInputForm, {fields} from '../../examples/FileInputForm';
import Example from '../../components/Example';
import explanation from './File.md';
import raw from '!!raw!../../examples/FileInputForm';

class Simple extends Component {
  render() {
    return (
      <Example
        name="File Input Form"
        explanation={explanation}
        component={FileInputForm}
        form="file"
        fields={fields}
        files={{'FileInputForm.js': raw}}/>
    );
  }
}

export default Simple;
