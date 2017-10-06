import createFieldArrayProps from '../createFieldArrayProps'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/__tests__/expectations'

const describeCreateFieldProps = (name, structure, setup) => {
  const { fromJS, getIn } = structure
  const defaultParams = [structure, 'foo', 'testForm', undefined, () => 69]

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should pass props through', () => {
      expect(
        createFieldArrayProps(...defaultParams, { otherProp: 'hello' })
          .otherProp
      ).toBe('hello')
    })

    it('should pass props through using props prop', () => {
      expect(
        createFieldArrayProps(...defaultParams, {
          props: { otherProp: 'hello' }
        }).otherProp
      ).toBe('hello')
    })

    it('should pass dirty/pristine through', () => {
      expect(
        createFieldArrayProps(...defaultParams, {
          dirty: false,
          pristine: true
        }).meta.dirty
      ).toBe(false)
      expect(
        createFieldArrayProps(...defaultParams, {
          dirty: false,
          pristine: true
        }).meta.pristine
      ).toBe(true)
      expect(
        createFieldArrayProps(...defaultParams, {
          dirty: true,
          pristine: false
        }).meta.dirty
      ).toBe(true)
      expect(
        createFieldArrayProps(...defaultParams, {
          dirty: true,
          pristine: false
        }).meta.pristine
      ).toBe(false)
    })

    it('should provide length', () => {
      expect(
        createFieldArrayProps(...defaultParams, {
          value: fromJS([]),
          length: 0
        }).fields.length
      ).toBe(0)
      expect(
        createFieldArrayProps(...defaultParams, {
          value: fromJS(['a']),
          length: 1
        }).fields.length
      ).toBe(1)
      expect(
        createFieldArrayProps(...defaultParams, {
          value: fromJS(['a', 'b']),
          length: 2
        }).fields.length
      ).toBe(2)
      expect(
        createFieldArrayProps(...defaultParams, {
          value: fromJS(['a', 'b', 'c']),
          length: 3
        }).fields.length
      ).toBe(3)
    })

    it('should provide errors', () => {
      expect(
        createFieldArrayProps(...defaultParams, { syncError: 'Sync Error' })
          .meta.error
      ).toBe('Sync Error')
      expect(
        createFieldArrayProps(...defaultParams, { syncError: 'Sync Error' })
          .meta.valid
      ).toBe(false)
      expect(
        createFieldArrayProps(...defaultParams, { syncError: 'Sync Error' })
          .meta.invalid
      ).toBe(true)
      expect(
        createFieldArrayProps(...defaultParams, { syncWarning: 'Sync Warning' })
          .meta.warning
      ).toBe('Sync Warning')
      expect(
        createFieldArrayProps(...defaultParams, {
          asyncError: 'Async Error'
        }).meta.error
      ).toBe('Async Error')
      expect(
        createFieldArrayProps(...defaultParams, {
          asyncError: 'Async Error'
        }).meta.valid
      ).toBe(false)
      expect(
        createFieldArrayProps(...defaultParams, {
          asyncError: 'Async Error'
        }).meta.invalid
      ).toBe(true)
      expect(
        createFieldArrayProps(...defaultParams, {
          submitError: 'Submit Error'
        }).meta.error
      ).toBe('Submit Error')
      expect(
        createFieldArrayProps(...defaultParams, {
          submitError: 'Submit Error'
        }).meta.valid
      ).toBe(false)
      expect(
        createFieldArrayProps(...defaultParams, {
          submitError: 'Submit Error'
        }).meta.invalid
      ).toBe(true)
    })

    it('should provide move', () => {
      const arrayMove = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b', 'c']),
        arrayMove
      })
      expect(typeof result.fields.move).toBe('function')
      expect(arrayMove).not.toHaveBeenCalled()
      expect(result.fields.move(0, 2)).toBeFalsy()
      expect(arrayMove).toHaveBeenCalledWith(0, 2)
    })

    it('should provide push', () => {
      const arrayPush = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b']),
        arrayPush
      })
      expect(typeof result.fields.push).toBe('function')
      expect(arrayPush).not.toHaveBeenCalled()
      expect(result.fields.push('c')).toBeFalsy()
      expect(arrayPush).toHaveBeenCalledWith('c')
    })

    it('should provide pop', () => {
      const arrayPop = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b', 'c']),
        length: 3,
        arrayPop
      })
      expect(typeof result.fields.pop).toBe('function')
      expect(arrayPop).not.toHaveBeenCalled()
      expect(result.fields.pop()).toBe('c')
      expect(arrayPop).toHaveBeenCalledWith()
    })

    it('should provide insert', () => {
      const arrayInsert = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b']),
        arrayInsert
      })
      expect(typeof result.fields.insert).toBe('function')
      expect(arrayInsert).not.toHaveBeenCalled()
      expect(result.fields.insert(1, 'c')).toBeFalsy()
      expect(arrayInsert).toHaveBeenCalledWith(1, 'c')
    })

    it('should provide remove', () => {
      const arrayRemove = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b']),
        arrayRemove
      })
      expect(typeof result.fields.remove).toBe('function')
      expect(arrayRemove).not.toHaveBeenCalled()
      expect(result.fields.remove(2)).toBeFalsy()
      expect(arrayRemove).toHaveBeenCalledWith(2)
    })

    it('should provide removeAll', () => {
      const arrayRemoveAll = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b']),
        arrayRemoveAll
      })
      expect(typeof result.fields.removeAll).toBe('function')
      expect(arrayRemoveAll).not.toHaveBeenCalled()
      expect(result.fields.removeAll()).toBeFalsy()
      expect(arrayRemoveAll).toHaveBeenCalledWith()
    })

    it('should provide unshift', () => {
      const arrayUnshift = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b']),
        arrayUnshift
      })
      expect(typeof result.fields.unshift).toBe('function')
      expect(arrayUnshift).not.toHaveBeenCalled()
      expect(result.fields.unshift('c')).toBeFalsy()
      expect(arrayUnshift).toHaveBeenCalledWith('c')
    })

    it('should provide shift', () => {
      const arrayShift = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b', 'c']),
        arrayShift
      })
      expect(typeof result.fields.shift).toBe('function')
      expect(arrayShift).not.toHaveBeenCalled()
      expect(result.fields.shift()).toBe('a')
      expect(arrayShift).toHaveBeenCalledWith()
    })

    it('should provide forEach', () => {
      const callback = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b', 'c'])
      })
      expect(typeof result.fields.forEach).toBe('function')
      expect(callback).not.toHaveBeenCalled()
      result.fields.forEach(callback)
      expect(callback).toHaveBeenCalled()
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback.mock.calls[0]).toEqual(['foo[0]', 0, result.fields])
      expect(callback.mock.calls[1]).toEqual(['foo[1]', 1, result.fields])
      expect(callback.mock.calls[2]).toEqual(['foo[2]', 2, result.fields])
    })

    it('should provide get that uses passed in getValue', () => {
      const value = fromJS(['a', 'b', 'c'])
      const getValue = index => value && getIn(value, index) + 'DOG'
      const result = createFieldArrayProps(
        getIn,
        'foo',
        'testForm',
        undefined,
        getValue,
        { value }
      )
      expect(typeof result.fields.get).toBe('function')
      expect(result.fields.get(0)).toBe('aDOG')
      expect(result.fields.get(1)).toBe('bDOG')
      expect(result.fields.get(2)).toBe('cDOG')
    })

    it('should provide getAll', () => {
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b', 'c'])
      })
      expect(typeof result.fields.getAll).toBe('function')
      expect(result.fields.getAll()).toEqualMap(['a', 'b', 'c'])
    })

    it('should provide map', () => {
      const callback = jest.fn(name => ({
        whatever: true,
        name
      }))
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b', 'c']),
        length: 3
      })
      expect(typeof result.fields.map).toBe('function')
      expect(callback).not.toHaveBeenCalled()
      const mapResult = result.fields.map(callback)
      expect(getIn(mapResult, 0)).toEqual({ whatever: true, name: 'foo[0]' })
      expect(getIn(mapResult, 1)).toEqual({ whatever: true, name: 'foo[1]' })
      expect(getIn(mapResult, 2)).toEqual({ whatever: true, name: 'foo[2]' })
      expect(callback).toHaveBeenCalled()
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback.mock.calls[0]).toEqual(['foo[0]', 0, result.fields])
      expect(callback.mock.calls[1]).toEqual(['foo[1]', 1, result.fields])
      expect(callback.mock.calls[2]).toEqual(['foo[2]', 2, result.fields])
    })

    it('should provide reduce', () => {
      const callback = jest.fn((accumulator, name) => ({
        ...accumulator,
        [name]: { whatever: true, name }
      }))
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b', 'c']),
        length: 3
      })
      expect(typeof result.fields.reduce).toBe('function')
      expect(callback).not.toHaveBeenCalled()
      const reduceResult = result.fields.reduce(callback, {})
      expect(reduceResult['foo[0]']).toEqual({ whatever: true, name: 'foo[0]' })
      expect(reduceResult['foo[1]']).toEqual({ whatever: true, name: 'foo[1]' })
      expect(reduceResult['foo[2]']).toEqual({ whatever: true, name: 'foo[2]' })
      expect(callback).toHaveBeenCalled()
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback.mock.calls[0]).toEqual([{}, 'foo[0]', 0, result.fields])
      expect(callback.mock.calls[1]).toEqual([
        {
          'foo[0]': { whatever: true, name: 'foo[0]' }
        },
        'foo[1]',
        1,
        result.fields
      ])
      expect(callback.mock.calls[2]).toEqual([
        {
          'foo[0]': { whatever: true, name: 'foo[0]' },
          'foo[1]': { whatever: true, name: 'foo[1]' }
        },
        'foo[2]',
        2,
        result.fields
      ])
    })

    it('should provide reduce when no value', () => {
      const callback = jest.fn((accumulator, name) => ({
        ...accumulator,
        [name]: { whatever: true, name }
      }))
      const result = createFieldArrayProps(...defaultParams, {})
      expect(typeof result.fields.reduce).toBe('function')
      expect(callback).not.toHaveBeenCalled()
      result.fields.reduce(callback, {})
      expect(callback).not.toHaveBeenCalled()
    })

    it('should provide swap', () => {
      const arraySwap = jest.fn()
      const result = createFieldArrayProps(...defaultParams, {
        arraySwap,
        value: fromJS(['a', 'b', 'c'])
      })
      expect(typeof result.fields.swap).toBe('function')
      expect(arraySwap).not.toHaveBeenCalled()
      expect(result.fields.swap(0, 2)).toBeFalsy()
      expect(arraySwap).toHaveBeenCalledWith(0, 2)
    })

    it('should provide a _isFieldArray meta prop', () => {
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b', 'c'])
      })
      expect(result.fields._isFieldArray).toBe(true)
    })

    it('should pass name through to the fields prop', () => {
      const result = createFieldArrayProps(...defaultParams, {
        value: fromJS(['a', 'b', 'c'])
      })
      expect(result.fields.name).toBe('foo')
    })
  })
}

describeCreateFieldProps('createFieldArrayProps.plain', plain, () =>
  expect.extend(plainExpectations)
)
describeCreateFieldProps('createFieldArrayProps.immutable', immutable, () =>
  expect.extend(immutableExpectations)
)
