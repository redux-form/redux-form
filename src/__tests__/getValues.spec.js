import expect from 'expect';
import getValues from '../getValues';

describe('getValues', () => {
  it('should get values from form', () => {
    const form = {
      foo: {value: 'bar'},
      catLives: {value: 9},
      alive: {value: true}
    };
    const fields = ['foo', 'catLives', 'alive'];
    expect(getValues(fields, form))
      .toBeA('object')
      .toEqual({
        foo: 'bar',
        catLives: 9,
        alive: true
      });
  });
});
