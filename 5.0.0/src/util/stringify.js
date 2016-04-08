const replacer = (key, value) =>
  value instanceof FileList ?
  Array.from(value).map(file => file.name).join(', ') || 'No Files Selected' :
    value

export default function stringify(values) {
  return JSON.stringify(values, replacer, 2)
}
