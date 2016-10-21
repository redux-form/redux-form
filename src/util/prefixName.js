const isFieldArrayRegx = /\[\d+\]$/

export default function formatName(context, name) {
  const { _reduxForm: { sectionPrefix } } = context
  return !sectionPrefix || isFieldArrayRegx.test(name) ? name : `${sectionPrefix}.${name}`
}
