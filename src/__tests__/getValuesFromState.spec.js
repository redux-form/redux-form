import expect from 'expect';
import {makeFieldValue} from '../fieldValue';
import getValuesFromState from '../getValuesFromState';

describe('getValuesFromState', () => {
  it('should get simple values from state', () => {
    const state = {
      foo: makeFieldValue({value: 'bar'}),
      catLives: makeFieldValue({value: 9}),
      alive: makeFieldValue({value: true}),
      value: makeFieldValue({value: 'value'})
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: 'bar',
        catLives: 9,
        alive: true,
        value: 'value'
      });
  });

  it('should understand undefined values that have only been touched', () => {
    const state = {
      foo: makeFieldValue({value: 'dog', touched: true}),
      bar: makeFieldValue({touched: true}),
      baz: makeFieldValue({touched: true})
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: 'dog'
      });
  });

  it('should get deep values from state', () => {
    const state = {
      foo: {
        bar: makeFieldValue({value: 'baz'})
      },
      lives: {
        cat: makeFieldValue({value: 9})
      },
      alive: makeFieldValue({value: true})
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: {
          bar: 'baz'
        },
        lives: {
          cat: 9
        },
        alive: true
      });
  });

  it('should get date values from state', () => {
    const date1 = new Date();
    const date2 = new Date(date1.getTime() + 1);
    const state = {
      time1: {
        value: date1
      },
      time2: {
        value: date2
      }
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        time1: date1,
        time2: date2
      });
  });

  it('should get undefined values from state', () => {
    const state = {
      foo: {
        value: undefined
      },
      bar: {
        value: undefined
      }
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({});
  });

  it('should get null values from state', () => {
    const state = {
      foo: {
        value: null
      },
      bar: {
        value: null
      }
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: null,
        bar: null
      });
  });

  it('should get empty string values from state', () => {
    const state = {
      foo: {
        value: ''
      },
      bar: {
        value: ''
      }
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: '',
        bar: ''
      });
  });

  it('should get array values from state', () => {
    const state = {
      foo: [
        makeFieldValue({value: 'bar'}),
        makeFieldValue({value: 'baz'}),
        {}
      ],
      alive: makeFieldValue({value: true})
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: ['bar', 'baz', undefined],
        alive: true
      });
  });

  it('should allow an array to be empty', () => {
    const state = {
      foo: []
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({foo: []});
  });

  it('should get deep array values from state', () => {
    const state = {
      foo: {
        animals: [
          makeFieldValue({value: 'cat'}),
          makeFieldValue({value: 'dog'}),
          makeFieldValue({value: 'rat'})
        ]
      },
      bar: [
        {
          deeper: {
            value: 42
          }
        }
      ]
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: {
          animals: ['cat', 'dog', 'rat']
        },
        bar: [{deeper: 42}]
      });
  });

  it('should ignore values starting with _', () => {
    const state = {
      foo: {
        value: 'dog'
      },
      bar: {
        value: 'cat'
      },
      _someMetaValue: 'rat'
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: 'dog',
        bar: 'cat'
      });
  });

  it('should ignore visited fields without values', () => {
    const state = {
      foo: {
        value: 'dog'
      },
      bar: {
        visited: true
      }
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: 'dog'
      });
  });

  it('should get deep array of objects from state', () => {
    const state = {
      foo: {
        animals: [
          {key: makeFieldValue({value: 'k1'}), value: makeFieldValue({value: 'v1'})},
          {key: makeFieldValue({value: 'k2'}), value: makeFieldValue({value: 'v2'})},
        ]
      }
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: {
          animals: [{key: 'k1', value: 'v1'}, {key: 'k2', value: 'v2'}]
        }
      });
  });
});
