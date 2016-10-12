export default function formatName(context, name) {
  const { _reduxForm: { sectionPrefix } } = context
  return !sectionPrefix ? name : `${sectionPrefix}.${name}`
}
