import expect, {createSpy, restoreSpies} from 'expect';
import readFields from '../readFields';

const createRestorableSpy = (fn) => {
  return createSpy(fn, function() {
    this.calls = [];
  });
};

describe('readFields', () => {
  const blur = createRestorableSpy();
  const change = createRestorableSpy();
  const focus = createRestorableSpy();
  const restore = () => {
    blur.restore();
    change.restore();
    focus.restore();
  };

  const expectField = (field, name, value, dirty = true, error, initialValue) => {
    expect(field)
      .toExist()
      .toBeA('object');
    expect(field.name).toBe(name);
    expect(field.value).toBe(value);
    expect(field.onBlur).toBeA('function');
    expect(field.onChange).toBeA('function');
    expect(field.onDrag).toBeA('function');
    expect(field.onDrop).toBeA('function');
    expect(field.onFocus).toBeA('function');
    expect(field.onUpdate).toBeA('function');
    expect(field.onUpdate).toBe(field.onChange);
    expect(field.defaultChecked).toBe(initialValue);
    expect(field.defaultValue).toBe(initialValue);
    expect(field.error).toBe(error);
    expect(field.valid).toBe(!error);
    expect(field.invalid).toBe(!!error);
    expect(field.dirty).toBe(dirty);
    expect(field.pristine).toBe(!dirty);

    // call blur
    expect(blur.calls.length).toBe(0);
    field.onBlur('newValue');
    expect(blur.calls.length).toBe(1);
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(name, 'newValue');

    // call change
    expect(change.calls.length).toBe(0);
    field.onChange('newValue');
    expect(change.calls.length).toBe(1);
    expect(change)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(name, 'newValue');

    // call focus
    expect(focus.calls.length).toBe(0);
    field.onFocus();
    expect(focus.calls.length).toBe(1);
    expect(focus).toHaveBeenCalled();

    restore();
  };

  it('should initialize fields', () => {
    const result = readFields({
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      }
    }, {});
    expectField(result.foo, 'foo', 'fooValue');
    expectField(result.bar, 'bar', 'barValue');
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should initialize fields with initial values', () => {
    const result = readFields({
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 43
        }
      },
      initialValues: {
        foo: 'initialFoo',
        bar: 42
      }
    }, {});
    expectField(result.foo, 'foo', 'fooValue', true, undefined, 'initialFoo');
    expectField(result.bar, 'bar', 43, true, undefined, 42);
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 43});
    expect(result._meta.errors).toEqual({});
  });

  it('should initialize fields with sync errors', () => {
    const result = readFields({
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: () => ({
        foo: 'fooError',
        bar: 'barError'
      })
    }, {});
    expectField(result.foo, 'foo', 'fooValue', true, 'fooError');
    expectField(result.bar, 'bar', 'barValue', true, 'barError');
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooError', bar: 'barError'});
  });

  it('should update fields', () => {
    const props = {
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      }
    };
    const previous = readFields(props, {});
    const result = readFields({
      ...props,
      form: {
        foo: {
          value: 'fooValueNew'
        },
        bar: {
          value: 'barValue'
        }
      }
    }, previous);
    expectField(result.foo, 'foo', 'fooValueNew');
    expectField(result.bar, 'bar', 'barValue');
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValueNew', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should initialize new fields', () => {
    const props = {
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue'
        },
        bar: {
          value: 'barValue'
        }
      }
    };
    const previous = readFields(props, {});
    const result = readFields({
      ...props,
      fields: ['foo', 'bar', 'cat', 'dog']
    }, previous);
    expectField(result.foo, 'foo', 'fooValue');
    expectField(result.bar, 'bar', 'barValue');
    expectField(result.cat, 'cat', undefined, false);
    expectField(result.dog, 'dog', undefined, false);
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue', cat: undefined, dog: undefined});
    expect(result._meta.errors).toEqual({});
  });

  it('should remove fields', () => {
    const props = {
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        bar: {
          value: 'barValue'
        }
      }
    };
    const previous = readFields(props, {});
    const result = readFields({
      ...props,
      fields: ['bar']
    }, previous);
    expect(result._meta.foo).toBe(undefined);
    expectField(result.bar, 'bar', 'barValue');
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should handle dirty', () => {
    const result = readFields({
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue',
          initial: 'fooValue'
        },
        bar: {
          value: 'barValue',
          initial: 'fooValue'
        }
      }
    }, {});
    expectField(result.foo, 'foo', 'fooValue', false);
    expectField(result.bar, 'bar', 'barValue', true);
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should handle pristine', () => {
    const result = readFields({
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue',
          initial: 'fooValue'
        },
        bar: {
          value: 'barValue',
          initial: 'barValue'
        }
      }
    }, {});
    expectField(result.foo, 'foo', 'fooValue', false);
    expectField(result.bar, 'bar', 'barValue', false);
    expect(result._meta.allPristine).toBe(true);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should handle async errors', () => {
    const result = readFields({
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue',
          asyncError: 'fooAsyncError'
        },
        bar: {
          value: 'barValue',
          asyncError: 'barAsyncError'
        }
      }
    }, {});
    expectField(result.foo, 'foo', 'fooValue', true, 'fooAsyncError');
    expectField(result.bar, 'bar', 'barValue', true, 'barAsyncError');
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooAsyncError', bar: 'barAsyncError'});
  });

  it('should handle submit errors', () => {
    const result = readFields({
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue',
          submitError: 'fooSubmitError'
        },
        bar: {
          value: 'barValue',
          submitError: 'barSubmitError'
        }
      }
    }, {});
    expectField(result.foo, 'foo', 'fooValue', true, 'fooSubmitError');
    expectField(result.bar, 'bar', 'barValue', true, 'barSubmitError');
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooSubmitError', bar: 'barSubmitError'});
  });

  it('should prioritize submit errors over async errors', () => {
    const result = readFields({
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue',
          asyncError: 'fooAsyncError',
          submitError: 'fooSubmitError'
        },
        bar: {
          value: 'barValue',
          asyncError: 'barAsyncError',
          submitError: 'barSubmitError'
        }
      }
    }, {});
    expectField(result.foo, 'foo', 'fooValue', true, 'fooSubmitError');
    expectField(result.bar, 'bar', 'barValue', true, 'barSubmitError');
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooSubmitError', bar: 'barSubmitError'});
  });

  it('should prioritize sync errors over submit errors', () => {
    const result =
    readFields({
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue',
          submitError: 'fooSubmitError'
        },
        bar: {
          value: 'barValue',
          submitError: 'barSubmitError'
        }
      },
      validate: () => ({
        foo: 'fooSyncError',
        bar: 'barSyncError'
      })
    }, {});
    expectField(result.foo, 'foo', 'fooValue', true, 'fooSyncError');
    expectField(result.bar, 'bar', 'barValue', true, 'barSyncError');
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooSyncError', bar: 'barSyncError'});
  });

});
