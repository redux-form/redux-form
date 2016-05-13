const createHasErrors = ({ getIn, some }) => {
  const hasErrors = errors => {
    if (!errors) {
      return false
    }
    const globalError = getIn(errors, '_error')
    if (globalError) {
      return true
    }
    if (typeof errors === 'string') {
      return !!errors
    }
    return !!errors && some(errors, hasErrors)
  }
  return hasErrors
}

export default createHasErrors
