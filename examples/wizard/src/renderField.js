import React from 'react'

const renderField = props => (
  <div>
    <label>{props.placeholder}</label>
    <div>
      <input {...props}/>
      {props.touched && props.error && <span>{props.error}</span>}
    </div>
  </div>
)

export default renderField
