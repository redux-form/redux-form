import React from 'react'
import { values as valuesDecorator } from 'redux-form'
import Code from './Code'

const Values = ({ form }) => {
  const decorator = valuesDecorator({ form })
  const component = ({ values }) =>
    (
      <div>
        <h2>Values</h2>
        <Code source={JSON.stringify(values, null, 2)}/>
      </div>
    )
  const Decorated = decorator(component)
  return <Decorated/>
}

export default Values
