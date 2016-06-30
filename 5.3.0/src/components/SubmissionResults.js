import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { hide as hideResults } from '../redux/modules/submission'
import Code from './Code'
import stringify from '../util/stringify'

class SubmissionResults extends Component {
  render() {
    const { hide, results, shown } = this.props
    return (
      <Modal show={shown} onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title>Values Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Code language="json">{stringify(results)}</Code>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
SubmissionResults.propTypes = {
  hide: PropTypes.func.isRequired,
  results: PropTypes.object,
  shown: PropTypes.bool
}

export default connect(
  state => ({
    shown: state.submission.shown,
    results: state.submission.results
  }),
  {
    hide: hideResults
  }
)(SubmissionResults)
