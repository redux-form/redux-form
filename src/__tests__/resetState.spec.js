import expect from 'expect';
import resetState from '../resetState';

describe('resetState', () => {
  it('should return empty if no values', () => {
    expect(resetState({})).toEqual({});
  });

  it('should reset simple values', () => {
    expect(resetState({
      foo: {
        initial: 'dog',
        value: 'cat'
      },
      bar: {
        initial: 'rat',
        value: 'pig'
      },
      baz: {
        initial: 'hog',
        value: 'bun'
      }
    }))
      .toBeA('object')
      .toEqual({
        foo: {
          initial: 'dog',
          value: 'dog'
        },
        bar: {
          initial: 'rat',
          value: 'rat'
        },
        baz: {
          initial: 'hog',
          value: 'hog'
        }
      });
  });

  it('should reset deep values', () => {
    expect(resetState({
      foo: {
        bar: {
          initial: 'dog',
          value: 'cat'
        }
      },
      baz: {
        chad: {
          initial: 'fun',
          value: 'bun'
        },
        chaz: {
          value: 'shouldbesettoundefined'
        }
      }
    }))
      .toBeA('object')
      .toEqual({
        foo: {
          bar: {
            initial: 'dog',
            value: 'dog'
          }
        },
        baz: {
          chad: {
            initial: 'fun',
            value: 'fun'
          },
          chaz: {}
        }
      });
  });

  it('should reset array values', () => {
    expect(resetState({
      foo: [
        {
          initial: 'cat',
          value: 'dog'
        },
        {
          initial: 'rat',
          value: 'pig'
        },
        {
          value: 'shouldbesettoundefined'
        }
      ]
    }))
      .toBeA('object')
      .toEqual({
        foo: [
          {
            initial: 'cat',
            value: 'cat'
          },
          {
            initial: 'rat',
            value: 'rat'
          },
          {}
        ]
      });
  });

  it('should allow an array to be empty', () => {
    expect(resetState({
      foo: []
    }))
      .toBeA('object')
      .toEqual({foo: []});
  });
});
