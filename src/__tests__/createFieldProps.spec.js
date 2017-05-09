import {createSpy} from 'expect'
import createFieldProps from '../createFieldProps'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'
import tmp from 'tmp'

const describeCreateFieldProps = (name, structure, expect) => {
  const {empty, getIn, fromJS, toJS} = structure

  describe(name, () => {
    it('should pass value through', () => {
      expect(
        createFieldProps({getIn, toJS}, 'foo', {value: 'hello'}).input.value
      ).toBe('hello')
    })

    it('should pass dirty/pristine through', () => {
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          dirty: false,
          pristine: true
        }).meta.dirty
      ).toBe(false)
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          dirty: false,
          pristine: true
        }).meta.pristine
      ).toBe(true)
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          dirty: true,
          pristine: false
        }).meta.dirty
      ).toBe(true)
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          dirty: true,
          pristine: false
        }).meta.pristine
      ).toBe(false)
    })

    it('should pass initial value through', () => {
      expect(
        createFieldProps({getIn, toJS}, 'foo', {initial: 'hello'}).meta.initial
      ).toBe('hello')
    })

    it('should provide onBlur', () => {
      const onBlur = createSpy()
      expect(onBlur).toNotHaveBeenCalled()
      const result = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        onBlur
      })
      expect(result.input.onBlur).toBeA('function')
      expect(onBlur).toNotHaveBeenCalled()
      result.input.onBlur('rabbit')
      expect(onBlur).toHaveBeenCalled().toHaveBeenCalledWith('rabbit')
    })

    it('should provide onChange', () => {
      const onChange = createSpy()
      expect(onChange).toNotHaveBeenCalled()
      const result = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        onChange
      })
      expect(result.input.onChange).toBeA('function')
      expect(onChange).toNotHaveBeenCalled()
      result.input.onChange('rabbit')
      expect(onChange).toHaveBeenCalled().toHaveBeenCalledWith('rabbit')
    })

    it('should provide onFocus', () => {
      const onFocus = createSpy()
      expect(onFocus).toNotHaveBeenCalled()
      const result = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        onFocus
      })
      expect(result.input.onFocus).toBeA('function')
      expect(onFocus).toNotHaveBeenCalled()
      result.input.onFocus('rabbit')
      expect(onFocus).toHaveBeenCalled()
    })

    it('should provide onDragStart', () => {
      const onDragStart = createSpy()
      const result = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        onDragStart
      })
      expect(result.input.onDragStart).toBeA('function')
    })

    it('should provide onDrop', () => {
      const onDrop = createSpy()
      const result = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        onDrop
      })
      expect(result.input.onDrop).toBeA('function')
    })

    it('should read active from state', () => {
      const inactiveResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(inactiveResult.meta.active).toBe(false)
      const activeResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: fromJS({
          active: true
        })
      })
      expect(activeResult.meta.active).toBe(true)
    })

    it('should pass along submitting flag', () => {
      const notSubmittingResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar'
      })
      expect(notSubmittingResult.meta.submitting).toBe(false)
      const submittingResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        submitting: true
      })
      expect(submittingResult.meta.submitting).toBe(true)
    })

    it('should pass along submitFailed flag', () => {
      const notFailedResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar'
      })
      expect(notFailedResult.meta.submitFailed).toBe(false)
      const failedResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        submitFailed: true
      })
      expect(failedResult.meta.submitFailed).toBe(true)
    })

    it('should pass along all custom state props', () => {
      const pristineResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar'
      })
      expect(pristineResult.meta.customProp).toBe(undefined)
      const customResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: fromJS({
          customProp: 'my-custom-prop'
        })
      })
      expect(customResult.meta.customProp).toBe('my-custom-prop')
    })

    it('should not override canonical props with custom props', () => {
      const pristineResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar'
      })
      expect(pristineResult.meta.customProp).toBe(undefined)
      const customResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        submitting: true,
        state: fromJS({
          submitting: false
        })
      })
      expect(customResult.meta.submitting).toBe(true)
    })

    it('should read touched from state', () => {
      const untouchedResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(untouchedResult.meta.touched).toBe(false)
      const touchedResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: fromJS({
          touched: true
        })
      })
      expect(touchedResult.meta.touched).toBe(true)
    })

    it('should read visited from state', () => {
      const notVisitedResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(notVisitedResult.meta.visited).toBe(false)
      const visitedResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: fromJS({
          visited: true
        })
      })
      expect(visitedResult.meta.visited).toBe(true)
    })

    it('should read sync errors from prop', () => {
      const noErrorResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(noErrorResult.meta.error).toNotExist()
      expect(noErrorResult.meta.valid).toBe(true)
      expect(noErrorResult.meta.invalid).toBe(false)
      const errorResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty,
        syncError: 'This is an error'
      })
      expect(errorResult.meta.error).toBe('This is an error')
      expect(errorResult.meta.valid).toBe(false)
      expect(errorResult.meta.invalid).toBe(true)
    })

    it('should read sync warnings from prop', () => {
      const noWarningResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(noWarningResult.meta.warning).toNotExist()
      const warningResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty,
        syncWarning: 'This is an warning'
      })
      expect(warningResult.meta.warning).toBe('This is an warning')
    })

    it('should read async errors from state', () => {
      const noErrorResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(noErrorResult.meta.error).toNotExist()
      expect(noErrorResult.meta.valid).toBe(true)
      expect(noErrorResult.meta.invalid).toBe(false)
      const errorResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty,
        syncError: 'This is an error'
      })
      expect(errorResult.meta.error).toBe('This is an error')
      expect(errorResult.meta.valid).toBe(false)
      expect(errorResult.meta.invalid).toBe(true)
    })

    it('should read submit errors from state', () => {
      const noErrorResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(noErrorResult.meta.error).toNotExist()
      expect(noErrorResult.meta.valid).toBe(true)
      expect(noErrorResult.meta.invalid).toBe(false)
      const errorResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty,
        submitError: 'This is an error'
      })
      expect(errorResult.meta.error).toBe('This is an error')
      expect(errorResult.meta.valid).toBe(false)
      expect(errorResult.meta.invalid).toBe(true)
    })

    it('should prioritize sync errors over async or submit errors', () => {
      const noErrorResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty
      })
      expect(noErrorResult.meta.error).toNotExist()
      expect(noErrorResult.meta.valid).toBe(true)
      expect(noErrorResult.meta.invalid).toBe(false)
      const errorResult = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        asyncError: 'async error',
        submitError: 'submit error',
        syncError: 'sync error'
      })
      expect(errorResult.meta.error).toBe('sync error')
      expect(errorResult.meta.valid).toBe(false)
      expect(errorResult.meta.invalid).toBe(true)
    })

    it('should pass through other props', () => {
      const result = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty,
        someOtherProp: 'dog',
        className: 'my-class'
      })
      expect(result.initial).toNotExist()
      expect(result.state).toNotExist()
      expect(result.custom.someOtherProp).toBe('dog')
      expect(result.custom.className).toBe('my-class')
    })

    it('should pass through other props using props prop', () => {
      const result = createFieldProps({getIn, toJS}, 'foo', {
        value: 'bar',
        state: empty,
        props: {
          someOtherProp: 'dog',
          className: 'my-class'
        }
      })
      expect(result.initial).toNotExist()
      expect(result.state).toNotExist()
      expect(result.custom.someOtherProp).toBe('dog')
      expect(result.custom.className).toBe('my-class')
    })

    it('should set checked for checkboxes', () => {
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          state: empty,
          type: 'checkbox'
        }).input.checked
      ).toBe(false)
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          value: true,
          state: empty,
          type: 'checkbox'
        }).input.checked
      ).toBe(true)
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          value: false,
          state: empty,
          type: 'checkbox'
        }).input.checked
      ).toBe(false)
    })

    it('should set checked for radio buttons', () => {
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          state: empty,
          type: 'radio',
          _value: 'bar'
        }).input.checked
      ).toBe(false)
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          value: 'bar',
          state: empty,
          type: 'radio',
          _value: 'bar'
        }).input.checked
      ).toBe(true)
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          value: 'baz',
          state: empty,
          type: 'radio',
          _value: 'bar'
        }).input.checked
      ).toBe(false)
    })

    it('should default value to [] for multi-selects', () => {
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          state: empty,
          type: 'select-multiple'
        }).input.value
      )
        .toBeA('array')
        .toEqual([])
    })

    it('should default value to undefined for file inputs', () => {
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          state: empty,
          type: 'file'
        }).input.value
      ).toEqual(undefined)
    })

    it('should update value to selected file for file inputs', () => {
      let tmpFile = tmp.fileSync()
      expect(
        createFieldProps({getIn, toJS}, 'foo', {
          value: [tmpFile],
          state: empty,
          type: 'file'
        }).input.value
      ).toEqual([tmpFile])
    })

    it('should replace undefined value with empty string', () => {
      const result = createFieldProps({getIn, toJS}, 'foo', {
        state: empty
      })
      expect(result.input.value).toBe('')
    })

    it('should not format value when format prop is null', () => {
      const result = createFieldProps({getIn, toJS}, 'foo', {
        state: empty,
        value: null,
        format: null
      })
      expect(result.input.value).toBe(null)
    })
  })
}

describeCreateFieldProps(
  'createFieldProps.plain',
  plain,
  addExpectations(plainExpectations)
)
describeCreateFieldProps(
  'createFieldProps.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
