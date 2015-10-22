import expect, {createSpy} from 'expect';
import readFields from '../readFields';

const createRestorableSpy = (fn) => {
  return createSpy(fn, function restore() {
    this.calls = [];
  });
};

describe('readFields', () => {
  const blur = createRestorableSpy();
  const change = createRestorableSpy();
  const focus = createRestorableSpy();
  const noValidation = () => ({});

  const expectField = ({field, name, value, dirty, touched, visited, error, initialValue, readonly}) => {
    expect(field)
      .toExist()
      .toBeA('object');
    expect(field.name).toBe(name);
    expect(field.value).toBe(value);
    if (readonly) {
      expect(field.onBlur).toNotExist();
      expect(field.onChange).toNotExist();
      expect(field.onDragStart).toNotExist();
      expect(field.onDrop).toNotExist();
      expect(field.onFocus).toNotExist();
      expect(field.onUpdate).toNotExist();
    } else {
      expect(field.onBlur).toBeA('function');
      expect(field.onChange).toBeA('function');
      expect(field.onDragStart).toBeA('function');
      expect(field.onDrop).toBeA('function');
      expect(field.onFocus).toBeA('function');
      expect(field.onUpdate).toBeA('function');
      expect(field.onUpdate).toBe(field.onChange);

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
    }
    expect(field.defaultChecked).toBe(initialValue);
    expect(field.defaultValue).toBe(initialValue);
    expect(field.error).toBe(error);
    expect(field.valid).toBe(!error);
    expect(field.invalid).toBe(!!error);
    expect(field.dirty).toBe(dirty);
    expect(field.pristine).toBe(!dirty);
    expect(field.touched).toBe(touched);
    expect(field.visited).toBe(visited);

    blur.restore();
    change.restore();
    focus.restore();
  };

  it('should not provide mutators when readonly', () => {
    const result = readFields({
      asyncBlurFields: [],
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {},
      readonly: true,
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: undefined,
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: true
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: undefined,
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: true
    });
    expect(result._meta.allPristine).toBe(true);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: undefined, bar: undefined});
    expect(result._meta.errors).toEqual({});
  });

  it('should initialize fields', () => {
    const result = readFields({
      asyncBlurFields: [],
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
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should initialize fields with initial values', () => {
    const result = readFields({
      asyncBlurFields: [],
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
      },
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      valid: true,
      dirty: true,
      error: undefined,
      visited: false,
      touched: false,
      initialValue: 'initialFoo',
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 43,
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      initialValue: 42,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 43});
    expect(result._meta.errors).toEqual({});
  });

  it('should initialize fields with sync errors', () => {
    const result = readFields({
      asyncBlurFields: [],
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
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooError',
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barError',
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooError', bar: 'barError'});
  });

  it('should update fields', () => {
    const props = {
      asyncBlurFields: [],
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
      validate: noValidation
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
      },
      validate: noValidation
    }, previous);
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValueNew',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValueNew', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should initialize new fields', () => {
    const props = {
      asyncBlurFields: [],
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
      validate: noValidation
    };
    const previous = readFields(props, {});
    const result = readFields({
      ...props,
      fields: ['foo', 'bar', 'cat', 'dog']
    }, previous);
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.cat,
      name: 'cat',
      value: undefined,
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.dog,
      name: 'dog',
      value: undefined,
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue', cat: undefined, dog: undefined});
    expect(result._meta.errors).toEqual({});
  });

  it('should remove fields', () => {
    const props = {
      asyncBlurFields: [],
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    };
    const previous = readFields(props, {});
    const result = readFields({
      ...props,
      fields: ['bar']
    }, previous);
    expect(result._meta.foo).toBe(undefined);
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should handle dirty', () => {
    const result = readFields({
      asyncBlurFields: [],
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
      },
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should handle pristine', () => {
    const result = readFields({
      asyncBlurFields: [],
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
      },
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(true);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should handle touched', () => {
    const result = readFields({
      asyncBlurFields: [],
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue',
          touched: true
        },
        bar: {
          value: 'barValue'
        }
      },
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: true,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should handle visited', () => {
    const result = readFields({
      asyncBlurFields: [],
      blur,
      change,
      fields: ['foo', 'bar'],
      focus,
      form: {
        foo: {
          value: 'fooValue',
          visited: true
        },
        bar: {
          value: 'barValue',
          visited: true
        }
      },
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: true,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: true,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(true);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
  });

  it('should handle async errors', () => {
    const result = readFields({
      asyncBlurFields: [],
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
      },
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooAsyncError',
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barAsyncError',
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooAsyncError', bar: 'barAsyncError'});
  });

  it('should handle submit errors', () => {
    const result = readFields({
      asyncBlurFields: [],
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
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooSubmitError',
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barSubmitError',
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooSubmitError', bar: 'barSubmitError'});
  });

  it('should prioritize submit errors over async errors', () => {
    const result = readFields({
      asyncBlurFields: [],
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
      },
      validate: noValidation
    }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooSubmitError',
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barSubmitError',
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooSubmitError', bar: 'barSubmitError'});
  });

  it('should prioritize sync errors over submit errors', () => {
    const result =
      readFields({
        asyncBlurFields: [],
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
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooSyncError',
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: 'barSyncError',
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({foo: 'fooSyncError', bar: 'barSyncError'});
  });

  it('should handle form error via sync errors', () => {
    const result =
      readFields({
        asyncBlurFields: [],
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
          _error: 'formSyncError'
        })
      }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
    expect(result._meta.formError).toEqual('formSyncError');
  });

  it('should handle form error via reducer state', () => {
    const result =
      readFields({
        asyncBlurFields: [],
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
          },
          _error: 'formReducerError'
        },
        validate: noValidation
      }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
    expect(result._meta.formError).toEqual('formReducerError');
  });

  it('should prioritize sync form error over reducer form error', () => {
    const result =
      readFields({
        asyncBlurFields: [],
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
          },
          _error: 'formReducerError'
        },
        validate: () => ({
          _error: 'formSyncError'
        })
      }, {});
    expectField({
      field: result.foo,
      name: 'foo',
      value: 'fooValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: result.bar,
      name: 'bar',
      value: 'barValue',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(result._meta.allPristine).toBe(false);
    expect(result._meta.allValid).toBe(false);
    expect(result._meta.values).toEqual({foo: 'fooValue', bar: 'barValue'});
    expect(result._meta.errors).toEqual({});
    expect(result._meta.formError).toEqual('formSyncError');
  });
});
