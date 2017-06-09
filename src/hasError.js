const getErrorKeys = (name, type) => {
  switch (type) {
    case 'Field':
      return [name, `${name}._error`]
    case 'FieldArray':
      return [`${name}._error`]
    default:
      throw new Error('Unknown field type')
  }
}

const createHasError = ({ getIn }) => {
  const hasError = (field, syncErrors, asyncErrors, submitErrors) => {
    if (!syncErrors && !asyncErrors && !submitErrors) {
      return false
    }

    const name = getIn(field, 'name')
    const type = getIn(field, 'type')
    return getErrorKeys(name, type).some(
      key =>
        getIn(syncErrors, key) ||
        getIn(asyncErrors, key) ||
        getIn(submitErrors, key)
    )
  }
  return hasError
}

export default createHasError
