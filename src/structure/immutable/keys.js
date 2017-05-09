import {Iterable, List} from 'immutable'

const empty = List()

const keys = value => (Iterable.isIterable(value) ? value.keySeq() : empty)

export default keys
