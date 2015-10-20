import React, {Component, PropTypes} from 'react';
import FormValues from './FormValues';
import Code from './Code';
import stripClasses from '../util/stripClasses';

export default class Example extends Component {
  static propTypes = {
    formComponent: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    form: PropTypes.string.isRequired,
    raw: PropTypes.string.isRequired
  }

  render() {
    const {formComponent, name, fields, form, raw} = this.props;
    const FormComponent = formComponent;
    return (<div className="container">
        <h1>{name}</h1>

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
