import {Iterable, List} from 'immutable'
import plainKeys from '../plain/keys'

const empty = List()

const keys = value => {
  if (Iterable.isIterable(value)) {
    return value.keySeq()
  }

  return value ? List(plainKeys(value)) : empty
}

export default keys
