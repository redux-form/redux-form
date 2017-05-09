import React from 'react'
import {values as valuesDecorator} from 'redux-form/immutable'
import {Code} from 'redux-form-website-template'

/**
 * This is just like the Values component that the other examples import, except that it works
 * with Immutable JS.
 */
const ImmutableValues = ({form}) => {
  const decorator = valuesDecorator({form})
  const component = ({values}) => {
    return (
      <div>
        <h2>Values</h2>
        <Code source={JSON.stringify(values ? values.toJS() : {}, null, 2)} />
      </div>
    )
  }
  const Decorated = decorator(component)
  return <Decorated />
}

export default ImmutableValues
