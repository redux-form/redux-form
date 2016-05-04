import expect from 'expect'
import partialRight from '../partialRight'

describe('partialRight', () => {
  it('should bind last argument', () => {
    const greet = (greeting, name) => `${greeting} ${name}`
    const greetFred = partialRight(greet, 'fred')
    expect(greetFred).toBeA('function')
    expect(greetFred('hello')).toBe('hello fred')
  })

  it('should bind more than one argument', () => {
    const add = (a, b, c, d) => a + b + c + d
    const add345 = partialRight(add, 3, 4, 5)
    expect(add345).toBeA('function')
    expect(add345(2)).toBe(14)
  })
})
