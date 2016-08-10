import { List } from 'immutable'

export default (list = List.isList(list) || List(), index, removeNum, value) => {
  if (index < list.count()) {
    if (value != null) {
      return list.splice(index, removeNum, value)  // removing and adding
    } else {
      return list.splice(index, removeNum)  // removing
    }
  }
  if (value != null) {
    return list.set(index, value)
  }
  return list
}
