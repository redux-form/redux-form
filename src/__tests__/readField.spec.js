import expect, {createSpy} from 'expect';
import readField from '../readField';
const noop = () => null;

const createRestorableSpy = (fn) => {
  return createSpy(fn, function restore() {
    this.calls = [];
  });
};

describe('readField', () => {
  const blur = createRestorableSpy();
  const change = createRestorableSpy();
  const focus = createRestorableSpy();
  const defaultProps = {
    asyncBlurFields: [],
    blur,
    change,
    focus,
    form: {},
    initialValues: {},
    readonly: false,
    addArrayValue: noop,
    removeArrayValue: noop
  };

  const expectField = ({field, name, value, dirty, touched, visited, error, initialValue, readonly, checked}) => {
    expect(field)
      .toExist()
      .toBeA('object');
    expect(field.name).toBe(name);
    expect(field.value).toEqual(value);
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
    expect(field.defaultChecked).toBe(initialValue === true);
    expect(field.defaultValue).toBe(initialValue);
    expect(field.initialValue).toBe(initialValue);
    expect(field.error).toBe(error);
    expect(field.valid).toBe(!error);
    expect(field.invalid).toBe(!!error);
    expect(field.dirty).toBe(dirty);
    expect(field.pristine).toBe(!dirty);
    expect(field.touched).toBe(touched);
    expect(field.visited).toBe(visited);
    expect(field.checked).toBe(checked);

    blur.restore();
    change.restore();
    focus.restore();
  };

  it('should initialize a simple field', () => {
    const fields = {};
    readField({}, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: undefined,
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
  });

  it('should read a simple field', () => {
    const fields = {};
    readField({
      foo: {
        value: 'bar'
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
  });

  it('should read a simple field with initial values', () => {
    const fields = {};
    readField({
      foo: {
        value: 'bar',
        initial: 'dog'
      }
    }, 'foo', undefined, fields, {}, undefined, false, {
      ...defaultProps,
      initialValues: {foo: 'cat'}
    });
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'dog', // state.initial should override prop
      readonly: false
    });
  });

  it('should read a simple field with sync errors', () => {
    const fields = {};
    readField({
      foo: {
        value: 'bar'
      }
    }, 'foo', undefined, fields, {
      foo: 'fooError'
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooError',
      initialValue: undefined,
      readonly: false
    });
  });

  it('should set checked for boolean value', () => {
    const fields = {};
    readField({
      foo: {
        value: true
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: true,
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false,
      checked: true
    });
    readField({
      foo: {
        value: false
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: false,
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false,
      checked: false
    });
  });

  it('should update simple fields', () => {
    const fields = {};
    readField({
      foo: {
        value: 'bar'
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    const beforeField = fields.foo;
    readField({
      foo: {
        value: 'dog'
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'dog',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    const afterField = fields.foo;
    expect(beforeField).toNotBe(afterField);  // field instance should be different
  });

  it('should initialize a nested field', () => {
    const fields = {};
    readField({}, 'foo.baz', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: undefined,
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
  });

  it('should read a nested field', () => {
    const fields = {};
    readField({
      foo: {
        baz: {
          value: 'bar'
        }
      }
    }, 'foo.baz', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
  });

  it('should read a nested field with initial value', () => {
    const fields = {};
    readField({
      foo: {
        baz: {
          value: 'bar',
          initial: 'dog'
        }
      }
    }, 'foo.baz', undefined, fields, {}, undefined, false, {
      ...defaultProps,
      initialValues: {
        foo: {
          baz: 'cat'
        }
      }
    });
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'dog', // state.initial should override prop
      readonly: false
    });
  });

  it('should read a nested field with sync errors', () => {
    const fields = {};
    readField({
      foo: {
        baz: {
          value: 'bar'
        }
      }
    }, 'foo.baz', undefined, fields, {
      foo: {
        baz: 'bazError'
      }
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'bazError',
      initialValue: undefined,
      readonly: false
    });
  });

  it('should update a nested field', () => {
    const fields = {};
    readField({
      foo: {
        baz: {
          value: 'bar'
        }
      }
    }, 'foo.baz', undefined, fields, {
      foo: {
        baz: 'bazError'
      }
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'bazError',
      initialValue: undefined,
      readonly: false
    });
    const beforeFoo = fields.foo;
    const beforeField = fields.foo.baz;
    readField({
      foo: {
        baz: {
          value: 'barNew'
        }
      }
    }, 'foo.baz', undefined, fields, {
      foo: {
        baz: 'bazError'
      }
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'barNew',
      dirty: true,
      touched: false,
      visited: false,
      error: 'bazError',
      initialValue: undefined,
      readonly: false
    });
    const afterFoo = fields.foo;
    const afterField = fields.foo.baz;
    expect(beforeFoo).toBe(afterFoo);         // field container instance should be same
    expect(beforeField).toNotBe(afterField);  // field instance should be different
  });

  it('should initialize an array field', () => {
    const fields = {};
    readField({}, 'foo[]', undefined, fields, {}, undefined, false, defaultProps);
    expect(fields.foo).toBeA('array');
    expect(fields.foo[0]).toBe(undefined);
  });

  it('should read an array field', () => {
    const fields = {};
    readField({
      foo: [
        {value: 'bar'},
        {value: 'baz'}
      ]
    }, 'foo[]', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
    expect(fields.foo[2]).toBe(undefined);
  });

  it('should read an array field with an initial value', () => {
    const fields = {};
    readField({
      foo: [
        {value: 'bar'},
        {value: 'baz'}
      ]
    }, 'foo[]', undefined, fields, {}, undefined, false, {
      ...defaultProps,
      initialValues: {
        foo: ['cat1', 'cat2']
      }
    });
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'cat1',
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'cat2',
      readonly: false
    });
  });

  it('should read an array field with sync errors', () => {
    const fields = {};
    readField({
      foo: [
        {value: 'bar'},
        {value: 'baz'}
      ]
    }, 'foo[]', undefined, fields, {
      foo: ['error1', 'error2']
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error1',
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error2',
      initialValue: undefined,
      readonly: false
    });
  });

  it('should update an array field', () => {
    const fields = {};
    readField({
      foo: [
        {value: 'bar'},
        {value: 'baz'}
      ]
    }, 'foo[]', undefined, fields, {
      foo: ['error1', 'error2']
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error1',
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error2',
      initialValue: undefined,
      readonly: false
    });
    const beforeArray = fields.foo;
    const before1 = fields.foo[0];
    const before2 = fields.foo[1];
    readField({
      foo: [
        {value: 'barNew'},
        {value: 'bazNew'}
      ]
    }, 'foo[]', undefined, fields, {
      foo: ['error1', 'error2']
    }, undefined, false, defaultProps);
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'barNew',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error1',
      initialValue: undefined,
      readonly: false
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'bazNew',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error2',
      initialValue: undefined,
      readonly: false
    });
    const afterArray = fields.foo;
    const after1 = fields.foo[0];
    const after2 = fields.foo[1];
    expect(beforeArray).toBe(afterArray); // array should be same instance
    expect(before1).toNotBe(after1);      // field instance should be different
    expect(before2).toNotBe(after2);      // field instance should be different
  });

  it('should allow an array field to add a value', () => {
    const spy = createSpy();
    const fields = {};
    readField({
      foo: [
        {value: 'bar'},
        {value: 'baz'}
      ]
    }, 'foo[]', undefined, fields, {}, undefined, false, {
      ...defaultProps,
      addArrayValue: spy
    });
    fields.foo.addField('rabbit');
    expect(spy)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'rabbit', undefined, undefined);
  });

  it('should allow an array field to remove a value', () => {
    const spy = createSpy();
    const fields = {};
    readField({
      foo: [
        {value: 'bar'},
        {value: 'baz'}
      ]
    }, 'foo[]', undefined, fields, {}, undefined, false, {
      ...defaultProps,
      removeArrayValue: spy
    });
    fields.foo.removeField(1);
    expect(spy)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 1);
  });

  it('should remove array field when it is no longer in the store', () => {
    const fields = {};
    readField({
      foo: [
        {value: 'bar'},
        {value: 'baz'}
      ]
    }, 'foo[]', undefined, fields, {}, undefined, false, defaultProps);
    expect(fields.foo.length).toBe(2);
    expect(fields.foo[0].value).toBe('bar');
    expect(fields.foo[1].value).toBe('baz');
    readField({
      foo: [
        {value: 'bar'}
      ]
    }, 'foo[]', undefined, fields, {}, undefined, false, defaultProps);
    expect(fields.foo.length).toBe(1);
    expect(fields.foo[0].value).toBe('bar');
  });

  it('should initialize a mixed field with empty state', () => {
    const fields = {};
    readField({}, 'pig.foo[].dog.cat[].rat', undefined, fields, {}, undefined, false, defaultProps);
    expect(fields.pig).toBeA('object');
    expect(fields.pig.foo).toBeA('array');
    expect(fields.pig.foo[0]).toBe(undefined);
  });

  it('should read a mixed field', () => {
    const fields = {};
    readField({
      pig: {
        foo: [
          {
            dog: {
              cat: [
                {
                  rat: {
                    value: 'hello'  // that's deep, baby!
                  }
                }
              ]
            }
          }
        ]
      }
    }, 'pig.foo[].dog.cat[].rat', undefined, fields, {}, undefined, false, defaultProps);
    expect(fields.pig).toBeA('object');
    expect(fields.pig.foo).toBeA('array');
    expect(fields.pig.foo[0].dog).toBeA('object');
    expect(fields.pig.foo[0].dog.cat).toBeA('array');
    expect(fields.pig.foo[0].dog.cat[0]).toBeA('object');
    expect(fields.pig.foo[0].dog.cat[0].rat).toBeA('object');
    expectField({
      field: fields.pig.foo[0].dog.cat[0].rat,
      name: 'pig.foo[0].dog.cat[0].rat',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
  });

  it('should read an array field with an initial value', () => {
    const fields = {};
    readField({
      pig: {
        foo: [
          {
            dog: {
              cat: [
                {
                  rat: {
                    value: 'hello'
                  }
                }
              ]
            }
          }
        ]
      }
    }, 'pig.foo[].dog.cat[].rat', undefined, fields, {}, undefined, false, {
      ...defaultProps,
      initialValues: {
        pig: {
          foo: [
            {
              dog: {
                cat: [
                  {rat: 'initVal'}
                ]
              }
            }
          ]
        }
      }
    });
    expectField({
      field: fields.pig.foo[0].dog.cat[0].rat,
      name: 'pig.foo[0].dog.cat[0].rat',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'initVal',
      readonly: false
    });
  });

  it('should read a mixed field with sync errors', () => {
    const fields = {};
    readField({
      pig: {
        foo: [
          {
            dog: {
              cat: [
                {
                  rat: {
                    value: 'hello'
                  }
                }
              ]
            }
          }
        ]
      }
    }, 'pig.foo[].dog.cat[].rat', undefined, fields, {
      pig: {
        foo: [
          {
            dog: {
              cat: [
                {rat: 'syncError'}
              ]
            }
          }
        ]
      }
    }, undefined, false, defaultProps);
    expectField({
      field: fields.pig.foo[0].dog.cat[0].rat,
      name: 'pig.foo[0].dog.cat[0].rat',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: 'syncError',
      initialValue: undefined,
      readonly: false
    });
  });

  it('should allow an array value', () => {
    const fields = {};
    readField({
      foo: {
        value: [1, 2]
      }
    }, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: [1, 2],
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: undefined,
      readonly: false
    });
  });

  it('should not provide mutators when readonly', () => {
    const fields = {};
    readField({}, 'foo', undefined, fields, {}, undefined, false, {
      ...defaultProps,
      readonly: true
    });
    const field = fields.foo;
    expect(field.onBlur).toNotExist();
    expect(field.onChange).toNotExist();
    expect(field.onDragStart).toNotExist();
    expect(field.onDrop).toNotExist();
    expect(field.onFocus).toNotExist();
    expect(field.onUpdate).toNotExist();
  });
});
