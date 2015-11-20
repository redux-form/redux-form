export function replacer(key, value) {
  if (value instanceof FileList) {
    return Array.from(value).map(file => file.name).join(', ') || 'No Files Selected';
  }

  return value;
}

export default function stringify(values) {
  return JSON.stringify(values, replacer, 2);
}
