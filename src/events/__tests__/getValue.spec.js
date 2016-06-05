import expect from 'expect'
import { noop } from 'lodash'
import getValue from '../getValue'

describe('getValue', () => {
  it('should return value if non-event value is passed', () => {
    expect(getValue(undefined, true)).toBe(undefined)
    expect(getValue(undefined, false)).toBe(undefined)
    expect(getValue(null, true)).toBe(null)
    expect(getValue(null, false)).toBe(null)
    expect(getValue(5, true)).toBe(5)
    expect(getValue(5, false)).toBe(5)
    expect(getValue(true, true)).toBe(true)
    expect(getValue(true, false)).toBe(true)
    expect(getValue(false, true)).toBe(false)
    expect(getValue(false, false)).toBe(false)
    expect(getValue('dog', true)).toBe('dog')
    expect(getValue('dog', false)).toBe('dog')
  })

  it('should unwrap value if non-event object containing value key is passed', () => {
    expect(getValue({ value: 5 }, true)).toBe(5)
    expect(getValue({ value: 5 }, false)).toBe(5)
    expect(getValue({ value: true }, true)).toBe(true)
    expect(getValue({ value: true }, false)).toBe(true)
    expect(getValue({ value: false }, true)).toBe(false)
    expect(getValue({ value: false }, false)).toBe(false)
  })

  it('should return value if object NOT containing value key is passed', () => {
    const foo = { bar: 5, baz: 8 }
    expect(getValue(foo)).toBe(foo)
  })

  it('should return event.nativeEvent.text if defined and not react-native', () => {
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      nativeEvent: {
        text: 'foo'
      }
    }, false)).toBe('foo')
  })

  it('should return event.nativeEvent.text if react-native', () => {
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      nativeEvent: {
        text: 'foo'
      }
    }, true)).toBe('foo')
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      nativeEvent: {
        text: undefined
      }
    }, true)).toBe(undefined)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      nativeEvent: {
        text: null
      }
    }, true)).toBe(null)
  })

  it('should return event.target.checked if checkbox', () => {
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'checkbox',
        checked: true
      }
    }, true)).toBe(true)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'checkbox',
        checked: true
      }
    }, false)).toBe(true)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'checkbox',
        checked: false
      }
    }, true)).toBe(false)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'checkbox',
        checked: false
      }
    }, false)).toBe(false)
  })

  it('should return a number type for numeric inputs', () => {
    expect(getValue({
      preventDefault: () => null,
      stopPropagation: () => null,
      target: {
        type: 'number',
        value: '3.1415'
      }
    }, true)).toBe(3.1415);
    expect(getValue({
      preventDefault: () => null,
      stopPropagation: () => null,
      target: {
        type: 'range',
        value: '2.71828'
      }
    }, true)).toBe(2.71828);
    expect(getValue({
      preventDefault: () => null,
      stopPropagation: () => null,
      target: {
        type: 'number',
        value: '3'
      }
    }, false)).toBe(3);
    expect(getValue({
      preventDefault: () => null,
      stopPropagation: () => null,
      target: {
        type: 'range',
        value: '3.1415'
      }
    }, false)).toBe(3.1415);
  });
  
  it('should return event.target.files if file', () => {
    const myFiles = [ 'foo', 'bar' ]
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'file',
        files: myFiles
      }
    }, true)).toBe(myFiles)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'file',
        files: myFiles
      }
    }, false)).toBe(myFiles)
  })

  it('should return event.dataTransfer.files if file and files not in target.files', () => {
    const myFiles = [ 'foo', 'bar' ]
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'file'
      },
      dataTransfer: {
        files: myFiles
      }
    }, true)).toBe(myFiles)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'file'
      },
      dataTransfer: {
        files: myFiles
      }
    }, false)).toBe(myFiles)
  })

  it('should return selected options if is a multiselect', () => {
    const options = [
      { selected: true, value: 'foo' },
      { selected: true, value: 'bar' },
      { selected: false, value: 'baz' }
    ]
    const expected = options.filter(option => option.selected).map(option => option.value)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'select-multiple',
        options
      }
    }, true)).toEqual(expected)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'select-multiple'
      }
    }, false)).toEqual([])  // no options specified
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        type: 'select-multiple',
        options
      }
    }, false)).toEqual(expected)
  })

  it('should return event.target.value if not file or checkbox', () => {
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: undefined
      }
    }, true)).toBe(undefined)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: undefined
      }
    }, false)).toBe(undefined)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: null
      }
    }, true)).toBe(null)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: null
      }
    }, false)).toBe(null)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: true
      }
    }, true)).toBe(true)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: true
      }
    }, false)).toBe(true)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: false
      }
    }, true)).toBe(false)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: false
      }
    }, false)).toBe(false)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: 42
      }
    }, true)).toBe(42)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: 42
      }
    }, false)).toBe(42)
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: 'foo'
      }
    }, true)).toBe('foo')
    expect(getValue({
      preventDefault: noop,
      stopPropagation: noop,
      target: {
        value: 'foo'
      }
    }, false)).toBe('foo')
  })

})
