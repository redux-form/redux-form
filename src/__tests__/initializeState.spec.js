import expect from 'expect';
import initializeState from '../initializeState';

describe('initializeState', () => {
  it('should return empty if no values', () => {
    expect(initializeState({})).toEqual({});
  });

  it('should initialize simple values to state', () => {
    expect(initializeState({
      foo: 'bar',
      catLives: 9,
      alive: true
    }))
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

  it('should initialize deep values to state', () => {
    expect(initializeState({
      foo: {
        bar: 'baz'
      },
      lives: {
        cat: 9
      },
      alive: true
    }))
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

  it('should initialize array values to state', () => {
    expect(initializeState({
      foo: ['bar', 'baz', undefined],
      alive: true
    }))
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

  it('should allow an array to be empty', () => {
    expect(initializeState({
      foo: []
    }))
      .toBeA('object')
      .toEqual({foo: []});
  });

  it('should initialize deep array values to state', () => {
    expect(initializeState({
      foo: {
        animals: ['cat', 'dog', 'rat']
      },
      bar: [{deeper: 42}]
    }))
      .toBeA('object')
      .toEqual({
        foo: {
          animals: [
            {
              initial: 'cat',
              value: 'cat'
            },
            {
              initial: 'dog',
              value: 'dog'
            },
            {
              initial: 'rat',
              value: 'rat'
            }
          ]
        },
        bar: [
          {
            deeper: {
              initial: 42,
              value: 42
            }
          }
        ]
      });
  });
});
