const defaultShouldValidate = ({
  values,
  nextProps,
  // props,  // not used in default implementation
  initialRender,
  lastFieldValidatorKeys,
  fieldValidatorKeys,
  structure
}) => {
  if (initialRender) {
    return true
  }
  return (
    !structure.deepEqual(values, nextProps.values) ||
    !structure.deepEqual(lastFieldValidatorKeys, fieldValidatorKeys)
  )
}

export default defaultShouldValidate
