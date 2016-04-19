import deepEqual from '../deepEqual'
import { fromJS } from 'immutable'
import expectations from '../expectations'
import addExpectations from '../../../__tests__/addExpectations'

describe('structure.immutable.deepEqual', () => {
  const expect = addExpectations(expectations)

  it('work with nested Immutable.Maps', () => {
    expect(deepEqual(fromJS({
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
    }))).toBe(true)
    expect(deepEqual(fromJS({
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
    }))).toBe(false)
  })

  it('work with plain objects', () => {
    expect(deepEqual({
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
    })).toBe(true)
    expect(deepEqual({
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
    })).toBe(false)
  })

  it('work with plain objects inside Immutable.Maps', () => {
    expect(deepEqual(fromJS({
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
    }).setIn('a.b.g', { h: { i: 29 } }))).toBe(true)
    expect(deepEqual(fromJS({
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
    }).setIn('a.b.g', { h: { i: 30 } }))).toBe(false)
  })

  it('work with Immutable.Maps inside plain objects', () => {
    expect(deepEqual({
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
    })).toBe(true)
    expect(deepEqual({
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
    })).toBe(false)
  })
})

