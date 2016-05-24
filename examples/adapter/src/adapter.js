import React from 'react'

const FieldWrapper = ({ touched, error, children, label }) =>
  <div>
   <label>{label}</label>
   <div>
     {children}
     {touched && error && <span>{error}</span>}
   </div>
 </div>

const components = {

  myCustomText: props => 
    <FieldWrapper {...props}>
      <input type="text" {...props} placeholder={props.label}/>
    </FieldWrapper>,

  myCustomEmail: props => 
    <FieldWrapper {...props}>
      <input type="email" {...props} placeholder={props.label}/>
    </FieldWrapper>,

  myCustomPassword: props =>
    <FieldWrapper {...props}>
      <input type="password" {...props} placeholder={props.label}/>
    </FieldWrapper>,
  
  myCustomNumber: props => 
    <FieldWrapper {...props}>
      <input type="number" {...props} placeholder={props.label}/>
    </FieldWrapper>
  
}

const adapter = (key, props) => {
  const component = components[ key ]
  if (component) {
    return component(props)
  }
}

export default adapter
