import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button} from 'react-bootstrap';
import {hide} from '../redux/modules/submission';
import Code from './Code';

const FormValues = props =>
  <Modal show={props.shown} onHide={props.hide}>
    <Modal.Header closeButton>
      <Modal.Title>Values Submitted</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Code language="json">{JSON.stringify(props.results, null, 2)}</Code>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.hide}>Close</Button>
    </Modal.Footer>
  </Modal>;

export default connect(
  state => ({
    shown: state.submission.shown,
    results: state.submission.results
  }),
  {hide}
)(FormValues);
