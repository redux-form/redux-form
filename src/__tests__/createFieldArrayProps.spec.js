import { createSpy } from 'expect'
import createFieldArrayProps from '../createFieldArrayProps'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeCreateFieldProps = (name, structure, expect) => {
  const { fromJS, getIn, size } = structure
  const defaultProps = [ getIn, size, 'foo' ]

  describe(name, () => {
    it('should pass props through', () => {
      expect(createFieldArrayProps(...defaultProps, { otherProp: 'hello' }).otherProp).toBe('hello')
    })

    it('should pass props through using props prop', () => {
      expect(createFieldArrayProps(...defaultProps, { props: { otherProp: 'hello' } }).otherProp).toBe('hello')
    })

    it('should pass dirty/pristine through', () => {
      expect(createFieldArrayProps(...defaultProps, {
        dirty: false,
        pristine: true
      }).fields.dirty).toBe(false)
      expect(createFieldArrayProps(...defaultProps, {
        dirty: false,
        pristine: true
      }).fields.pristine).toBe(true)
      expect(createFieldArrayProps(...defaultProps, {
        dirty: true,
        pristine: false
      }).fields.dirty).toBe(true)
      expect(createFieldArrayProps(...defaultProps, {
        dirty: true,
        pristine: false
      }).fields.pristine).toBe(false)
    })

    it('should provide length', () => {
      expect(createFieldArrayProps(...defaultProps, {
        value: fromJS([])
      }).fields.length).toBe(0)
      expect(createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a' ])
      }).fields.length).toBe(1)
      expect(createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ])
      }).fields.length).toBe(2)
      expect(createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ])
      }).fields.length).toBe(3)
    })

    it('should provide errors', () => {
      expect(createFieldArrayProps(...defaultProps, { syncError: 'Sync Error' }).fields.error).toBe('Sync Error')
      expect(createFieldArrayProps(...defaultProps, { syncError: 'Sync Error' }).fields.valid).toBe(false)
      expect(createFieldArrayProps(...defaultProps, { syncError: 'Sync Error' }).fields.invalid).toBe(true)
      expect(createFieldArrayProps(...defaultProps, {
        asyncError: 'Async Error'
      }).fields.error).toBe('Async Error')
      expect(createFieldArrayProps(...defaultProps, {
        asyncError: 'Async Error'
      }).fields.valid).toBe(false)
      expect(createFieldArrayProps(...defaultProps, {
        asyncError: 'Async Error'
      }).fields.invalid).toBe(true)
      expect(createFieldArrayProps(...defaultProps, {
        submitError: 'Submit Error'
      }).fields.error).toBe('Submit Error')
      expect(createFieldArrayProps(...defaultProps, {
        submitError: 'Submit Error'
      }).fields.valid).toBe(false)
      expect(createFieldArrayProps(...defaultProps, {
        submitError: 'Submit Error'
      }).fields.invalid).toBe(true)
    })

    it('should provide move', () => {
      const arrayMove = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ]),
        arrayMove
      })
      expect(result.fields.move).toBeA('function')
      expect(arrayMove).toNotHaveBeenCalled()
      expect(result.fields.move(0, 2)).toNotExist()
      expect(arrayMove)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(0, 2)
    })

    it('should provide push', () => {
      const arrayPush = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ]),
        arrayPush
      })
      expect(result.fields.push).toBeA('function')
      expect(arrayPush).toNotHaveBeenCalled()
      expect(result.fields.push('c')).toNotExist()
      expect(arrayPush)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith('c')
    })

    it('should provide pop', () => {
      const arrayPop = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ]),
        arrayPop
      })
      expect(result.fields.pop).toBeA('function')
      expect(arrayPop).toNotHaveBeenCalled()
      expect(result.fields.pop()).toBe('c')
      expect(arrayPop)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith()
    })

    it('should provide insert', () => {
      const arrayInsert = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ]),
        arrayInsert
      })
      expect(result.fields.insert).toBeA('function')
      expect(arrayInsert).toNotHaveBeenCalled()
      expect(result.fields.insert(1, 'c')).toNotExist()
      expect(arrayInsert)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(1, 'c')
    })

    it('should provide remove', () => {
      const arrayRemove = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ]),
        arrayRemove
      })
      expect(result.fields.remove).toBeA('function')
      expect(arrayRemove).toNotHaveBeenCalled()
      expect(result.fields.remove(2)).toNotExist()
      expect(arrayRemove)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(2)
    })

    it('should provide removeAll', () => {
      const arrayRemoveAll = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ]),
        arrayRemoveAll
      })
      expect(result.fields.removeAll).toBeA('function')
      expect(arrayRemoveAll).toNotHaveBeenCalled()
      expect(result.fields.removeAll()).toNotExist()
      expect(arrayRemoveAll)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith()
    })

    it('should provide unshift', () => {
      const arrayUnshift = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b' ]),
        arrayUnshift
      })
      expect(result.fields.unshift).toBeA('function')
      expect(arrayUnshift).toNotHaveBeenCalled()
      expect(result.fields.unshift('c')).toNotExist()
      expect(arrayUnshift)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith('c')
    })

    it('should provide shift', () => {
      const arrayShift = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ]),
        arrayShift
      })
      expect(result.fields.shift).toBeA('function')
      expect(arrayShift).toNotHaveBeenCalled()
      expect(result.fields.shift()).toBe('a')
      expect(arrayShift)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith()
    })

    it('should provide forEach', () => {
      const callback = createSpy()
      const result = createFieldArrayProps(...defaultProps, {
        value: fromJS([ 'a', 'b', 'c' ])
      })
      expect(result.fields.forEach).toBeA('function')
      expect(callback).toNotHaveBeenCalled()
      result.fields.forEach(callback)
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
      expect(result.fields.map).toBeA('function')
      expect(callback).toNotHaveBeenCalled()
      const mapResult = result.fields.map(callback)
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
      expect(result.fields.swap).toBeA('function')
      expect(arraySwap).toNotHaveBeenCalled()
      expect(result.fields.swap(0, 2)).toNotExist()
      expect(arraySwap)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(0, 2)
    })
  })
}

describeCreateFieldProps('createFieldArrayProps.plain', plain, addExpectations(plainExpectations))
describeCreateFieldProps('createFieldArrayProps.immutable', immutable, addExpectations(immutableExpectations))
