import React, { Component, PropTypes } from 'react'
import DynamicForm, { labels } from './DynamicForm'

class DynamicFormContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: true,
      lastName: true,
      email: false,
      age: false,
      street: false,
      city: false
    }
  }

  render() {
    return (<div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: 20 }}>
          {Object.keys(this.state).map(field =>
            <label key={field} style={{ padding: '5px 15px' }}>
              <input type="checkbox"
                checked={this.state[field]}
                onChange={event => this.setState({ [field]: event.target.checked })}/> {labels[ field ]}
            </label>
          )}
        </div>
        <DynamicForm
          onSubmit={this.props.onSubmit}
          fields={Object
            .keys(this.state)
            .filter(field => this.state[field])}/>
      </div>
    )
  }
}
DynamicFormContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired // passed in by example engine to pop up modal
}


export default DynamicFormContainer
