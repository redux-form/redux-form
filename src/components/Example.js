import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import FormValues from './FormValues';
import Code from './Code';
import DevToolsReminder from './DevToolsReminder';
import SubmissionResults from './SubmissionResults';
import stripStyling from '../util/stripStyling';
import {show as showResults} from '../redux/modules/submission';

@connect( undefined, {submit: showResults})
export default class Example extends Component {
  static propTypes = {
    explanation: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    form: PropTypes.string.isRequired,
    formComponent: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    passSubmit: PropTypes.bool.isRequired,
    raw: PropTypes.string.isRequired,
    submit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    passSubmit: true
  }

  render() {
    const {explanation, fields, form, formComponent, name, passSubmit, raw, submit} = this.props;
    const FormComponent = formComponent;
    return (<div className="container">
      <DevToolsReminder/>

      <h1>{name}</h1>

      <div dangerouslySetInnerHTML={{__html: explanation}}/>

      <h2>Form</h2>

      {passSubmit ? <FormComponent onSubmit={submit}/> : <FormComponent/>}

      <h2>Values</h2>

      <p>Below is a readonly component that is listening to the values in the <code>{form}</code> Redux form.</p>

      <FormValues form={form} fields={fields}/>

      <h2>Code</h2>

      <p>Styling has been removed for clarity.</p>

      <Code>{stripStyling(raw)}</Code>

      <SubmissionResults/>
    </div>);
  }
}
