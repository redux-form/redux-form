import plainGetIn from './structure/plain/getIn'

const getErrorKeys = (name, type) => {
  switch (type) {
    case 'Field':
      return [ name, `${name}._error` ]
    case 'FieldArray':
      return [ `${name}._error` ]
  }
}

const createHasError = ({ getIn }) => {
  const hasError = (field, syncErrors, asyncErrors, submitErrors) => {
    const name = getIn(field, 'name')
    const type = getIn(field, 'type')
    if (!syncErrors && !asyncErrors && !submitErrors) {
      return false
    }
    const errorKeys = getErrorKeys(name, type)

    const syncError = errorKeys.reduce((error, errorKey) => {
      const curError = plainGetIn(syncErrors, errorKey)
      return curError ? error + curError : error
    }, null)
    if (syncError != null) {
      return true
    }
    const asyncError = errorKeys.reduce((error, errorKey) => {
      const curError = getIn(asyncErrors, errorKey)
      return curError ? error + curError : error
    }, null)
    if (asyncError != null) {
      return true
    }
    const submitError = errorKeys.reduce((error, errorKey) => {
      const curError = getIn(submitErrors, errorKey)
      return curError ? error + curError : error
    }, null)
    if (submitError != null) {
      return true
    }

    return false
  }
  return hasError
}

export default createHasError
