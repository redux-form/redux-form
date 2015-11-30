import expect from 'expect';
import reducer from '../reducer';
import bindActionData from '../bindActionData';
import {addArrayValue, blur, change, focus, initialize, removeArrayValue, reset, startAsyncValidation, startSubmit,
  stopAsyncValidation, stopSubmit, touch, untouch, destroy} from '../actions';

describe('reducer', () => {
  it('should initialize state to {}', () => {
    const state = reducer();
    expect(state)
      .toExist()
      .toBeA('object');
    expect(Object.keys(state).length).toBe(0);
  });

  it('should not modify state when action has no form', () => {
    const state = {foo: 'bar'};
    expect(reducer(state, {type: 'SOMETHING_ELSE'})).toBe(state);
  });

  it('should initialize form state when action has form', () => {
    const state = reducer(undefined, {form: 'foo'});
    expect(state)
      .toExist()
      .toBeA('object');
    expect(Object.keys(state).length).toBe(1);
    expect(state.foo)
      .toExist()
      .toBeA('object')
      .toEqual({
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should add an empty array value with empty state', () => {
    const state = reducer({}, {
      ...addArrayValue('myField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: [
          {
            value: undefined
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should add an empty deep array value with empty state', () => {
    const state = reducer({}, {
      ...addArrayValue('myField.myArray'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          myArray: [
            {
              value: undefined
            }
          ]
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should add a deep array value with empty state', () => {
    const state = reducer({}, {
      ...addArrayValue('myField.myArray', 20, undefined),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          myArray: [
            {
              value: 20
            }
          ]
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should push an array value', () => {
    const state = reducer({
      testForm: {
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'bar'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...addArrayValue('myField', 'baz'),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'bar'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should insert an array value', () => {
    const state = reducer({
      testForm: {
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'bar'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...addArrayValue('myField', 'baz', 1),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'baz'
          },
          {
            value: 'bar'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set value on blur with empty state', () => {
    const state = reducer({}, {
      ...blur('myField', 'myValue'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'myValue'
        },
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set value on blur and touch with empty state', () => {
    const state = reducer({}, {
      ...blur('myField', 'myValue'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'myValue',
          touched: true
        },
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set value on blur and touch with initial value', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'initialValue',
          touched: false
        },
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myField', 'myValue'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'myValue',
          touched: true
        },
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should not modify value if undefined is passed on blur (for android react native)', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'myValue',
          touched: false
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myField'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'myValue',
          touched: true
        },
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should not modify value if undefined is passed on blur, even if no value existed (for android react native)', () => {
    const state = reducer({
      foo: {
        myField: {
          value: undefined
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myField'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: undefined,
          touched: true
        },
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set nested value on blur', () => {
    const state = reducer({
      foo: {
        myField: {
          mySubField: {
            value: undefined
          }
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myField.mySubField', 'hello'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          mySubField: {
            value: 'hello',
            touched: true
          }
        },
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set array value on blur', () => {
    const state = reducer({
      foo: {
        myArray: [
          {value: undefined}
        ],
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myArray[0]', 'hello'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myArray: [
          {
            value: 'hello',
            touched: true
          }
        ],
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set value on change with empty state', () => {
    const state = reducer({}, {
      ...change('myField', 'myValue'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'myValue'
        },
        _active: undefined, // CHANGE doesn't touch _active
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set value on change and touch with empty state', () => {
    const state = reducer({}, {
      ...change('myField', 'myValue'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'myValue',
          touched: true
        },
        _active: undefined, // CHANGE doesn't touch _active
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set value on change and touch with initial value', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'initialValue',
          touched: false
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: 'Some global error',
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...change('myField', 'myValue'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'myValue',
          touched: true
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: 'Some global error',
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set value on change and remove field-level submit and async errors', () => {
    const state = reducer({
      foo: {
        myField: {
          value: 'initial',
          submitError: 'submit error',
          asyncError: 'async error'
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: 'Some global error',
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...change('myField', 'different'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'different'
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: 'Some global error',
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set nested value on change with empty state', () => {
    const state = reducer({}, {
      ...change('myField.mySubField', 'myValue'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          mySubField: {
            value: 'myValue'
          }
        },
        _active: undefined, // CHANGE doesn't touch _active
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set visited on focus and update active with no previous state', () => {
    const state = reducer({}, {
      ...focus('myField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          visited: true
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set visited on focus and update active on deep field with no previous state', () => {
    const state = reducer({}, {
      ...focus('myField.subField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          subField: {
            visited: true
          }
        },
        _active: 'myField.subField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set visited on focus and update current with previous state', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'initialValue',
          visited: false
        },
        _active: 'otherField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...focus('myField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'initialValue',
          visited: true
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set initialize values on initialize on empty state', () => {
    const state = reducer({}, {
      ...initialize({myField: 'initialValue'}),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'initialValue'
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should allow initializing null values', () => {
    const state = reducer({}, {
      ...initialize({bar: 'baz', dog: null}),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        bar: {
          initial: 'baz',
          value: 'baz'
        },
        dog: {
          initial: null,
          value: null
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should initialize nested values on initialize on empty state', () => {
    const state = reducer({}, {
      ...initialize({myField: {subField: 'initialValue'}}),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          subField: {
            initial: 'initialValue',
            value: 'initialValue'
          }
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should initialize array values on initialize on empty state', () => {
    const state = reducer({}, {
      ...initialize({myField: ['initialValue']}),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: [
          {
            initial: 'initialValue',
            value: 'initialValue'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set initialize values on initialize on with previous state', () => {
    const state = reducer({
      foo: {
        myField: {
          value: 'dirtyValue',
          touched: true
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...initialize({myField: 'initialValue'}),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'initialValue'
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should pop an array value', () => {
    const state = reducer({
      testForm: {
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'bar'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...removeArrayValue('myField'),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should not change empty array value on remove', () => {
    const state = reducer({
      testForm: {
        myField: [],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...removeArrayValue('myField'),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should remove an array value from start of array', () => {
    const state = reducer({
      testForm: {
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'bar'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...removeArrayValue('myField', 0),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'bar'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should remove an array value from middle of array', () => {
    const state = reducer({
      testForm: {
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'bar'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...removeArrayValue('myField', 1),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should reset values on reset on with previous state', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...reset(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'initialValue'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherInitialValue'
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set asyncValidating on startAsyncValidation', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...startAsyncValidation(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: true,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set submitting on startSubmit', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...startSubmit(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: true,
        _submitFailed: false
      });
  });

  it('should set submitting on startSubmit, and NOT reset submitFailed', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: true
      }
    }, {
      ...startSubmit(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: true,
        _submitFailed: true
      });
  });


  it('should unset asyncValidating on stopAsyncValidation', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: true,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...stopAsyncValidation({
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true,
          asyncError: 'Error about myField'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true,
          asyncError: 'Error about myOtherField'
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should unset field async errors on stopAsyncValidation', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          asyncError: 'myFieldError',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          asyncError: 'myOtherFieldError',
          touched: true
        },
        _active: undefined,
        _asyncValidating: true,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...stopAsyncValidation(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          asyncError: undefined,
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          asyncError: undefined,
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should unset asyncValidating on stopAsyncValidation and set global error', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: true,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...stopAsyncValidation({
        _error: 'This is a global error'
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        _error: 'This is a global error',
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should unset submitting on stopSubmit', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: true,
        _submitFailed: false
      }
    }, {
      ...stopSubmit(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should unset submitFailed on stopSubmit with no errors', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: true,
        _submitFailed: true
      }
    }, {
      ...stopSubmit(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should unset submitting and set submit errors on stopSubmit', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: true,
        _submitFailed: false
      }
    }, {
      ...stopSubmit({
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true,
          submitError: 'Error about myField'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true,
          submitError: 'Error about myOtherField'
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: true
      });
  });

  it('should unset submitting and set submit global error on stopSubmit', () => {
    const state = reducer({
      foo: {
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: true,
        _submitFailed: false
      }
    }, {
      ...stopSubmit({
        _error: 'This is a global error'
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        _error: 'This is a global error',
        _submitting: false,
        _submitFailed: true
      });
  });

  it('should mark fields as touched on touch', () => {
    const state = reducer({
      foo: {
        myField: {
          value: 'initialValue',
          touched: false
        },
        myOtherField: {
          value: 'otherInitialValue',
          touched: false
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...touch('myField', 'myOtherField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'initialValue',
          touched: true
        },
        myOtherField: {
          value: 'otherInitialValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should unmark fields as touched on untouch', () => {
    const state = reducer({
      foo: {
        myField: {
          value: 'initialValue',
          touched: true
        },
        myOtherField: {
          value: 'otherInitialValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...untouch('myField', 'myOtherField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'initialValue',
          touched: false
        },
        myOtherField: {
          value: 'otherInitialValue',
          touched: false
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should destroy forms on destroy', () => {
    const state = reducer({
      foo: {
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      },
      bar: {
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...destroy(),
      form: 'foo'
    });
    expect(state)
      .toEqual({
        bar: {
          _active: undefined,
          _asyncValidating: false,
          _error: undefined,
          _submitting: false,
          _submitFailed: false
        }
      });
  });

  it('should destroy last form on destroy', () => {
    const state = reducer({
      foo: {
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...destroy(),
      form: 'foo'
    });
    expect(state)
      .toEqual({});
  });

  it('should destroy form and formkey on destroy', () => {
    const destroyWithKey = (key) => bindActionData(destroy, {key})();
    const state = reducer({
      fooForm: {
        barKey: {
          _active: undefined,
          _asyncValidating: false,
          _error: undefined,
          _submitting: false,
          _submitFailed: false
        },
        bazKey: {
          _active: undefined,
          _asyncValidating: false,
          _error: undefined,
          _submitting: false,
          _submitFailed: false
        }
      }
    }, {
      ...destroyWithKey('barKey'),
      form: 'fooForm'
    });
    expect(state.fooForm).toEqual({
      bazKey: {
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      }
    });
  });
});

describe('reducer.plugin', () => {
  it('should initialize form state when there is a reducer plugin', () => {
    const result = reducer.plugin({
      foo: (state) => state
    })();
    expect(result)
      .toExist()
      .toBeA('object');
    expect(Object.keys(result).length).toBe(1);
    expect(result.foo)
      .toExist()
      .toBeA('object')
      .toEqual({
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false
      });
  });
});

describe('reducer.normalize', () => {
  it('should initialize form state when there is a normalizer', () => {
    const state = reducer.normalize({
      foo: {
        myField: () => 'normalized'
      }
    })();
    expect(state)
      .toExist()
      .toBeA('object');
    expect(Object.keys(state).length).toBe(1);
    expect(state.foo)
      .toExist()
      .toBeA('object')
      .toEqual({
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false,
        _submitFailed: false,
        myField: {
          value: 'normalized'
        }
      });
  });
  it('should normalize keyed forms depending on action form key', () => {
    const defaultFields = {
      _active: undefined,
      _asyncValidating: false,
      _error: undefined,
      _submitting: false,
      _submitFailed: false,
    };
    const normalize = reducer.normalize({
      foo: {
        myField: () => 'normalized'
      }
    });
    const state = normalize({
      foo: {
        firstSubform: {}
      }
    }, {
      form: 'foo',
      key: 'firstSubform'
    });
    const nextState = normalize(state, {
      form: 'foo',
      key: 'secondSubForm'
    });
    expect(state)
      .toExist()
      .toBeA('object');
    expect(Object.keys(state).length).toBe(1);
    expect(state.foo)
      .toExist()
      .toBeA('object')
      .toEqual({
        firstSubform: {
          ...defaultFields,
          myField: {
            value: 'normalized'
          }
        }
      });
    expect(nextState.foo)
      .toEqual({
        firstSubform: {
          ...defaultFields,
          myField: {
            value: 'normalized'
          }
        },
        secondSubForm: {
          ...defaultFields,
          myField: {
            value: 'normalized'
          }
        }
      });

  });
});
