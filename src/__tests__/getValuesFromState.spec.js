import expect from 'expect';
import getValuesFromState from '../getValuesFromState';

describe('getValuesFromState', () => {
  it('should get simple values from state', () => {
    const state = {
      foo: {value: 'bar'},
      catLives: {value: 9},
      alive: {value: true}
    };
    expect(getValuesFromState(state))
      .toBeA('object')
      .toEqual({
        foo: 'bar',
        catLives: 9,
        alive: true
      });
  });

  it('should get deep values from state', () => {
    const state = {
      foo: {
        bar: {value: 'baz'}
      },
      lives: {
        cat: {value: 9}
      },
      alive: {value: true}
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
        {value: 'bar'},
        {value: 'baz'},
        {}
      ],
      alive: {value: true}
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
          {value: 'cat'},
          {value: 'dog'},
          {value: 'rat'}
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
});
