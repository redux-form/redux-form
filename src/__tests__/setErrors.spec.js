import expect from 'expect';
import setErrors from '../setErrors';

describe('setErrors', () => {
  it('should not change if no errors', () => {
    expect(setErrors({foo: 42, bar: true}, {}, '__err'))
      .toEqual({foo: 42, bar: true});
  });

  it('should not change if no errors and no state', () => {
    expect(setErrors(undefined, {}, '__err'))
      .toEqual(undefined);
  });

  it('should set errors even when state is empty', () => {
    expect(setErrors({}, {
      foo: 'fooError',
      bar: 'barError'
    }, '__err'))
      .toEqual({
        foo: {
          __err: 'fooError'
        },
        bar: {
          __err: 'barError'
        }
      });
  });

  it('should set errors even when state is null', () => {
    expect(setErrors(null, {
      foo: 'fooError'
    }, '__err'))
      .toEqual({
        foo: {
          __err: 'fooError'
        },
      });
  });

  it('should ignore meta keys', () => {
    expect(setErrors({}, {
      _startsWithUnderscore: 'shouldBeIgnored'
    }, '__err'))
      .toEqual({});
  });

  it('should set nested errors even when no state', () => {
    expect(setErrors({}, {
      dog: {
        foo: 'fooError',
        bar: 'barError'
      }
    }, '__err'))
      .toEqual({
        dog: {
          foo: {
            __err: 'fooError'
          },
          bar: {
            __err: 'barError'
          }
        }
      });
  });

  it('should set array errors even when no state', () => {
    expect(setErrors({}, {
      dog: [
        'fooError',
        'barError'
      ]
    }, '__err'))
      .toEqual({
        dog: [
          {
            __err: 'fooError'
          },
          {
            __err: 'barError'
          }
        ]
      });
  });

  it('should set simple error', () => {
    expect(setErrors({
      foo: {
        value: 'bar'
      },
      cat: {
        value: 'rat'
      }
    }, {
      foo: 'fooError',
      cat: 'meow'
    }, '__err'))
      .toEqual({
        foo: {
          value: 'bar',
          __err: 'fooError'
        },
        cat: {
          value: 'rat',
          __err: 'meow'
        }
      });
  });

  it('should unset simple error', () => {
    expect(setErrors({
      foo: {
        value: 'bar',
        __err: 'fooError'
      },
      cat: {
        value: 'rat',
        __err: 'meow'
      }
    }, {}, '__err'))
      .toEqual({
        foo: {
          value: 'bar'
        },
        cat: {
          value: 'rat'
        }
      });
  });

  it('should set simple error with first error if given an array', () => {
    expect(setErrors({
      foo: {
        value: 'bar'
      }
    }, {
      foo: ['fooError1', 'fooError2']
    }, '__err'))
      .toEqual({
        foo: {
          value: 'bar',
          __err: 'fooError1'
        }
      });
  });

  it('should set nested error', () => {
    expect(setErrors({
      dog: {
        foo: {
          value: 'bar'
        }
      }
    }, {
      dog: {
        foo: 'fooError'
      }
    }, '__err'))
      .toEqual({
        dog: {
          foo: {
            value: 'bar',
            __err: 'fooError'
          }
        }
      });
  });

  it('should unset nested error', () => {
    expect(setErrors({
      dog: {
        foo: {
          value: 'bar',
          __err: 'fooError'
        }
      }
    }, {}, '__err'))
      .toEqual({
        dog: {
          foo: {
            value: 'bar'
          }
        }
      });
  });

  it('should set nested error with first error if given an array', () => {
    expect(setErrors({
      dog: {
        foo: {
          value: 'bar'
        }
      }
    }, {
      dog: {
        foo: ['fooError1', 'fooError2']
      }
    }, '__err'))
      .toEqual({
        dog: {
          foo: {
            value: 'bar',
            __err: 'fooError1'
          }
        }
      });
  });

  it('should set array error when state is array', () => {
    expect(setErrors({
      foo: [
        {
          value: 'bar'
        }
      ]
    }, {
      foo: [
        'fooError',
        'additionalErrorForUndefinedField'
      ]
    }, '__err'))
      .toEqual({
        foo: [
          {
            value: 'bar',
            __err: 'fooError'
          },
          {
            __err: 'additionalErrorForUndefinedField'
          }
        ]
      });
  });

  it('should unset array error when state is array', () => {
    expect(setErrors({
      foo: [
        {
          value: 'bar',
          __err: 'fooError'
        }
      ]
    }, {
      foo: []
    }, '__err'))
      .toEqual({
        foo: [
          {
            value: 'bar'
          }
        ]
      });
    expect(setErrors({
      foo: [
        {
          value: 'bar',
          __err: 'fooError'
        }
      ]
    }, {}, '__err'))
      .toEqual({
        foo: [
          {
            value: 'bar'
          }
        ]
      });
  });
});
