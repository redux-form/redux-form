import { createSpy } from 'expect'
import createFieldArrayProps from '../createFieldArrayProps'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeCreateFieldProps = (name, structure, expect) => {
  const { empty, fromJS, getIn, deepEqual, size } = structure
  const defaultProps = [ deepEqual, getIn, size, 'foo' ]

  describe(name, () => {
    it('should pass props through', () => {
      expect(createFieldArrayProps(...defaultProps, { otherProp: 'hello' }).otherProp).toBe('hello')
    })

    it('should calculate dirty/pristine', () => {
      expect(createFieldArrayProps(...defaultProps, {
        initial: fromJS([ 'bar' ]),
        value: fromJS([ 'bar' ])
      }).dirty).toBe(false)
      expect(createFieldArrayProps(...defaultProps, {
        initial: fromJS([ 'bar' ]),
        value: fromJS([ 'bar' ])
      }).pristine).toBe(true)
      expect(createFieldArrayProps(...defaultProps, {
        initial: fromJS([ 'bar' ]),
        value: fromJS([ 'baz' ])
      }).dirty).toBe(true)
      expect(createFieldArrayProps(...defaultProps, {
        initial: fromJS([ 'bar' ]),
        value: fromJS([ 'baz' ])
      }).pristine).toBe(false)
    })

    it('should provide length', () => {
      expect(createFieldArrayProps(...defaultProps, {
        value: fromJS([])
      }).length).toBe(0)
      expect(createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a' ])
      }).length).toBe(1)
      expect(createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ])
      }).length).toBe(2)
      expect(createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ])
      }).length).toBe(3)
    })

    it('should provide errors', () => {
      expect(createFieldArrayProps(...defaultProps, {}, 'Sync Error').error).toBe('Sync Error')
      expect(createFieldArrayProps(...defaultProps, {}, 'Sync Error').valid).toBe(false)
      expect(createFieldArrayProps(...defaultProps, {}, 'Sync Error').invalid).toBe(true)
      expect(createFieldArrayProps(...defaultProps, {
        asyncError: 'Async Error'
      }).error).toBe('Async Error')
      expect(createFieldArrayProps(...defaultProps, {
        asyncError: 'Async Error'
      }).valid).toBe(false)
      expect(createFieldArrayProps(...defaultProps, {
        asyncError: 'Async Error'
      }).invalid).toBe(true)
      expect(createFieldArrayProps(...defaultProps, {
        submitError: 'Submit Error'
      }).error).toBe('Submit Error')
      expect(createFieldArrayProps(...defaultProps, {
        submitError: 'Submit Error'
      }).valid).toBe(false)
      expect(createFieldArrayProps(...defaultProps, {
        submitError: 'Submit Error'
      }).invalid).toBe(true)
    })

    it('should provide push', () => {
      const arraySplice = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ]),
        arraySplice
      })
      expect(result.push).toBeA('function')
      expect(arraySplice).toNotHaveBeenCalled()
      expect(result.push('c')).toNotExist()
      expect(arraySplice)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(2, 0, 'c')
    })

    it('should provide pop', () => {
      const arraySplice = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ]),
        arraySplice
      })
      expect(result.pop).toBeA('function')
      expect(arraySplice).toNotHaveBeenCalled()
      expect(result.pop()).toBe('c')
      expect(arraySplice)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(2, 1)
    })

    it('should provide insert', () => {
      const arraySplice = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ]),
        arraySplice
      })
      expect(result.insert).toBeA('function')
      expect(arraySplice).toNotHaveBeenCalled()
      expect(result.insert(1, 'c')).toNotExist()
      expect(arraySplice)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(1, 0, 'c')
    })
    
    it('should provide remove', () => {
      const arraySplice = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ]),
        arraySplice
      })
      expect(result.remove).toBeA('function')
      expect(arraySplice).toNotHaveBeenCalled()
      expect(result.remove(2)).toNotExist()
      expect(arraySplice)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(2, 1)
    })
    
    it('should provide unshift', () => {
      const arraySplice = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ]),
        arraySplice
      })
      expect(result.unshift).toBeA('function')
      expect(arraySplice).toNotHaveBeenCalled()
      expect(result.unshift('c')).toNotExist()
      expect(arraySplice)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(0, 0, 'c')
    })

    it('should provide shift', () => {
      const arraySplice = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ]),
        arraySplice
      })
      expect(result.shift).toBeA('function')
      expect(arraySplice).toNotHaveBeenCalled()
      expect(result.shift()).toBe('a')
      expect(arraySplice)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(0, 1)
    })

    it('should provide forEach', () => {
      const callback = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ])
      })
      expect(result.forEach).toBeA('function')
      expect(callback).toNotHaveBeenCalled()
      result.forEach(callback)
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(3)
      expect(callback.calls[ 0 ].arguments).toEqual([ 'foo[0]', 0 ])
      expect(callback.calls[ 1 ].arguments).toEqual([ 'foo[1]', 1 ])
      expect(callback.calls[ 2 ].arguments).toEqual([ 'foo[2]', 2 ])
    })

    it('should provide map', () => {
      const callback = createSpy(name => ({ whatever: true, name })).andCallThrough()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ])
      })
      expect(result.map).toBeA('function')
      expect(callback).toNotHaveBeenCalled()
      const mapResult = result.map(callback)
      expect(size(mapResult), 3)
      expect(getIn(mapResult, 0)).toEqual({ whatever: true, name: 'foo[0]' })
      expect(getIn(mapResult, 1)).toEqual({ whatever: true, name: 'foo[1]' })
      expect(getIn(mapResult, 2)).toEqual({ whatever: true, name: 'foo[2]' })
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(3)
      expect(callback.calls[ 0 ].arguments).toEqual([ 'foo[0]', 0 ])
      expect(callback.calls[ 1 ].arguments).toEqual([ 'foo[1]', 1 ])
      expect(callback.calls[ 2 ].arguments).toEqual([ 'foo[2]', 2 ])
    })

    it('should provide swap', () => {
      const arraySwap = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        arraySwap,
        value: fromJS([ 'a', 'b', 'c' ])
      })
      expect(result.swap).toBeA('function')
      expect(arraySwap).toNotHaveBeenCalled()
      expect(result.swap(0, 2)).toNotExist()
      expect(arraySwap)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(0, 2)
    })
  })
}

describeCreateFieldProps('createFieldArrayProps.plain', plain, addExpectations(plainExpectations))
describeCreateFieldProps('createFieldArrayProps.immutable', immutable, addExpectations(immutableExpectations))
