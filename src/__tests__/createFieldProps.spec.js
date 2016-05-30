import { createSpy } from 'expect'
import createFieldProps from '../createFieldProps'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeCreateFieldProps = (name, structure, expect) => {
  const { empty, getIn, fromJS } = structure

  describe(name, () => {
    it('should pass value through', () => {
      expect(createFieldProps(getIn, 'foo', { value: 'hello' }).value).toBe('hello')
    })

    it('should pass dirty/pristine through', () => {
      expect(createFieldProps(getIn, 'foo', { dirty: false, pristine: true }).dirty).toBe(false)
      expect(createFieldProps(getIn, 'foo', { dirty: false, pristine: true }).pristine).toBe(true)
      expect(createFieldProps(getIn, 'foo', { dirty: true, pristine: false }).dirty).toBe(true)
      expect(createFieldProps(getIn, 'foo', { dirty: true, pristine: false }).pristine).toBe(false)
    })

    it('should provide onBlur', () => {
      const blur = createSpy()
      expect(blur).toNotHaveBeenCalled()
      const result = createFieldProps(getIn, 'foo', { value: 'bar', blur })
      expect(result.onBlur).toBeA('function')
      expect(blur).toNotHaveBeenCalled()
      result.onBlur('rabbit')
      expect(blur)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith('rabbit')
    })

    it('should provide onChange', () => {
      const change = createSpy()
      expect(change).toNotHaveBeenCalled()
      const result = createFieldProps(getIn, 'foo', { value: 'bar', change })
      expect(result.onChange).toBeA('function')
      expect(change).toNotHaveBeenCalled()
      result.onChange('rabbit')
      expect(change)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith('rabbit')
    })

    it('should provide onUpdate alias for onChange', () => {
      const result = createFieldProps(getIn, 'foo', { value: 'bar' })
      expect(result.onUpdate).toBe(result.onChange)
    })

    it('should provide onFocus', () => {
      const focus = createSpy()
      expect(focus).toNotHaveBeenCalled()
      const result = createFieldProps(getIn, 'foo', { value: 'bar', focus })
      expect(result.onFocus).toBeA('function')
      expect(focus).toNotHaveBeenCalled()
      result.onFocus('rabbit')
      expect(focus)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith('foo')
    })

    it('should provide onDragStart', () => {
      const result = createFieldProps(getIn, 'foo', { value: 'bar' })
      expect(result.onDragStart).toBeA('function')
    })

    it('should provide onDrop', () => {
      const result = createFieldProps(getIn, 'foo', { value: 'bar' })
      expect(result.onDrop).toBeA('function')
    })

    it('should read active from state', () => {
      const inactiveResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(inactiveResult.active).toBe(false)
      const activeResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: fromJS({
          active: true
        })
      })
      expect(activeResult.active).toBe(true)
    })

    it('should read touched from state', () => {
      const untouchedResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(untouchedResult.touched).toBe(false)
      const touchedResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: fromJS({
          touched: true
        })
      })
      expect(touchedResult.touched).toBe(true)
    })

    it('should read visited from state', () => {
      const notVisitedResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(notVisitedResult.visited).toBe(false)
      const visitedResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: fromJS({
          visited: true
        })
      })
      expect(visitedResult.visited).toBe(true)
    })

    it('should read sync errors from param', () => {
      const noErrorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(noErrorResult.error).toNotExist()
      expect(noErrorResult.valid).toBe(true)
      expect(noErrorResult.invalid).toBe(false)
      const errorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      }, 'This is an error')
      expect(errorResult.error).toBe('This is an error')
      expect(errorResult.valid).toBe(false)
      expect(errorResult.invalid).toBe(true)
    })

    it('should read async errors from state', () => {
      const noErrorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(noErrorResult.error).toNotExist()
      expect(noErrorResult.valid).toBe(true)
      expect(noErrorResult.invalid).toBe(false)
      const errorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      }, 'This is an error')
      expect(errorResult.error).toBe('This is an error')
      expect(errorResult.valid).toBe(false)
      expect(errorResult.invalid).toBe(true)
    })

    it('should read submit errors from state', () => {
      const noErrorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(noErrorResult.error).toNotExist()
      expect(noErrorResult.valid).toBe(true)
      expect(noErrorResult.invalid).toBe(false)
      const errorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        submitError: 'This is an error'
      })
      expect(errorResult.error).toBe('This is an error')
      expect(errorResult.valid).toBe(false)
      expect(errorResult.invalid).toBe(true)
    })

    it('should prioritize sync errors over async or submit errors', () => {
      const noErrorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(noErrorResult.error).toNotExist()
      expect(noErrorResult.valid).toBe(true)
      expect(noErrorResult.invalid).toBe(false)
      const errorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        asyncError: 'async error',
        submitError: 'submit error'
      }, 'sync error')
      expect(errorResult.error).toBe('sync error')
      expect(errorResult.valid).toBe(false)
      expect(errorResult.invalid).toBe(true)
    })

    it('should pass through other props', () => {
      const result = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        someOtherProp: 'dog',
        className: 'my-class'
      })
      expect(result.initial).toNotExist()
      expect(result.state).toNotExist()
      expect(result.someOtherProp).toBe('dog')
      expect(result.className).toBe('my-class')
    })

    it('should pass through other props using props prop', () => {
      const result = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        props: {
          someOtherProp: 'dog',
          className: 'my-class'
        }
      })
      expect(result.initial).toNotExist()
      expect(result.state).toNotExist()
      expect(result.someOtherProp).toBe('dog')
      expect(result.className).toBe('my-class')
    })

    it('should set checked for checkboxes', () => {
      expect(createFieldProps(getIn, 'foo', {
        state: empty,
        type: 'checkbox'
      }).checked).toBe(false)
      expect(createFieldProps(getIn, 'foo', {
        value: true,
        state: empty,
        type: 'checkbox'
      }).checked).toBe(true)
      expect(createFieldProps(getIn, 'foo', {
        value: false,
        state: empty,
        type: 'checkbox'
      }).checked).toBe(false)
    })

    it('should set checked for radio buttons', () => {
      expect(createFieldProps(getIn, 'foo', {
        state: empty,
        type: 'radio',
        _value: 'bar'
      }).checked).toBe(false)
      expect(createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        type: 'radio',
        _value: 'bar'
      }).checked).toBe(true)
      expect(createFieldProps(getIn, 'foo', {
        value: 'baz',
        state: empty,
        type: 'radio',
        _value: 'bar'
      }).checked).toBe(false)
    })

    it('should default value to [] for multi-selects', () => {
      expect(createFieldProps(getIn, 'foo', {
        state: empty,
        type: 'select-multiple'
      }).value)
        .toBeA('array')
        .toEqual([])
    })

    it('should replace undefined value with empty string', () => {
      const result = createFieldProps(getIn, 'foo', {
        state: empty
      })
      expect(result.value).toBe('')
    })

    it('should replace undefined value with default value provided', () => {
      const defaultValue = {
        foo: 'some complex value'
      }
      const result = createFieldProps(getIn, 'foo', {
        state: empty
      }, undefined, defaultValue)
      expect(result.value).toBe(defaultValue)
    })
  })
}

describeCreateFieldProps('createFieldProps.plain', plain, addExpectations(plainExpectations))
describeCreateFieldProps('createFieldProps.immutable', immutable, addExpectations(immutableExpectations))
