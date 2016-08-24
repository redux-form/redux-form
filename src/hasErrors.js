const createHasErrors = ({ getIn }) => {
  const hasErrors = errors => {
    if (!errors) {
      return false
    }
    if (typeof errors === 'string') {
      return !!errors
    }
    return false
  }
  return hasErrors
}

export default createHasErrors
