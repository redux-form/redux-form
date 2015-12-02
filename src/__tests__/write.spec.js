import expect from 'expect';
import write from '../write';

describe('write', () => {
  it('should put simple values', () => {
    const data = {};
    const data1 = write('foo', 'bar', data);
    expect(data1.foo).toBe('bar');
    const data2 = write('foo', 7, data);
    expect(data2.foo).toBe(7);
    const data3 = write('foo', true, data);
    expect(data3.foo).toBe(true);
  });

  it('should create structure for arbitrarily deep dotted values', () => {
    const data1 = write('foo.bar', 'baz', {});
    expect(data1.foo.bar).toBe('baz');
    const data2 = write('foo.bar.dog', 7, {});
    expect(data2.foo.bar.dog).toBe(7);
    const data3 = write('foo.bar.dog.cat', true, {});
    expect(data3.foo.bar.dog.cat).toBe(true);
  });

  it('should throw an error when array syntax is broken', () => {
    expect(() => {
      write('foo[dog', 42, {});
    }).toThrow(/found/);
  });

  it('should put simple array values', () => {
    const data1 = write('cat[0]', 'foo', {});
    expect(data1.cat).toBeA('array');
    expect(data1.cat[0]).toBe('foo');
    const data2 = write('dog[2]', 'rabbit', {});
    expect(data2.dog).toBeA('array');
    expect(data2.dog[2]).toBe('rabbit');
  });

  it('should put simple indexless array values', () => {
    const data = write('cat[]', 'meow', {
      cat: [1, 2, 3, 4]
    });
    console.info('data', data);
    expect(data.cat)
      .toBeA('array')
      .toEqual(['meow', 'meow', 'meow', 'meow']);
  });

  it('should put properties on array values', () => {
    const data1 = write('cat[0].name', 'foo', {});
    expect(data1.cat).toBeA('array');
    expect(data1.cat[0]).toBeA('object');
    expect(data1.cat[0].name).toBe('foo');
    const data2 = write('dog[2].friend', 'rabbit', {});
    expect(data2.dog).toBeA('array');
    expect(data2.dog[2]).toBeA('object');
    expect(data2.dog[2].friend).toBe('rabbit');
  });

  it('should put properties on array values for index-less paths', () => {
    const data1 = write('cat[].name', 'foo', {
      cat: [
        {name: 'fido'},
        {name: 'whiskers'}
      ]
    });
    expect(data1.cat).toBeA('array');
    expect(data1.cat[0]).toBeA('object');
    expect(data1.cat[0].name).toBe('foo');
    expect(data1.cat[1]).toBeA('object');
    expect(data1.cat[1].name).toBe('foo');
  });

  it('should put complex array values', () => {
    const data = write('cat[0].dog[7].rabbit.fox', 'wolf', {});
    expect(data.cat).toBeA('array');
    expect(data.cat[0]).toBeA('object');
    expect(data.cat[0].dog).toBeA('array');
    expect(data.cat[0].dog[7]).toBeA('object');
    expect(data.cat[0].dog[7].rabbit).toBeA('object');
    expect(data.cat[0].dog[7].rabbit.fox).toBe('wolf');
  });

  it('should only modify values along path', () => {
    const initial = {
      a: {
        b: 4
      },
      c: {
        d: 5,
        e: {
          f: 6,
          g: {
            h: 9
          }
        }
      },
      i: 10,
      j: [
        {
          k: 8
        },
        {
          l: 9
        }
      ]
    };
    const backup = {...initial};
    const result1 = write('a.b', 'dog', initial);
    expect(backup).toEqual(initial);  // initial not mutated
    expect(result1.a).toNotBe(initial.a);
    expect(result1.a.b).toBe('dog');
    expect(result1.c).toBe(initial.c);
    expect(result1.i).toBe(initial.i);
    expect(result1.j).toBe(initial.j);
    const result2 = write('c.e.g.h', 'dog', initial);
    expect(backup).toEqual(initial);  // initial not mutated
    expect(result2.a).toBe(initial.a);
    expect(result2.c).toNotBe(initial.c);
    expect(result2.c.e).toNotBe(initial.c.e);
    expect(result2.c.e.g).toNotBe(initial.c.e.i);
    expect(result2.c.e.g.h).toBe('dog');
    expect(result2.i).toBe(initial.i);
    expect(result2.j).toBe(initial.j);
    const result3 = write('j[1].l', 'dog', initial);
    expect(backup).toEqual(initial);  // initial not mutated
    expect(result3.a).toBe(initial.a);
    expect(result3.c).toBe(initial.c);
    expect(result3.i).toBe(initial.i);
    expect(result3.j).toNotBe(initial.j);
    expect(result3.j[0]).toBe(initial.j[0]);
    expect(result3.j[1]).toNotBe(initial.j[1]);
    expect(result3.j[1].l).toBe('dog');
  });

  it('should use mutator if value is function', () => {
    const result1 = write('foo', value => value + 'bar', {foo: 'candy'});
    expect(result1.foo).toBe('candybar');

    const result2 = write('foo.bar.dog', value => value * 2, {
      foo: {
        bar: {
          'dog': 4
        }
      }
    });
    expect(result2.foo.bar.dog).toBe(8);

    const result3 = write('foo.bar', value => ({...value, cat: 5, rat: 6}), {
      foo: {
        bar: {
          dog: 4
        }
      }
    });
    expect(result3.foo.bar).toEqual({
      dog: 4,
      cat: 5,
      rat: 6
    });

    const result4 = write('foo', value => value.map(num => num * 2), {foo: [1, 2, 3, 4, 5]});
    expect(result4.foo).toEqual([2, 4, 6, 8, 10]);
  });
});
