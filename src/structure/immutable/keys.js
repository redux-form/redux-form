import {Iterable, List} from 'immutable'
import plainKeys from '../plain/keys'

const empty = List()

const keys = value => {
  if (List.isList(value)) {
    return value.map(i => i.name)
  }
  
  if (Iterable.isIterable(value)) {
    return value.keySeq()
  }
  
  return value ? List(plainKeys(value)) : empty
}

export default keys
