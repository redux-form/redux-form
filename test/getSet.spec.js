import expect from 'expect';
import {getIn, setIn} from '../src/getSet';

describe('setIn / getIn', () => {
  it('should handle empty path as value', () => {
    expect(setIn({}, [], 'bar')).toEqual('bar');
  });

  it('should assign flat path', () => {
    const obj = setIn({'foo': 'bar'}, ['baz'], 'qux');
    expect(obj).toEqual({
      foo: 'bar',
      baz: 'qux'
    });
    expect(Object.keys(obj).length).toEqual(2);
    expect(getIn(obj, ['foo'])).toEqual('bar');
    expect(getIn(obj, ['baz'])).toEqual('qux');
    expect(getIn(obj, ['none'])).toEqual(undefined);
  });

  it('should handle non existance nested paths', () => {
    const obj = setIn({'foo': 'bar'}, ['l1', 'l2', 'l3'], 'baz');
    expect(Object.keys(obj).length).toEqual(2);
    expect(obj).toEqual({
      foo: 'bar',
      l1: {
        l2: {
          l3: 'baz'
        }
      }
    });
    expect(getIn(obj, ['foo'])).toEqual('bar');
    expect(getIn(obj, ['l1'])).toEqual({
      'l2': {l3: 'baz'}
    });
    expect(getIn(obj, ['l1', 'l2'])).toEqual({
      l3: 'baz'
    });
    expect(getIn(obj, ['l1', 'l2', 'l3'])).toEqual('baz');
  });

  it('should handle object as value', () => {
    const obj = setIn({'foo': 'bar'}, ['baz'], {'qux': {1: 'v1', 2: 'v2'}});
    expect(obj).toEqual({
      foo: 'bar',
      baz: {
        qux: {
          1: 'v1',
          2: 'v2'
        }
      }
    });
  });
});