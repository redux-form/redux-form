import React, {Component} from 'react';
import InitializingFromStateForm, {fields} from '../../examples/InitializingFromStateForm';
import Example from '../../components/Example';
import explanation from './InitializingFromState.md';
import raw from '!!raw!../../examples/InitializingFromStateForm';
import rawAccount from '!!raw!../../redux/modules/account';

class InitializingFromState extends Component {
  render() {
    return (
      <Example
        name="Initializing From State"
        explanation={explanation}
        component={InitializingFromStateForm}
        form="initializing"
        fields={fields}
        files={{
          'account.js': rawAccount,
          'InitializingFromStateForm.js': raw
        }}/>
    );
  }
}

export default InitializingFromState;
