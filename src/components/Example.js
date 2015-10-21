import React, {Component, PropTypes} from 'react';
import FormValues from './FormValues';
import Code from './Code';
import DevToolsReminder from './DevToolsReminder';
import stripClasses from '../util/stripClasses';

export default class Example extends Component {
  static propTypes = {
    explanation: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    form: PropTypes.string.isRequired,
    formComponent: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    raw: PropTypes.string.isRequired
  }

  render() {
    const {explanation, fields, form, formComponent, name, raw} = this.props;
    const FormComponent = formComponent;
    return (<div className="container">
      <DevToolsReminder/>

      <h1>{name}</h1>

      <div dangerouslySetInnerHTML={{__html: explanation}}/>

      <h2>Form</h2>

      <FormComponent/>

      <h2>Values</h2>

      <p>Below is a readonly component that is listening to the values in the <code>{form}</code> Redux form.</p>

      <FormValues form={form} fields={fields}/>

      <h2>Code</h2>

      <p>Styling has been removed for clarity.</p>

      <Code>{stripClasses(raw)}</Code>
    </div>);
  }
}
