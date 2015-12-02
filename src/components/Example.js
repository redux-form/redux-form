import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap';
import Markdown from './Markdown';
import FormValues from './FormValues';
import Code from './Code';
import DevToolsReminder from './DevToolsReminder';
import SubmissionResults from './SubmissionResults';
import stripStyling from '../util/stripStyling';
import {show as showResults} from '../redux/modules/submission';

@connect(undefined, {submit: showResults})
export default class Example extends Component {
  static propTypes = {
    component: PropTypes.any.isRequired,
    explanation: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    files: PropTypes.object.isRequired,
    reduxMountPoint: PropTypes.string.isRequired,
    submit: PropTypes.func.isRequired
  }

  static defaultProps = {
    passSubmit: true,
    reduxMountPoint: 'form'
  }

  render() {
    const {explanation, fields, form, name, files, reduxMountPoint, submit} = this.props;
    const Form = this.props.component;
    return (<div className="container">
      <DevToolsReminder/>

      <Breadcrumb>
        <BreadcrumbItem href="#/">Redux Form</BreadcrumbItem>
        <BreadcrumbItem href="#/examples">Examples</BreadcrumbItem>
        <BreadcrumbItem active>{name}</BreadcrumbItem>
      </Breadcrumb>

      <h1>{name}</h1>

      <Markdown value={explanation}/>

      <h2>Form</h2>

      <Form onSubmit={values => new Promise(resolve =>
        setTimeout(() => resolve(submit(values)), 500))}/>

      {fields && <div>
        <h2>Values</h2>

        <p>Below is a readonly component that is listening to the values in the <code>{form}</code> Redux form.</p>

        <FormValues form={form} fields={fields} reduxMountPoint={reduxMountPoint}/>
      </div>}

      <h2>Code</h2>

      <p>
        The code below is literally the exact same code running in the example above. Styling has been removed for
        clarity.
      </p>

      {Object.keys(files).map(filename =>
        <div key={filename}>
          <h4><code>{filename}</code></h4>
          <Code>{stripStyling(files[filename])}</Code>
        </div>
      )}

      <SubmissionResults/>
    </div>);
  }
}
