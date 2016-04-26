import expect from 'expect'
import partial from '../partial'

describe('partial', () => {
  it('should bind first argument', () => {
    const greet = (greeting, name) => `${greeting} ${name}`
    const sayHelloTo = partial(greet, 'hello')
    expect(sayHelloTo).toBeA('function')
    expect(sayHelloTo('fred')).toBe('hello fred')
  })

  it('should bind more than one argument', () => {
    const add = (a, b, c, d) => a + b + c + d
    const add234 = partial(add, 2, 3, 4)
    expect(add234).toBeA('function')
    expect(add234(5)).toBe(14)
  })
})
