import expect from 'expect';
import initializeState from '../initializeState';
import {isFieldValue} from '../fieldValue';

describe('initializeState', () => {
  it('should throw error when no fields passed', () => {
    expect(() => initializeState({}, undefined, {})).toThrow(/fields must be passed/);
  });

  it('should return empty if no fields', () => {
    expect(initializeState({}, [], {})).toEqual({});
  });

  it('should return empty field entries for each field', () => {
    const result = initializeState({}, ['foo', 'bar'], {});
    expect(result).toEqual({
      foo: {
        _isFieldValue: true
      },
      bar: {
        _isFieldValue: true
      }
    });
    expect(isFieldValue(result.foo)).toBe(true);
    expect(isFieldValue(result.bar)).toBe(true);
  });

  it('should initialize simple field values to state', () => {
    const result = initializeState({
      foo: 'bar',
      catLives: 9,
      alive: true
    }, ['foo', 'catLives', 'alive'], {});
    expect(result)
      .toBeA('object')
      .toEqual({
        foo: {
          initial: 'bar',
          value: 'bar',
          _isFieldValue: true
        },
        catLives: {
          initial: 9,
          value: 9,
          _isFieldValue: true
        },
        alive: {
          initial: true,
          value: true,
          _isFieldValue: true
        }
      });
    expect(isFieldValue(result.foo)).toBe(true);
    expect(isFieldValue(result.catLives)).toBe(true);
    expect(isFieldValue(result.alive)).toBe(true);
  });

  it('should initialize deep field values to state', () => {
    const result = initializeState({
      foo: {
        bar: 'baz'
      },
      lives: {
        cat: 9
      },
      alive: true
    }, ['foo.bar', 'lives.cat', 'alive'], {});
    expect(result)
      .toBeA('object')
      .toEqual({
        foo: {
          bar: {
            initial: 'baz',
            value: 'baz',
            _isFieldValue: true
          }
        },
        lives: {
          cat: {
            initial: 9,
            value: 9,
            _isFieldValue: true
          }
        },
        alive: {
          initial: true,
          value: true,
          _isFieldValue: true
        }
      });
    expect(isFieldValue(result.foo)).toBe(false);
    expect(isFieldValue(result.foo.bar)).toBe(true);
    expect(isFieldValue(result.lives)).toBe(false);
    expect(isFieldValue(result.lives.cat)).toBe(true);
    expect(isFieldValue(result.alive)).toBe(true);
  });

  it('should initialize array field values to state', () => {
    const result = initializeState({
      foo: ['bar', 'baz', undefined],
      alive: true
    }, ['foo[]', 'alive'], {});
    expect(result)
      .toBeA('object')
      .toEqual({
        foo: [
          {
            initial: 'bar',
            value: 'bar',
            _isFieldValue: true
          },
          {
            initial: 'baz',
            value: 'baz',
            _isFieldValue: true
          },
          {
            _isFieldValue: true
          }
        ],
        alive: {
          initial: true,
          value: true,
          _isFieldValue: true
        }
      });
    expect(isFieldValue(result.foo)).toBe(false);
    expect(isFieldValue(result.foo[0])).toBe(true);
    expect(isFieldValue(result.foo[1])).toBe(true);
    expect(isFieldValue(result.foo[2])).toBe(true);
    expect(isFieldValue(result.alive)).toBe(true);
  });

  it('should be okay with no array value given', () => {
    const result = initializeState({
      bar: 42
    }, ['foo[]', 'bar'], {});
    expect(result)
      .toBeA('object')
      .toEqual({
        foo: [],
        bar: {
          initial: 42,
          value: 42,
          _isFieldValue: true
        }
      });
    expect(isFieldValue(result.foo)).toBe(false);
    expect(isFieldValue(result.bar)).toBe(true);
  });

  it('should allow an array field to be empty', () => {
    const result = initializeState({
      foo: []
    }, ['foo[]'], {});
    expect(result)
      .toBeA('object')
      .toEqual({foo: []});
    expect(isFieldValue(result.foo)).toBe(false);
  });

  it('should initialize array values to state', () => {
    const result = initializeState({
      animals: ['cat', 'dog', 'rat'],
      bar: [{deeper: 42}]
    }, ['animals', 'bar'], {});
    expect(result)
      .toBeA('object')
      .toEqual({
        animals: {
          initial: ['cat', 'dog', 'rat'],
          value: ['cat', 'dog', 'rat'],
          _isFieldValue: true
        },
        bar: {
          initial: [{deeper: 42}],
          value: [{deeper: 42}],
          _isFieldValue: true
        }
      });
    expect(isFieldValue(result.animals)).toBe(true);
    expect(isFieldValue(result.bar)).toBe(true);
  });

  it('should initialize array values to state, changing existing values', () => {
    const result = initializeState({
      animals: ['cat', 'dog', 'rat'],
      bar: []
    }, ['animals', 'bar'], {
      animals: {
        value: ['hog', 'pig', 'doe']
      },
      bar: {
        value: [{deeper: 42}]
      }
    });
    expect(result)
      .toBeA('object')
      .toEqual({
        animals: {
          initial: ['cat', 'dog', 'rat'],
          value: ['cat', 'dog', 'rat'],
          _isFieldValue: true
        },
        bar: {
          initial: [],
          value: [],
          _isFieldValue: true
        }
      });
    expect(isFieldValue(result.animals)).toBe(true);
    expect(isFieldValue(result.bar)).toBe(true);
  });

  it('should initialize object values to state', () => {
    const result = initializeState({
      foo: {bar: 'baz'},
      lives: {cat: 9},
      alive: true
    }, ['foo', 'lives'], {});
    expect(result)
      .toBeA('object')
      .toEqual({
        foo: {
          initial: {bar: 'baz'},
          value: {bar: 'baz'},
          _isFieldValue: true
        },
        lives: {
          initial: {cat: 9},
          value: {cat: 9},
          _isFieldValue: true
        }
      });
    expect(isFieldValue(result.foo)).toBe(true);
    expect(isFieldValue(result.lives)).toBe(true);
  });
});
