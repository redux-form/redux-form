import expect from 'expect';
import getValues from '../getValues';

describe('getValues', () => {
  it('should get values from form', () => {
    const form = {
      foo: {value: 'bar'},
      catLives: {value: 9},
      alive: {value: true},
      'shipping.street': {value: 'Yuhang road'},
      'items[0].name': {value: 'Lego'},
      'items[0].amount': {value: 10},
    };
    const fields = ['foo', 'catLives', 'alive', 'shipping.street', 'items[0].name', 'items[0].amount'];
    expect(getValues(fields, form))
      .toBeA('object')
      .toEqual({
        foo: 'bar',
        catLives: 9,
        alive: true,
        shipping: {
          street: 'Yuhang road'
        },
        items: [
          {name: 'Lego', amount: 10}
        ]
      });
  });
});
