import createReducer from '../reducer'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'
import describeInitialize from './reducer.initialize.spec'
import describeBlur from './reducer.blur.spec'
import describeChange from './reducer.change.spec'
import describeFocus from './reducer.focus.spec'
import describeTouch from './reducer.touch.spec'
import describeUntouch from './reducer.untouch.spec'
import describeReset from './reducer.reset.spec'
import describeSyncErrors from './reducer.syncErrors.spec'
import describeStartSubmit from './reducer.startSubmit.spec'
import describeStopSubmit from './reducer.stopSubmit.spec'
import describeSubmitFailed from './reducer.submitFailed.spec'
import describeStartAsyncValidation from './reducer.startAsyncValidation.spec'
import describeStopAsyncValidation from './reducer.stopAsyncValidation.spec'

const tests = {
  initialize: describeInitialize,
  blur: describeBlur,
  change: describeChange,
  focus: describeFocus,
  reset: describeReset,
  touch: describeTouch,
  untouch: describeUntouch,
  syncErrors: describeSyncErrors,
  startSubmit: describeStartSubmit,
  stopSubmit: describeStopSubmit,
  submitFailed: describeSubmitFailed,
  startAsyncValidation: describeStartAsyncValidation,
  stopAsyncValidation: describeStopAsyncValidation
}

const describeReducer = (name, structure, expect) => {
  const reducer = createReducer(structure)

  describe(name, () => {
    it('should initialize state to {}', () => {
      const state = reducer()
      expect(state)
        .toExist()
        .toBeAMap()
        .toBeSize(0)
    })

    it('should not modify state when action has no form', () => {
      const state = { foo: 'bar' }
      expect(reducer(state, { type: 'SOMETHING_ELSE' })).toBe(state)
    })

    it('should initialize form state when action has form', () => {
      const state = reducer(undefined, { form: 'foo' })
      expect(state)
        .toExist()
        .toBeAMap()
        .toBeSize(1)
        .toEqualMap({
          foo: {}
        })
    })

    Object.keys(tests).forEach(key =>
      describe(`${name}.${key}`, tests[ key ](reducer, expect, structure)))

    //
    //it('should add an empty array value with empty state', () => {
    //  const state = reducer(undefined, {
    //    ...addArrayValue('myField'),
    //    form: 'foo'
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myField: [
    //        {
    //          value: undefined
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myField)).toBe(false)
    //  expect(isFieldValue(state.foo.myField[0])).toBe(true)
    //})
    //
    //it('should add an empty deep array value with empty state', () => {
    //  const state = reducer({}, {
    //    ...addArrayValue('myField.myArray'),
    //    form: 'foo'
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myField: {
    //        myArray: [
    //          {
    //            value: undefined
    //          }
    //        ]
    //      },
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myField)).toBe(false)
    //  expect(isFieldValue(state.foo.myField.myArray)).toBe(false)
    //  expect(isFieldValue(state.foo.myField.myArray[0])).toBe(true)
    //})
    //
    //it('should add a deep array value with initial value', () => {
    //  const state = reducer({}, {
    //    ...addArrayValue('myField.myArray', 20, undefined),
    //    form: 'foo'
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myField: {
    //        myArray: [
    //          {
    //            value: 20
    //          }
    //        ]
    //      },
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myField)).toBe(false)
    //  expect(isFieldValue(state.foo.myField.myArray)).toBe(false)
    //  expect(isFieldValue(state.foo.myField.myArray[0])).toBe(true)
    //})
    //
    //it('should push an array value', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        makeFieldValue({
    //          value: 'foo'
    //        }),
    //        makeFieldValue({
    //          value: 'bar'
    //        })
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...addArrayValue('myField', 'baz'),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          value: 'foo'
    //        },
    //        {
    //          value: 'bar'
    //        },
    //        {
    //          value: 'baz'
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[2])).toBe(true)
    //})
    //
    //it('should insert an array value', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        makeFieldValue({
    //          value: 'foo'
    //        }),
    //        makeFieldValue({
    //          value: 'bar'
    //        })
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...addArrayValue('myField', 'baz', 1),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          value: 'foo'
    //        },
    //        {
    //          value: 'baz'
    //        },
    //        {
    //          value: 'bar'
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[2])).toBe(true)
    //})
    //
    //// TODO: Find a way to make this pass:
    ///*
    // it('should push an array value which is a deep object', () => {
    // const state = reducer({
    // testForm: {
    // friends: [
    // {
    // name: {
    // initial: 'name-1',
    // value: 'name-1'
    // },
    // address: {
    // street: {
    // initial: 'street-1',
    // value: 'street-1'
    // },
    // postalCode: {
    // initial: 'postalCode-1',
    // value: 'postalCode-1'
    // }
    // }
    // },
    // {
    // name: {
    // initial: 'name-2',
    // value: 'name-2'
    // },
    // address: {
    // street: {
    // initial: 'street-2',
    // value: 'street-2'
    // },
    // postalCode: {
    // initial: 'postalCode-2',
    // value: 'postalCode-2'
    // }
    // }
    // }
    // ],
    // _active: undefined,
    // _asyncValidating: false,
    // _error: undefined,
    // _initialized: false,
    // _submitting: false,
    // _submitFailed: false
    // }
    // }, {
    // ...addArrayValue('friends', {
    // name: 'name-3',
    // address: {
    // street: 'street-3',
    // postalCode: 'postalCode-3'
    // }
    // }, undefined),
    // form: 'testForm'
    // })
    // expect(state.testForm)
    // .toEqual({
    // friends: [
    // {
    // name: {
    // initial: 'name-1',
    // value: 'name-1'
    // },
    // address: {
    // street: {
    // initial: 'street-1',
    // value: 'street-1'
    // },
    // postalCode: {
    // initial: 'postalCode-1',
    // value: 'postalCode-1'
    // }
    // }
    // },
    // {
    // name: {
    // initial: 'name-2',
    // value: 'name-2'
    // },
    // address: {
    // street: {
    // initial: 'street-2',
    // value: 'street-2'
    // },
    // postalCode: {
    // initial: 'postalCode-2',
    // value: 'postalCode-2'
    // }
    // }
    // },
    // {
    // name: {
    // initial: 'name-3',
    // value: 'name-3'
    // },
    // address: {
    // street: {
    // initial: 'street-3',
    // value: 'street-3'
    // },
    // postalCode: {
    // initial: 'postalCode-3',
    // value: 'postalCode-3'
    // }
    // }
    // }
    // ],
    // _active: undefined,
    // _asyncValidating: false,
    // _error: undefined,
    // _initialized: false,
    // _submitting: false,
    // _submitFailed: false
    // })
    // })
    // */
    //
    //it('should push a deep array value which is a nested object', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        {
    //          foo: makeFieldValue({
    //            initial: { a: 'foo-a1', b: 'foo-b1' },
    //            value: { a: 'foo-a1', b: 'foo-b1' },
    //          }),
    //          bar: makeFieldValue({
    //            initial: { a: 'bar-a1', b: 'bar-b1' },
    //            value: { a: 'bar-a1', b: 'bar-b1' },
    //          })
    //        },
    //        {
    //          foo: makeFieldValue({
    //            initial: { a: 'foo-a2', b: 'foo-b2' },
    //            value: { a: 'foo-a2', b: 'foo-b2' },
    //          }),
    //          bar: makeFieldValue({
    //            initial: { a: 'bar-a2', b: 'bar-b2' },
    //            value: { a: 'bar-a2', b: 'bar-b2' },
    //          })
    //        },
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      _error: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...addArrayValue('myField', {
    //      foo: { a: 'foo-a3', b: 'foo-b3' },
    //      bar: { a: 'bar-a3', b: 'bar-b3' }
    //    }, undefined),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          foo: {
    //            initial: { a: 'foo-a1', b: 'foo-b1' },
    //            value: { a: 'foo-a1', b: 'foo-b1' },
    //          },
    //          bar: {
    //            initial: { a: 'bar-a1', b: 'bar-b1' },
    //            value: { a: 'bar-a1', b: 'bar-b1' },
    //          }
    //        },
    //        {
    //          foo: {
    //            initial: { a: 'foo-a2', b: 'foo-b2' },
    //            value: { a: 'foo-a2', b: 'foo-b2' },
    //          },
    //          bar: {
    //            initial: { a: 'bar-a2', b: 'bar-b2' },
    //            value: { a: 'bar-a2', b: 'bar-b2' },
    //          }
    //        },
    //        {
    //          foo: {
    //            initial: { a: 'foo-a3', b: 'foo-b3' },
    //            value: { a: 'foo-a3', b: 'foo-b3' },
    //          },
    //          bar: {
    //            initial: { a: 'bar-a3', b: 'bar-b3' },
    //            value: { a: 'bar-a3', b: 'bar-b3' },
    //          }
    //        },
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      _error: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0].foo)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[0].bar)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[1].foo)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1].bar)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[2])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[2].foo)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[2].bar)).toBe(true)
    //})
    //
    //it('should push a subarray value which is an object', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        {
    //          myField2: [
    //            {
    //              foo: makeFieldValue({
    //                initial: 'foo-1-1',
    //                value: 'foo-1-1'
    //              }),
    //              bar: makeFieldValue({
    //                initial: 'bar-1-1',
    //                value: 'bar-1-1'
    //              })
    //            },
    //            {
    //              foo: makeFieldValue({
    //                initial: 'foo-1-2',
    //                value: 'foo-1-2'
    //              }),
    //              bar: makeFieldValue({
    //                initial: 'bar-1-2',
    //                value: 'bar-1-2'
    //              })
    //            }
    //          ]
    //        },
    //        {
    //          myField2: [
    //            {
    //              foo: makeFieldValue({
    //                initial: 'foo-2-1',
    //                value: 'foo-2-1'
    //              }),
    //              bar: makeFieldValue({
    //                initial: 'bar-2-1',
    //                value: 'bar-2-1'
    //              })
    //            },
    //            {
    //              foo: makeFieldValue({
    //                initial: 'foo-2-2',
    //                value: 'foo-2-2'
    //              }),
    //              bar: makeFieldValue({
    //                initial: 'bar-2-2',
    //                value: 'bar-2-2'
    //              })
    //            }
    //          ]
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      _error: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...addArrayValue('myField[1].myField2', { foo: 'foo-2-3', bar: 'bar-2-3' }, undefined),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          myField2: [
    //            {
    //              foo: {
    //                initial: 'foo-1-1',
    //                value: 'foo-1-1'
    //              },
    //              bar: {
    //                initial: 'bar-1-1',
    //                value: 'bar-1-1'
    //              }
    //            },
    //            {
    //              foo: {
    //                initial: 'foo-1-2',
    //                value: 'foo-1-2'
    //              },
    //              bar: {
    //                initial: 'bar-1-2',
    //                value: 'bar-1-2'
    //              }
    //            },
    //          ],
    //        },
    //        {
    //          myField2: [
    //            {
    //              foo: {
    //                initial: 'foo-2-1',
    //                value: 'foo-2-1'
    //              },
    //              bar: {
    //                initial: 'bar-2-1',
    //                value: 'bar-2-1'
    //              }
    //            },
    //            {
    //              foo: {
    //                initial: 'foo-2-2',
    //                value: 'foo-2-2'
    //              },
    //              bar: {
    //                initial: 'bar-2-2',
    //                value: 'bar-2-2'
    //              }
    //            },
    //            {
    //              foo: {
    //                initial: 'foo-2-3',
    //                value: 'foo-2-3'
    //              },
    //              bar: {
    //                initial: 'bar-2-3',
    //                value: 'bar-2-3'
    //              }
    //            },
    //          ],
    //        },
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      _error: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0].myField2)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0].myField2[0])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0].myField2[0].foo)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[0].myField2[0].bar)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[0].myField2[1])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0].myField2[1].foo)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[0].myField2[1].bar)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[1].myField2)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[1].myField2[0])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[1].myField2[0].foo)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1].myField2[0].bar)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1].myField2[1])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[1].myField2[1].foo)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1].myField2[1].bar)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1].myField2[2])).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[1].myField2[2].foo)).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1].myField2[2].bar)).toBe(true)
    //})
    //
    //it('should set value on blur with empty state', () => {
    //  const state = reducer({}, {
    //    ...blur('myField', 'myValue'),
    //    form: 'foo'
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myField: {
    //        value: 'myValue'
    //      },
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myField)).toBe(true)
    //})
    //
    //it('should set value on blur and touch with empty state', () => {
    //  const state = reducer({}, {
    //    ...blur('myField', 'myValue'),
    //    form: 'foo',
    //    touch: true
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myField: {
    //        value: 'myValue',
    //        touched: true
    //      },
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myField)).toBe(true)
    //})
    //
    //it('should set value on blur and touch with initial value', () => {
    //  const state = reducer({
    //    foo: {
    //      myField: makeFieldValue({
    //        initial: 'initialValue',
    //        value: 'initialValue',
    //        touched: false
    //      }),
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...blur('myField', 'myValue'),
    //    form: 'foo',
    //    touch: true
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myField: {
    //        initial: 'initialValue',
    //        value: 'myValue',
    //        touched: true
    //      },
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myField)).toBe(true)
    //})
    //
    //it('should not modify value if undefined is passed on blur (for android react native)', () => {
    //  const state = reducer({
    //    foo: {
    //      myField: makeFieldValue({
    //        initial: 'initialValue',
    //        value: 'myValue',
    //        touched: false
    //      }),
    //      _active: 'myField',
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...blur('myField'),
    //    form: 'foo',
    //    touch: true
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myField: {
    //        initial: 'initialValue',
    //        value: 'myValue',
    //        touched: true
    //      },
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myField)).toBe(true)
    //})
    //
    //it('should not modify value if undefined is passed on blur, even if no value existed (for android react native)', () => {
    //  const state = reducer({
    //    foo: {
    //      myField: makeFieldValue({
    //        value: undefined
    //      }),
    //      _active: 'myField',
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...blur('myField'),
    //    form: 'foo',
    //    touch: true
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myField: {
    //        value: undefined,
    //        touched: true
    //      },
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myField)).toBe(true)
    //})
    //
    //it('should set nested value on blur', () => {
    //  const state = reducer({
    //    foo: {
    //      myField: {
    //        mySubField: makeFieldValue({
    //          value: undefined
    //        })
    //      },
    //      _active: 'myField',
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...blur('myField.mySubField', 'hello'),
    //    form: 'foo',
    //    touch: true
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myField: {
    //        mySubField: {
    //          value: 'hello',
    //          touched: true
    //        }
    //      },
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myField)).toBe(false)
    //  expect(isFieldValue(state.foo.myField.mySubField)).toBe(true)
    //})
    //
    //it('should set array value on blur', () => {
    //  const state = reducer({
    //    foo: {
    //      myArray: [
    //        makeFieldValue({ value: undefined })
    //      ],
    //      _active: 'myField',
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...blur('myArray[0]', 'hello'),
    //    form: 'foo',
    //    touch: true
    //  })
    //  expect(state.foo)
    //    .toEqual({
    //      myArray: [
    //        {
    //          value: 'hello',
    //          touched: true
    //        }
    //      ],
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.foo.myArray[0])).toBe(true)
    //})
    //

    //

    //
    //it('should pop an array value', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        makeFieldValue({
    //          value: 'foo'
    //        }),
    //        makeFieldValue({
    //          value: 'bar'
    //        })
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...removeArrayValue('myField'),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          value: 'foo'
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(true)
    //})
    //
    //it('should not change empty array value on remove', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...removeArrayValue('myField'),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //})
    //
    //it('should remove an array value from start of array', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        makeFieldValue({
    //          value: 'foo'
    //        }),
    //        makeFieldValue({
    //          value: 'bar'
    //        }),
    //        makeFieldValue({
    //          value: 'baz'
    //        })
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...removeArrayValue('myField', 0),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          value: 'bar'
    //        },
    //        {
    //          value: 'baz'
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1])).toBe(true)
    //})
    //
    //it('should remove an array value from middle of array', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        makeFieldValue({
    //          value: 'foo'
    //        }),
    //        makeFieldValue({
    //          value: 'bar'
    //        }),
    //        makeFieldValue({
    //          value: 'baz'
    //        })
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...removeArrayValue('myField', 1),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          value: 'foo'
    //        },
    //        {
    //          value: 'baz'
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1])).toBe(true)
    //})
    //
    //it('should not change empty array value on swap', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...swapArrayValues('myField'),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //})
    //
    //it('should should swap two array values at different indexes', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        makeFieldValue({
    //          value: 'foo'
    //        }),
    //        makeFieldValue({
    //          value: 'bar'
    //        }),
    //        makeFieldValue({
    //          value: 'baz'
    //        })
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...swapArrayValues('myField', 0, 2),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          value: 'baz'
    //        },
    //        {
    //          value: 'bar'
    //        },
    //        {
    //          value: 'foo'
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[2])).toBe(true)
    //
    //})
    //
    //it('should not change array on swap with the same index', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        makeFieldValue({
    //          value: 'foo'
    //        }),
    //        makeFieldValue({
    //          value: 'bar'
    //        }),
    //        makeFieldValue({
    //          value: 'baz'
    //        })
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...swapArrayValues('myField', 1, 1),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          value: 'foo'
    //        },
    //        {
    //          value: 'bar'
    //        },
    //        {
    //          value: 'baz'
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[2])).toBe(true)
    //
    //})
    //
    //it('should not change array on swap with out of bounds index', () => {
    //  const state = reducer({
    //    testForm: {
    //      myField: [
    //        makeFieldValue({
    //          value: 'foo'
    //        }),
    //        makeFieldValue({
    //          value: 'bar'
    //        }),
    //        makeFieldValue({
    //          value: 'baz'
    //        })
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...swapArrayValues('myField', 1, 4),
    //    form: 'testForm'
    //  })
    //  expect(state.testForm)
    //    .toEqual({
    //      myField: [
    //        {
    //          value: 'foo'
    //        },
    //        {
    //          value: 'bar'
    //        },
    //        {
    //          value: 'baz'
    //        }
    //      ],
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    })
    //  expect(isFieldValue(state.testForm.myField)).toBe(false)
    //  expect(isFieldValue(state.testForm.myField[0])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[1])).toBe(true)
    //  expect(isFieldValue(state.testForm.myField[2])).toBe(true)
    //
    //})
    //


    //
    //it('should destroy forms on destroy', () => {
    //  const state = reducer({
    //    foo: {
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    },
    //    bar: {
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...destroy(),
    //    form: 'foo'
    //  })
    //  expect(state)
    //    .toEqual({
    //      bar: {
    //        _active: undefined,
    //        _asyncValidating: false,
    //        [globalErrorKey]: undefined,
    //        _initialized: false,
    //        _submitting: false,
    //        _submitFailed: false
    //      }
    //    })
    //})
    //
    //it('should destroy last form on destroy', () => {
    //  const state = reducer({
    //    foo: {
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  }, {
    //    ...destroy(),
    //    form: 'foo'
    //  })
    //  expect(state)
    //    .toEqual({})
    //})
    //
    //it('should destroy form and formkey on destroy', () => {
    //  const destroyWithKey = (key) => bindActionData(destroy, { key })()
    //  const state = reducer({
    //    fooForm: {
    //      barKey: {
    //        _active: undefined,
    //        _asyncValidating: false,
    //        [globalErrorKey]: undefined,
    //        _initialized: false,
    //        _submitting: false,
    //        _submitFailed: false
    //      },
    //      bazKey: {
    //        _active: undefined,
    //        _asyncValidating: false,
    //        [globalErrorKey]: undefined,
    //        _initialized: false,
    //        _submitting: false,
    //        _submitFailed: false
    //      }
    //    }
    //  }, {
    //    ...destroyWithKey('barKey'),
    //    form: 'fooForm'
    //  })
    //  expect(state.fooForm).toEqual({
    //    bazKey: {
    //      _active: undefined,
    //      _asyncValidating: false,
    //      [globalErrorKey]: undefined,
    //      _initialized: false,
    //      _submitting: false,
    //      _submitFailed: false
    //    }
    //  })
    //})
    //
    ////describe('reducer.plugin', () => {
    ////  it('should initialize form state when there is a reducer plugin', () => {
    ////    const result = reducer.plugin({
    ////      foo: (state) => state
    ////    })()
    ////    expect(result)
    ////      .toExist()
    ////      .toBeA('object')
    ////    expect(Object.keys(result).length).toBe(1)
    ////    expect(result.foo)
    ////      .toExist()
    ////      .toBeA('object')
    ////      .toEqual({
    ////        _active: undefined,
    ////        _asyncValidating: false,
    ////        [globalErrorKey]: undefined,
    ////        _initialized: false,
    ////        _submitting: false,
    ////        _submitFailed: false
    ////      })
    ////  })
    ////})
    ////
    ////describe('reducer.normalize', () => {
    ////  it('should initialize form state when there is a normalizer', () => {
    ////    const state = reducer.normalize({
    ////      foo: {
    ////        'myField': () => 'normalized',
    ////        'person.name': () => 'John Doe',
    ////        'pets[].name': () => 'Fido'
    ////      }
    ////    })()
    ////    expect(state)
    ////      .toExist()
    ////      .toBeA('object')
    ////    expect(Object.keys(state).length).toBe(1)
    ////    expect(state.foo)
    ////      .toExist()
    ////      .toBeA('object')
    ////      .toEqual({
    ////        _active: undefined,
    ////        _asyncValidating: false,
    ////        [globalErrorKey]: undefined,
    ////        _initialized: false,
    ////        _submitting: false,
    ////        _submitFailed: false,
    ////        myField: {
    ////          value: 'normalized'
    ////        },
    ////        person: {
    ////          name: {
    ////            value: 'John Doe'
    ////          }
    ////        },
    ////        pets: []
    ////      })
    ////  })
    ////
    ////  it('should normalize keyed forms depending on action form key', () => {
    ////    const defaultFields = {
    ////      _active: undefined,
    ////      _asyncValidating: false,
    ////      [globalErrorKey]: undefined,
    ////      _initialized: false,
    ////      _submitting: false,
    ////      _submitFailed: false
    ////    }
    ////    const normalize = reducer.normalize({
    ////      foo: {
    ////        'myField': () => 'normalized',
    ////        'person.name': () => 'John Doe',
    ////        'pets[].name': () => 'Fido'
    ////      }
    ////    })
    ////    const state = normalize({
    ////      foo: {
    ////        firstSubform: {}
    ////      }
    ////    }, {
    ////      form: 'foo',
    ////      key: 'firstSubform'
    ////    })
    ////    const nextState = normalize(state, {
    ////      form: 'foo',
    ////      key: 'secondSubForm'
    ////    })
    ////    expect(state)
    ////      .toExist()
    ////      .toBeA('object')
    ////    expect(Object.keys(state).length).toBe(1)
    ////    expect(state.foo)
    ////      .toExist()
    ////      .toBeA('object')
    ////      .toEqual({
    ////        firstSubform: {
    ////          ...defaultFields,
    ////          myField: {
    ////            value: 'normalized'
    ////          },
    ////          person: {
    ////            name: {
    ////              value: 'John Doe'
    ////            }
    ////          },
    ////          pets: []
    ////        }
    ////      })
    ////    expect(nextState.foo)
    ////      .toEqual({
    ////        firstSubform: {
    ////          ...defaultFields,
    ////          myField: {
    ////            value: 'normalized'
    ////          },
    ////          person: {
    ////            name: {
    ////              value: 'John Doe'
    ////            }
    ////          },
    ////          pets: []
    ////        },
    ////        secondSubForm: {
    ////          ...defaultFields,
    ////          myField: {
    ////            value: 'normalized'
    ////          },
    ////          person: {
    ////            name: {
    ////              value: 'John Doe'
    ////            }
    ////          },
    ////          pets: []
    ////        }
    ////      })
    ////  })
    ////
    ////  it('should normalize simple form values', () => {
    ////    const defaultFields = {
    ////      _active: undefined,
    ////      _asyncValidating: false,
    ////      [globalErrorKey]: undefined,
    ////      _initialized: false,
    ////      _submitting: false,
    ////      _submitFailed: false
    ////    }
    ////    const normalize = reducer.normalize({
    ////      foo: {
    ////        'name': () => 'normalized',
    ////        'person.name': (name) => name && name.toUpperCase(),
    ////        'pets[].name': (name) => name && name.toLowerCase()
    ////      }
    ////    })
    ////    const state = normalize({
    ////      foo: {
    ////        name: {
    ////          value: 'dog'
    ////        },
    ////        person: {
    ////          name: {
    ////            value: 'John Doe',
    ////          }
    ////        },
    ////        pets: [
    ////          { name: { value: 'Fido' } },
    ////          { name: { value: 'Tucker' } }
    ////        ]
    ////      }
    ////    })
    ////    expect(state)
    ////      .toExist()
    ////      .toBeA('object')
    ////    expect(state.foo)
    ////      .toExist()
    ////      .toBeA('object')
    ////      .toEqual({
    ////        ...defaultFields,
    ////        name: {
    ////          value: 'normalized'
    ////        },
    ////        person: {
    ////          name: {
    ////            value: 'JOHN DOE'
    ////          }
    ////        },
    ////        pets: [
    ////          { name: { value: 'fido' } },
    ////          { name: { value: 'tucker' } }
    ////        ]
    ////      })
    ////  })
    ////
    ////  it('should allow resetForm to work on a normalized form', () => {
    ////    const defaultFields = {
    ////      _active: undefined,
    ////      _asyncValidating: false,
    ////      [globalErrorKey]: undefined,
    ////      _initialized: false,
    ////      _submitting: false,
    ////      _submitFailed: false
    ////    }
    ////    const normalizingReducer = reducer.normalize({
    ////      foo: {
    ////        'name': value => value && value.toUpperCase(),
    ////        'person.name': (name) => name && name.toUpperCase(),
    ////        'pets[].name': (name) => name && name.toLowerCase()
    ////      }
    ////    })
    ////    const empty = normalizingReducer()
    ////    let state = normalizingReducer(empty, {
    ////      form: 'foo',
    ////      ...change('name', 'dog'),
    ////    })
    ////    state = normalizingReducer(state, {
    ////      form: 'foo',
    ////      ...change('person.name', 'John Doe'),
    ////    })
    ////    state = normalizingReducer(state, {
    ////      form: 'foo',
    ////      ...addArrayValue('pets', { name: 'Fido' })
    ////    })
    ////    expect(state)
    ////      .toExist()
    ////      .toBeA('object')
    ////    expect(state.foo)
    ////      .toExist()
    ////      .toBeA('object')
    ////      .toEqual({
    ////        ...defaultFields,
    ////        name: {
    ////          value: 'DOG'
    ////        },
    ////        person: {
    ////          name: {
    ////            value: 'JOHN DOE'
    ////          }
    ////        },
    ////        pets: [{
    ////          name: {
    ////            initial: 'Fido',
    ////            value: 'fido'
    ////          }
    ////        }]
    ////      })
    ////    const result = normalizingReducer(state, {
    ////      form: 'foo',
    ////      ...reset()
    ////    })
    ////    expect(result)
    ////      .toExist()
    ////      .toBeA('object')
    ////    expect(result.foo)
    ////      .toExist()
    ////      .toBeA('object')
    ////      .toEqual({
    ////        ...defaultFields,
    ////        name: {
    ////          value: undefined
    ////        },
    ////        person: {
    ////          name: {
    ////            value: undefined
    ////          }
    ////        },
    ////        pets: [{
    ////          name: {
    ////            initial: 'Fido',
    ////            value: 'fido'
    ////          }
    ////        }]
    ////      })
    ////  })
    ////
    ////  it('should normalize arbitrarily deeply nested fields', () => {
    ////    const defaultFields = {
    ////      _active: undefined,
    ////      _asyncValidating: false,
    ////      [globalErrorKey]: undefined,
    ////      _initialized: false,
    ////      _submitting: false,
    ////      _submitFailed: false
    ////    }
    ////    const normalize = reducer.normalize({
    ////      foo: {
    ////        'name': () => 'normalized',
    ////        'person.name': (name) => name && name.toUpperCase(),
    ////        'pets[].name': (name) => name && name.toLowerCase(),
    ////        'cats[]': (array) => array && array.map(({value}) => ({ value: value.toUpperCase() })),
    ////        'programming[].langs[]': (array) => array && array.slice(0).sort(compare),
    ////        'some.numbers[]': (array) => array && array.filter(({value}) => value % 2 === 0),
    ////        'a.very.deep.object.property': (value) => value && value.toUpperCase(),
    ////        'my[].deeply[].nested.item': (value) => value && value.toUpperCase()
    ////      }
    ////    })
    ////    const state = normalize({
    ////      foo: {
    ////        person: {
    ////          name: makeFieldValue({ value: 'John Doe' })
    ////        },
    ////        pets: [
    ////          { name: makeFieldValue({ value: 'Fido' }) },
    ////          { name: makeFieldValue({ value: 'Tucker' }) }
    ////        ],
    ////        cats: [
    ////          makeFieldValue({ value: 'lion' }),
    ////          makeFieldValue({ value: 'panther' }),
    ////          makeFieldValue({ value: 'garfield' }),
    ////          makeFieldValue({ value: 'whiskers' })
    ////        ],
    ////        programming: [{
    ////          langs: [
    ////            makeFieldValue({ value: 'ml' }),
    ////            makeFieldValue({ value: 'ocaml' }),
    ////            makeFieldValue({ value: 'lisp' }),
    ////            makeFieldValue({ value: 'haskell' }),
    ////            makeFieldValue({ value: 'f#' })
    ////          ]
    ////        }, {
    ////          langs: [
    ////            makeFieldValue({ value: 'smalltalk' }),
    ////            makeFieldValue({ value: 'ruby' }),
    ////            makeFieldValue({ value: 'java' }),
    ////            makeFieldValue({ value: 'c#' }),
    ////            makeFieldValue({ value: 'c++' })
    ////          ]
    ////        }],
    ////        some: {
    ////          numbers: [
    ////            makeFieldValue({ value: 1 }),
    ////            makeFieldValue({ value: 2 }),
    ////            makeFieldValue({ value: 3 }),
    ////            makeFieldValue({ value: 4 }),
    ////            makeFieldValue({ value: 5 }),
    ////            makeFieldValue({ value: 6 }),
    ////            makeFieldValue({ value: 7 }),
    ////            makeFieldValue({ value: 8 }),
    ////            makeFieldValue({ value: 9 }),
    ////            makeFieldValue({ value: 10 })
    ////          ]
    ////        },
    ////        a: {
    ////          very: {
    ////            deep: {
    ////              object: {
    ////                property: makeFieldValue({ value: 'test' })
    ////              }
    ////            }
    ////          }
    ////        },
    ////        my: [{
    ////          deeply: [{
    ////            nested: {
    ////              item: makeFieldValue({ value: 'hello' }),
    ////              not: makeFieldValue({ value: 'lost' })
    ////            },
    ////            otherKey: makeFieldValue({ value: 'Goodbye' })
    ////          }, {
    ////            nested: {
    ////              item: makeFieldValue({ value: 'hola' }),
    ////              not: makeFieldValue({ value: 'lost' })
    ////            },
    ////            otherKey: makeFieldValue({ value: 'Adios' })
    ////          }],
    ////          stays: makeFieldValue({ value: 'intact' })
    ////        }, {
    ////          deeply: [{
    ////            nested: {
    ////              item: makeFieldValue({ value: 'world' }),
    ////              not: makeFieldValue({ value: 'lost' })
    ////            },
    ////            otherKey: makeFieldValue({ value: 'Later' })
    ////          }, {
    ////            nested: {
    ////              item: makeFieldValue({ value: 'mundo' }),
    ////              not: makeFieldValue({ value: 'lost' })
    ////            },
    ////            otherKey: makeFieldValue({ value: 'Hasta luego' })
    ////          }],
    ////          stays: makeFieldValue({ value: 'intact' })
    ////        }]
    ////      }
    ////    })
    ////    expect(state)
    ////      .toExist()
    ////      .toBeA('object')
    ////    expect(state.foo)
    ////      .toExist()
    ////      .toBeA('object')
    ////      .toEqual({
    ////        ...defaultFields,
    ////        name: { value: 'normalized' },
    ////        person: {
    ////          name: { value: 'JOHN DOE' }
    ////        },
    ////        pets: [
    ////          { name: { value: 'fido' } },
    ////          { name: { value: 'tucker' } }
    ////        ],
    ////        cats: [
    ////          { value: 'LION' },
    ////          { value: 'PANTHER' },
    ////          { value: 'GARFIELD' },
    ////          { value: 'WHISKERS' }
    ////        ],
    ////        programming: [{
    ////          langs: [
    ////            { value: 'f#' },
    ////            { value: 'haskell' },
    ////            { value: 'lisp' },
    ////            { value: 'ml' },
    ////            { value: 'ocaml' }
    ////          ]
    ////        }, {
    ////          langs: [
    ////            { value: 'c#' },
    ////            { value: 'c++' },
    ////            { value: 'java' },
    ////            { value: 'ruby' },
    ////            { value: 'smalltalk' }
    ////          ]
    ////        }],
    ////        some: {
    ////          numbers: [
    ////            { value: 2 },
    ////            { value: 4 },
    ////            { value: 6 },
    ////            { value: 8 },
    ////            { value: 10 }
    ////          ]
    ////        },
    ////        a: {
    ////          very: {
    ////            deep: {
    ////              object: {
    ////                property: { value: 'TEST' }
    ////              }
    ////            }
    ////          }
    ////        },
    ////        my: [{
    ////          deeply: [{
    ////            nested: {
    ////              item: { value: 'HELLO' },
    ////              not: { value: 'lost' }
    ////            },
    ////            otherKey: { value: 'Goodbye' }
    ////          }, {
    ////            nested: {
    ////              item: { value: 'HOLA' },
    ////              not: { value: 'lost' }
    ////            },
    ////            otherKey: { value: 'Adios' }
    ////          }],
    ////          stays: { value: 'intact' }
    ////        }, {
    ////          deeply: [{
    ////            nested: {
    ////              item: { value: 'WORLD' },
    ////              not: { value: 'lost' }
    ////            },
    ////            otherKey: { value: 'Later' }
    ////          }, {
    ////            nested: {
    ////              item: { value: 'MUNDO' },
    ////              not: { value: 'lost' }
    ////            },
    ////            otherKey: { value: 'Hasta luego' }
    ////          }],
    ////          stays: { value: 'intact' }
    ////        }]
    ////      })
    ////    expect(isFieldValue(state.foo.name)).toBe(true)
    ////    expect(isFieldValue(state.foo.person.name)).toBe(true)
    ////    expect(isFieldValue(state.foo.pets[0].name)).toBe(true)
    ////    expect(isFieldValue(state.foo.pets[1].name)).toBe(true)
    ////    expect(isFieldValue(state.foo.cats[0])).toBe(true)
    ////    expect(isFieldValue(state.foo.cats[1])).toBe(true)
    ////    expect(isFieldValue(state.foo.cats[2])).toBe(true)
    ////    expect(isFieldValue(state.foo.cats[3])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[0].langs[0])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[0].langs[1])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[0].langs[2])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[0].langs[3])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[0].langs[4])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[1].langs[0])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[1].langs[1])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[1].langs[2])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[1].langs[3])).toBe(true)
    ////    expect(isFieldValue(state.foo.programming[1].langs[4])).toBe(true)
    ////    expect(isFieldValue(state.foo.some.numbers[0])).toBe(true)
    ////    expect(isFieldValue(state.foo.some.numbers[1])).toBe(true)
    ////    expect(isFieldValue(state.foo.some.numbers[2])).toBe(true)
    ////    expect(isFieldValue(state.foo.some.numbers[3])).toBe(true)
    ////    expect(isFieldValue(state.foo.some.numbers[4])).toBe(true)
    ////    expect(isFieldValue(state.foo.a.very.deep.object.property)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[0].deeply[0].nested.item)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[0].deeply[0].nested.not)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[0].deeply[0].otherKey)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[0].deeply[1].nested.item)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[0].deeply[1].nested.not)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[0].deeply[1].otherKey)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[0].stays)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[1].deeply[0].nested.item)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[1].deeply[0].nested.not)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[1].deeply[0].otherKey)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[1].deeply[1].nested.item)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[1].deeply[1].nested.not)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[1].deeply[1].otherKey)).toBe(true)
    ////    expect(isFieldValue(state.foo.my[1].stays)).toBe(true)
    ////  })
    ////})
  })
}
describeReducer('reducer.plain', plain, addExpectations(plainExpectations))
describeReducer('reducer.immutable', immutable, addExpectations(immutableExpectations))
