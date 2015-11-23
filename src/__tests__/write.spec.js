import expect from 'expect';
import write from '../write';

describe('write', () => {
  it('should put simple values', () => {
    const data = {};
    write('foo', 'bar', data);
    expect(data.foo).toBe('bar');
    write('foo', 7, data);
    expect(data.foo).toBe(7);
    write('foo', true, data);
    expect(data.foo).toBe(true);
  });

  it('should create structure for arbitrarily deep dotted values', () => {
    let data = {};
    write('foo.bar', 'baz', data);
    expect(data.foo.bar).toBe('baz');
    data = {};
    write('foo.bar.dog', 7, data);
    expect(data.foo.bar.dog).toBe(7);
    data = {};
    write('foo.bar.dog.cat', true, data);
    expect(data.foo.bar.dog.cat).toBe(true);
  });

  it('should throw an error when array syntax is broken', () => {
    expect(() => {
      write('foo[dog', 42, {});
    }).toThrow(/found/);
  });

  it('should put simple array values', () => {
    let data = {};
    write('cat[0]', 'foo', data);
    expect(data.cat).toBeA('array');
    expect(data.cat[0]).toBe('foo');
    data = {};
    write('dog[2]', 'rabbit', data);
    expect(data.dog).toBeA('array');
    expect(data.dog[2]).toBe('rabbit');
  });

  it('should put complex array values', () => {
    let data = {};
    write('cat[0].dog[7].rabbit.fox', 'wolf', data);
    expect(data.cat).toBeA('array');
    expect(data.cat[0]).toBeA('object');
    expect(data.cat[0].dog).toBeA('array');
    expect(data.cat[0].dog[7]).toBeA('object');
    expect(data.cat[0].dog[7].rabbit).toBeA('object');
    expect(data.cat[0].dog[7].rabbit.fox).toBe('wolf');
  });
});
