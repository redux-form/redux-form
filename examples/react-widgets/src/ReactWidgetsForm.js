import React from 'react'
import { Field, reduxForm } from 'redux-form'
import DropdownList from 'react-widgets/lib/DropdownList'
import SelectList from 'react-widgets/lib/SelectList'
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css'

const colors = [ { color: 'Red', value: 'ff0000' },
  { color: 'Green', value: '00ff00' },
  { color: 'Blue', value: '0000ff' } ]

const renderDropdownList = ({ input, ...rest }) =>
  <DropdownList {...input} {...rest}/>

const renderMultiselect = ({ input, ...rest }) =>
  <Multiselect {...input}
    onBlur={() => input.onBlur()}
    value={input.value || []} // requires value to be an array
    {...rest}/>

const renderSelectList = ({ input, ...rest }) =>
  <SelectList {...input} onBlur={() => input.onBlur()} {...rest}/>

let ReactWidgetsForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Favorite Color</label>
        <Field
          name="favoriteColor"
          component={renderDropdownList}
          data={colors}
          valueField="value"
          textField="color"/>
      </div>
      <div>
        <label>Hobbies</label>
        <Field
          name="hobbies"
          component={renderMultiselect}
          data={[ 'Guitar', 'Cycling', 'Hiking' ]}/>
      </div>
      <div>
        <label>Sex</label>
        <Field
          name="sex"
          component={renderSelectList}
          data={[ 'male', 'female' ]}/>
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Reset Values
        </button>
      </div>
    </form>
  )
}

ReactWidgetsForm = reduxForm({
  form: 'reactWidgets'  // a unique identifier for this form
})(ReactWidgetsForm)

export default ReactWidgetsForm
