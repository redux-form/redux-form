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
  it('should update existing Map', () => {
    let initial = fromJS({
      a: {
        b: { c: 'one' }
      }
    })

    let result = setIn(initial, 'a.b.c', 'two')
    
    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b).toExist('b missing')

    let c = b.get('c')
    expect(c).toEqual('two')
  })
  it('should update existing List', () => {
    let initial = fromJS({
      a: {
        b: [ { c: 'one' } ]
      }
    })

    let result = setIn(initial, 'a.b[0].c', 'two')
    
    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b).toExist('b missing')

    let b0 = b.get(0)
    expect(b0).toExist()

    let b0c = b0.get('c')
    expect(b0c).toEqual('two')
  })
  it('should not break existing Map', () => {
    let initial = fromJS({
      a: {
        b: { c: 'one' }
      }
    })

    let result = setIn(initial, 'a.b.d', 'two')
    
    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b).toExist('b missing')

    let c = b.get('c')
    expect(c).toEqual('one')

    let d = b.get('d')
    expect(d).toEqual('two')
  })
  it('should not break existing List', () => {
    let initial = fromJS({
      a: {
        b: [
          { c: 'one' },
          { c: 'two' }
        ]
      }
    })

    let result = setIn(initial, 'a.b[0].c', 'changed')
    
    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b).toExist('b missing')

    let b0 = b.get(0)
    expect(b0).toExist()

    let b0c = b0.get('c')
    expect(b0c).toEqual('changed')

    let b1 = b.get(1)
    expect(b1).toExist()

    let b1c = b1.get('c')
    expect(b1c).toEqual('two')
  })
  it('should add to an existing List', () => {
    let initial = fromJS({
      a: {
        b: [
          { c: 'one' },
          { c: 'two' }
        ]
      }
    })

    let result = setIn(initial, 'a.b[2].c', 'three')
    
    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b).toExist('b missing')

    let b0 = b.get(0)
    expect(b0).toExist()

    let b0c = b0.get('c')
    expect(b0c).toEqual('one')

    let b1 = b.get(1)
    expect(b1).toExist()

    let b1c = b1.get('c')
    expect(b1c).toEqual('two')

    let b2 = b.get(2)
    expect(b2).toExist()

    let b2c = b2.get('c')
    expect(b2c).toEqual('three')
  })
  it('should set a value directly on new list', () => {
    let result = setIn(new Map(), 'a.b[2]', 'three')
    
    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b).toExist('b missing')

    let b0 = b.get(0)
    expect(b0).toEqual(undefined)

    let b1 = b.get(1)
    expect(b1).toEqual(undefined)

    let b2 = b.get(2)
    expect(b2).toEqual('three')
  })
  it('should add to an existing List item', function () {
    let initial = fromJS({
      a: {
        b: [
          {
            c: '123'
          }
        ]
      }
    })

    let result = setIn(initial, 'a.b[0].d', '12')

    let a = result.get('a')
    expect(a).toExist('a missing')

    let b = a.get('b')
    expect(b).toExist('b missing')

    let b0 = b.get(0)
    expect(b0).toExist()

    let b0d = b0.get('d')
    expect(b0d).toEqual('12')

    let b0c = b0.get('c')
    expect(b0c).toEqual('123')
  })
})
