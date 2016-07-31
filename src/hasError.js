import plainGetIn from './structure/plain/getIn'

const getErrorKey = (name, type) => {
  switch (type) {
    case 'Field':
      return name
    case 'FieldArray':
      return `${name}._error`
  }
}

const createHasError = ({ getIn }) => {
  const hasError = (field, syncErrors, asyncErrors, submitErrors) => {
    const name = getIn(field, 'name')
    const type = getIn(field, 'type')
    if (!syncErrors && !asyncErrors && !submitErrors) {
      return false
    }
    const errorKey = getErrorKey(name, type)
    const syncError = plainGetIn(syncErrors, errorKey)
    if (syncError && typeof syncError === 'string') {
      return true
    }
    const asyncError = getIn(asyncErrors, errorKey)
    if (asyncError && typeof asyncError === 'string') {
      return true
    }
    const submitError = getIn(submitErrors, errorKey)
    if (submitError && typeof submitError === 'string') {
      return true
    }

    return false
  }
  return hasError
}

export default createHasError
