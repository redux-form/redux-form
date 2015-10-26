import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Modal, Button} from 'react-bootstrap';
import {hide as hideResults} from '../redux/modules/submission';
import Code from './Code';

class SubmissionResults extends Component {
  static propTypes = {
    hide: PropTypes.func.isRequired,
    results: PropTypes.object.isRequired,
    shown: PropTypes.bool
  }

  render() {
    const {hide, results, shown} = this.props;
    return (
      <Modal show={shown} onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title>Values Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Code language="json">{JSON.stringify(results, null, 2)}</Code>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(
  state => ({
    shown: state.submission.shown,
    results: state.submission.results
  }),
  {
    hide: hideResults
  }
)(SubmissionResults);
