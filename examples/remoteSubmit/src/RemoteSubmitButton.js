import React from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'

const style = {
  padding: '10px 20px',
  width: 140,
  display: 'block',
  margin: '20px auto',
  fontSize: '16px'
}

const RemoteSubmitButton = ({dispatch}) =>
  <button
    type="button"
    style={style}
    onClick={() => dispatch(submit('remoteSubmit'))}
  >
    Submit
  </button>
//                                  ^^^^^^^^^^^^ name of the form

export default connect()(RemoteSubmitButton)
