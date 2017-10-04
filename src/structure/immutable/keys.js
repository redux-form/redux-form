// @flow
import { isCollection, List } from 'immutable'
import plainKeys from '../plain/keys'

const empty = List()

const keys = (value: any) => {
  if (List.isList(value)) {
    return value.map(i => i.name)
  }

  if (isCollection(value)) {
    return value.keySeq()
  }

  return value ? List(plainKeys(value)) : empty
}

export default keys
