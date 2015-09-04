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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
          asyncError: null
        },
        _asyncValidating: false,
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
          asyncError: null
        },
        _asyncValidating: false,
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
        _asyncValidating: false,
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
          asyncError: null
        },
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
        _submitting: false
      });
  });

  it('should set asyncValidating on startAsyncValidation', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _asyncValidating: false,
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
        _asyncValidating: true,
        _submitting: false
      });
  });

  it('should set submitting on startSubmit', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: true,
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
        _asyncValidating: false,
        _submitting: false
      });
  });

  it('should unset submitting on stopSubmit', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
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
        _asyncValidating: false,
        _submitting: false
      });
  });
});
