export default function formatName(context, name) {
  const { _reduxForm: { nestedPrefix } } = context
  return !nestedPrefix ? name : `${nestedPrefix}.${name}`
}
