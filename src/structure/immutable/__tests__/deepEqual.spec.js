import deepEqual from '../deepEqual'
import { fromJS } from 'immutable'
import expectations from '../expectations'
import addExpectations from '../../../__tests__/addExpectations'

describe('structure.immutable.deepEqual', () => {
  const expect = addExpectations(expectations)

  const testBothWays = (a, b, expectation) => {
    expect(deepEqual(a, b)).toBe(expectation)
    expect(deepEqual(b, a)).toBe(expectation)
  }

  it('should work with nested Immutable.Maps', () => {
    testBothWays(fromJS({
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }), fromJS({
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }), true)
    testBothWays(fromJS({
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }), fromJS({
      a: {
        b: {
          c: 42
        },
        d: 2,
        e: 3
      },
      f: 4
    }), false)
  })

  it('should work with plain objects', () => {
    testBothWays({
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }, {
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }, true)
    testBothWays({
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }, {
      a: {
        b: {
          c: 42
        },
        d: 2,
        e: 3
      },
      f: 4
    }, false)
  })

  it('should work with plain objects inside Immutable.Maps', () => {
    testBothWays(fromJS({
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }).setIn('a.b.g', { h: { i: 29 } }), fromJS({
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }).setIn('a.b.g', { h: { i: 29 } }), true)
    testBothWays(fromJS({
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }).setIn('a.b.g', { h: { i: 29 } }), fromJS({
      a: {
        b: {
          c: 1
        },
        d: 2,
        e: 3
      },
      f: 4
    }).setIn('a.b.g', { h: { i: 30 } }), false)
  })

  it('should work with Immutable.Maps inside plain objects', () => {
    testBothWays({
      a: {
        b: {
          c: fromJS({
            h: {
              i: 29
            }
          })
        },
        d: 2,
        e: 3
      },
      f: 4
    }, {
      a: {
        b: {
          c: fromJS({
            h: {
              i: 29
            }
          })
        },
        d: 2,
        e: 3
      },
      f: 4
    }, true)
    testBothWays({
      a: {
        b: {
          c: fromJS({
            h: {
              i: 29
            }
          })
        },
        d: 2,
        e: 3
      },
      f: 4
    }, {
      a: {
        b: {
          c: fromJS({
            h: {
              i: 30
            }
          })
        },
        d: 2,
        e: 3
      },
      f: 4
    }, false)
  })

  it('should work with plain objects with cycles', () => {
    // Set up cyclical structures:
    //
    // base1, base2 {
    //   a: 1,
    //   deep: {
    //     b: 2,
    //     base: {
    //       a: 1,
    //       deep: { ... }
    //     }
    //   }
    // }

    let base1 = { a: 1 }
    let deep1 = { b: 2, base: base1 }
    base1.deep = deep1

    let base2 = { a: 1 }
    let deep2 = { b : 2, base: base2 }
    base2.deep = deep2

    testBothWays(base1, base2, true)
  })

  it('should treat undefined and \'\' as equal', () => {
    testBothWays(fromJS({
      a: {
        b: ''
      }
    }), fromJS({
      a: {
        b: undefined
      }
    }), true)
  })
})

