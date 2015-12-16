import expect from 'expect';
import initializeState from '../initializeState';

describe('initializeState', () => {
  it('should throw error when no fields passed', () => {
    expect(() => initializeState({}, undefined, {})).toThrow(/fields must be passed/);
  });

  it('should return empty if no fields', () => {
    expect(initializeState({}, [], {})).toEqual({});
  });

  it('should return empty field entries for each field', () => {
    expect(initializeState({}, ['foo', 'bar'], {})).toEqual({foo: {}, bar: {}});
  });

  it('should initialize simple field values to state', () => {
    expect(initializeState({
      foo: 'bar',
      catLives: 9,
      alive: true
    }, ['foo', 'catLives', 'alive'], {}))
      .toBeA('object')
      .toEqual({
        foo: {
          initial: 'bar',
          value: 'bar'
        },
        catLives: {
          initial: 9,
          value: 9
        },
        alive: {
          initial: true,
          value: true
        }
      });
  });

  it('should initialize deep field values to state', () => {
    expect(initializeState({
      foo: {
        bar: 'baz'
      },
      lives: {
        cat: 9
      },
      alive: true
    }, ['foo.bar', 'lives.cat', 'alive'], {}))
      .toBeA('object')
      .toEqual({
        foo: {
          bar: {
            initial: 'baz',
            value: 'baz'
          }
        },
        lives: {
          cat: {
            initial: 9,
            value: 9
          }
        },
        alive: {
          initial: true,
          value: true
        }
      });
  });

  it('should initialize array field values to state', () => {
    expect(initializeState({
      foo: ['bar', 'baz', undefined],
      alive: true
    }, ['foo[]', 'alive'], {}))
      .toBeA('object')
      .toEqual({
        foo: [
          {
            initial: 'bar',
            value: 'bar'
          },
          {
            initial: 'baz',
            value: 'baz'
          },
          {}
        ],
        alive: {
          initial: true,
          value: true
        }
      });
  });

  it('should allow an array field to be empty', () => {
    expect(initializeState({
      foo: []
    }, ['foo[]'], {}))
      .toBeA('object')
      .toEqual({foo: []});
  });

  it('should initialize array values to state', () => {
    expect(initializeState({
      animals: ['cat', 'dog', 'rat'],
      bar: [{deeper: 42}]
    }, ['animals', 'bar'], {}))
      .toBeA('object')
      .toEqual({
        animals: {
          initial: ['cat', 'dog', 'rat'],
          value: ['cat', 'dog', 'rat']
        },
        bar: {
          initial: [{deeper: 42}],
          value: [{deeper: 42}]
        }
      });
  });

  it('should initialize array values to state, not changing existing values', () => {
    expect(initializeState({
      animals: ['cat', 'dog', 'rat'],
      bar: []
    }, ['animals', 'bar'], {
      bar: {
        value: [{deeper: 42}] // <---------- array would be under value key
      }
    }))
      .toBeA('object')
      .toEqual({
        animals: {
          initial: ['cat', 'dog', 'rat'],
          value: ['cat', 'dog', 'rat']
        },
        bar: {
          initial: [],
          value: [{deeper: 42}]
        }
      });
  });

  it('should initialize object values to state', () => {
    expect(initializeState({
      foo: {bar: 'baz'},
      lives: {cat: 9},
      alive: true
    }, ['foo', 'lives'], {}))
      .toBeA('object')
      .toEqual({
        foo: {
          initial: {bar: 'baz'},
          value: {bar: 'baz'}
        },
        lives: {
          initial: {cat: 9},
          value: {cat: 9}
        }
      });
  });
});
