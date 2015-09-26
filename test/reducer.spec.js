import expect from 'expect';
import reducer from '../src/reducer';
import {blur, change, focus, initialize, reset, startAsyncValidation, startSubmit,
  stopAsyncValidation, stopSubmit, touch, untouch} from '../src/actions';

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
        _submitting: false
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
          value: 'myValue',
          touched: false
        },
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false
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
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false
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
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false
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
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false
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
        _submitting: false
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
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false
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
        _submitting: false
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
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _submitting: false
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
          value: 'myValue',
          touched: false,
          asyncError: null,
          submitError: null
        },
        _active: undefined, // CHANGE doesn't touch _active
        _asyncValidating: false,
        _error: undefined,
        _submitting: false
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
          touched: true,
          asyncError: null,
          submitError: null
        },
        _active: undefined, // CHANGE doesn't touch _active
        _asyncValidating: false,
        _error: undefined,
        _submitting: false
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
        _submitting: false
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
          touched: true,
          asyncError: null,
          submitError: null
        },
        _active: 'myField',
        _asyncValidating: false,
        _error: undefined,
        _submitting: false
      });
  });

  it('should set visited on focus and update current with no previous state', () => {
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: true
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: true
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
        _submitting: false
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
        _submitting: true
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
        _submitting: false
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
        _submitting: true
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
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
        _submitting: false
      });
  });
});

describe('reducer.plugin', () => {
  it('should initialize form state when there is a reducer plugin', () => {
    const state = reducer.plugin({
      foo: (state, action) => {
        return state;
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
        _submitting: false
      });
  });
});

describe('reducer.normalize', () => {
  it('should initialize form state when there is a normalizer', () => {
    const state = reducer.normalize({
      foo: {
        myField: (value, previousValue, allValues) => 'normalized'
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
        myField: {
          value: 'normalized'
        }
      });
  });
});
