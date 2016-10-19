const defaultShouldValidate = ({
  values,
  nextProps,
  // props,  // not used in default implementation
  initialRender,
  structure
}) => {
  if (initialRender) {
    return true
  }
  return !structure.deepEqual(values, nextProps.values)
}

export default defaultShouldValidate
