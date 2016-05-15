/**
 * This is a selector aimed at making it more convenient to connect to form
 * values, as discussed e.g. here:
 * https://github.com/erikras/redux-form/issues/945
 * https://github.com/erikras/redux-form/issues/967
 *
 * @param formState The slice of the Redux state where the `redux-form` reducer
 * has been mounted
 * @param formName The name of the form passed (under the 'form' key)
 * to reduxForm()
 * @param field The key of the value to return. It may be deeply nested, e.g.
 * like so: 'keyWithObjectValue.keyWithArrayValue[0]'
 */
import structure from './structure/immutable'

const getFormValue = ({
  formState,
  formName,
  field
}) => {
  if (!formState || !formName || !field) {
    throw new Error('Missing argument, must include { formState, formName, field }')
  }

  // getIn() from './structure/immutable' handles both Immutable and plain state
  const { getIn } = structure

  if (!getIn(formState, formName) ||
      !getIn(formState, `${formName}.values`)
  ) {
    return undefined
  }

  return getIn(formState, `${formName}.values.${field}`)
}

export default getFormValue
