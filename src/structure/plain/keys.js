// @flow
type Named = {
  name: string
}

function keys<T: Object | Named[]>(value: ?T): Array<any> {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.map(i => i.name)
  }

  return Object.keys(value)
}

export default keys
