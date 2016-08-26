import expect from 'expect'
import { fromJS, Map, List } from 'immutable'
import setIn from '../setIn'

describe('structure.immutable.setIn', () => {
  it('should handle undefined', () => {
    let result = setIn(new Map(), undefined, 'success')
    expect(result).toEqual('success')
  })
  it('should handle dot paths', () => {
    let result = setIn(new Map(), 'a.b.c', 'success')

    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b).toExist('b missing')

    let c = b.get('c')
    expect(c).toEqual('success')
  })
  it('should handle array paths', () => {
    let result = setIn(new Map(), 'a.b[0]', 'success')

    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b)
      .toExist('b missing')
      .toBeA(List)
      .toEqual(fromJS([ 'success' ]))
  })
  it('should handle array paths with successive sets', () => {
    let result = setIn(new Map(), 'a.b[2]', 'success')
    result = setIn(result, 'a.b[0]', 'success')

    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b)
      .toExist('b missing')
      .toBeA(List)
      .toEqual(fromJS([ 'success', undefined, 'success' ]))
  })
  it('should handle array paths with existing array', () => {
    let result = setIn(new Map({
      a: new Map({
        b: new List([ 'first' ])
      })
    }), 'a.b[1].value', 'success')

    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b)
      .toExist('b missing')
      .toBeA(List)
      .toEqual(fromJS([ 'first', { value: 'success' } ]))
  })
  it('should handle array paths with existing array with undefined', () => {
    let result = setIn(new Map({
      a: new Map({
        b: new List([ 'first', undefined ])
      })
    }), 'a.b[1].value', 'success')

    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b)
      .toExist('b missing')
      .toBeA(List)
      .toEqual(fromJS([ 'first', { value: 'success' } ]))
  })
  it('should handle multiple array paths', () => {
    let result = setIn(new Map(), 'a.b[0].c.d[13].e', 'success')

    let a = result.get('a')
    expect(a).toExist('a missing').toBeA(Map)

    let b = a.get('b')
    expect(b).toExist('b missing').toBeA(List)

    let b0 = b.get(0)
    expect(b0).toExist('b[0] missing').toBeA(Map)

    let c = b0.get('c')
    expect(c).toExist('c missing').toBeA(Map)

    let d = c.get('d')
    expect(d).toExist('d missing').toBeA(List)

    let d13 = d.get(13)
    expect(d13).toExist('d[13] missing').toBeA(Map)

    let e = d13.get('e')
    expect(e).toExist('e missing').toEqual('success')
  })
  it('should handle indexer paths', () => {
    let result = setIn(new Map(), 'a.b[c].d[e]', 'success')

    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b).toExist('b missing')

    let c = b.get('c')
    expect(c).toExist('c missing')

    let d = c.get('d')
    expect(d).toExist('d missing')

    let e = d.get('e')
    expect(e).toExist('e missing').toEqual('success')
  })
})
