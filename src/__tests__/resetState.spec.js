import expect from 'expect';
import resetState from '../resetState';
import {isFieldValue, makeFieldValue} from '../fieldValue';

describe('resetState', () => {
  it('should return empty if no values', () => {
    expect(resetState({})).toEqual({});
  });

  it('should reset simple values', () => {
    const result = resetState({
      foo: makeFieldValue({
        initial: 'dog',
        value: 'cat'
      }),
      bar: makeFieldValue({
        initial: 'rat',
        value: 'pig'
      }),
      baz: makeFieldValue({
        initial: 'hog',
        value: 'bun'
      })
    });
    expect(result)
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
    expect(isFieldValue(result.foo)).toBe(true);
    expect(isFieldValue(result.bar)).toBe(true);
    expect(isFieldValue(result.baz)).toBe(true);
  });

  it('should reset deep values', () => {
    const result = resetState({
      foo: {
        bar: makeFieldValue({
          initial: 'dog',
          value: 'cat'
        })
      },
      baz: {
        chad: makeFieldValue({
          initial: 'fun',
          value: 'bun'
        }),
        chaz: makeFieldValue({
          value: 'shouldbesettoundefined'
        })
      }
    });
    expect(result)
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
    expect(isFieldValue(result.foo.bar)).toBe(true);
    expect(isFieldValue(result.baz.chad)).toBe(true);
    expect(isFieldValue(result.baz.chaz)).toBe(true);
  });

  it('should reset array values', () => {
    const result = resetState({
      foo: [
        makeFieldValue({
          initial: 'cat',
          value: 'dog'
        }),
        makeFieldValue({
          initial: 'rat',
          value: 'pig'
        }),
        makeFieldValue({
          value: 'shouldbesettoundefined'
        })
      ]
    });
    expect(result)
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
    expect(isFieldValue(result.foo[0])).toBe(true);
    expect(isFieldValue(result.foo[1])).toBe(true);
    expect(isFieldValue(result.foo[2])).toBe(true);
  });

  it('should reset deep array values with key "value"', () => {
    const result = resetState({
      myValues: [
        {
          value: makeFieldValue({
            initial: 'cat',
            value: 'rat'
          })
        },
        {
          value: makeFieldValue({
            initial: 'pig',
            value: 'hog'
          })
        }
      ]
    });
    expect(result)
      .toBeA('object')
      .toEqual({
        myValues: [
          {
            value: {
              initial: 'cat',
              value: 'cat'
            }
          },
          {
            value: {
              initial: 'pig',
              value: 'pig'
            }
          }
        ]
      });
    expect(isFieldValue(result.myValues[0].value)).toBe(true);
    expect(isFieldValue(result.myValues[1].value)).toBe(true);
  });

  it('should allow an array to be empty', () => {
    const result = resetState({
      foo: []
    });
    expect(result)
      .toBeA('object')
      .toEqual({foo: []});
  });
});
