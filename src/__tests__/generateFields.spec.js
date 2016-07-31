/*
 EXPERIMENTAL

import expect, { createSpy } from 'expect'
import generateFields from '../generateFields'

const createSpies = () => ({
  createField: createSpy(key => ({ key })).andCallThrough(),
  createArray: createSpy((key, initial = []) => {
    initial.key = key
    return initial
  }).andCallThrough()
})

describe('generateFields', () => {
  it('should return an empty tree if no fields or values', () => {
    const { createField, createArray } = createSpies()
    expect(generateFields(
      undefined,
      undefined,
      undefined,
      createField,
      createArray
    )).toEqual({})
    expect(createField).toNotHaveBeenCalled()
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should initialize simple fields with no values', () => {
    const { createField, createArray } = createSpies()
    expect(generateFields(
      [ 'a', 'b', 'c' ],
      undefined,
      undefined,
      createField,
      createArray))
      .toEqual({
        a: { key: 'a' },
        b: { key: 'b' },
        c: { key: 'c' }
      })
    expect(createField).toHaveBeenCalled()
    expect(createField.calls.length).toBe(3)
    expect(createField.calls[ 0 ].arguments).toEqual([ 'a' ])
    expect(createField.calls[ 1 ].arguments).toEqual([ 'b' ])
    expect(createField.calls[ 2 ].arguments).toEqual([ 'c' ])
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should initialize simple fields with values', () => {
    const { createField, createArray } = createSpies()
    expect(generateFields(
      [ 'a', 'b', 'c' ],
      undefined,
      {
        a: 'dog',
        b: 'cat',
        c: 'pig'
      },
      createField,
      createArray))
      .toEqual({
        a: { key: 'a' },
        b: { key: 'b' },
        c: { key: 'c' }
      })
    expect(createField).toHaveBeenCalled()
    expect(createField.calls.length).toBe(3)
    expect(createField.calls[ 0 ].arguments).toEqual([ 'a' ])
    expect(createField.calls[ 1 ].arguments).toEqual([ 'b' ])
    expect(createField.calls[ 2 ].arguments).toEqual([ 'c' ])
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should not mutate simple fields with no changes', () => {
    const { createField, createArray } = createSpies()
    const tree = {
      a: { key: 'a' },
      b: { key: 'b' },
      c: { key: 'c' }
    }
    const result = generateFields(
      [ 'a', 'b', 'c' ],
      tree,
      {
        a: 'dog',
        b: 'cat',
        c: 'pig'
      },
      createField,
      createArray)
    expect(result).toBe(tree)
    expect(result.a).toBe(tree.a)
    expect(result.b).toBe(tree.b)
    expect(result.c).toBe(tree.c)
    expect(createField).toNotHaveBeenCalled()
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should only mutate simple fields changed branch', () => {
    const { createField, createArray } = createSpies()
    const tree = {
      a: { key: 'a' },
      b: { key: 'b' },
      c: { key: 'c' }
    }
    const result = generateFields(
      [ 'a', 'b', 'c', 'd' ],
      tree,
      {
        a: 'dog',
        b: 'cat',
        c: 'pig'
      },
      createField,
      createArray)
    expect(result).toEqual({
      a: { key: 'a' },
      b: { key: 'b' },
      c: { key: 'c' },
      d: { key: 'd' }
    })
    expect(result).toNotBe(tree)
    expect(result.a).toBe(tree.a)
    expect(result.b).toBe(tree.b)
    expect(result.c).toBe(tree.c)
    expect(createField).toHaveBeenCalled()
    expect(createField.calls.length).toBe(1)
    expect(createField.calls[ 0 ].arguments).toEqual([ 'd' ])
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should initialize deep fields with no values', () => {
    const { createField, createArray } = createSpies()
    expect(generateFields(
      [ 'deep.a', 'deep.b', 'other.c' ],
      undefined,
      undefined,
      createField,
      createArray))
      .toEqual({
        deep: {
          a: { key: 'deep.a' },
          b: { key: 'deep.b' }
        },
        other: {
          c: { key: 'other.c' }
        }
      })
    expect(createField).toHaveBeenCalled()
    expect(createField.calls.length).toBe(3)
    expect(createField.calls[ 0 ].arguments).toEqual([ 'deep.a' ])
    expect(createField.calls[ 1 ].arguments).toEqual([ 'deep.b' ])
    expect(createField.calls[ 2 ].arguments).toEqual([ 'other.c' ])
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should initialize deep fields with values', () => {
    const { createField, createArray } = createSpies()
    expect(generateFields(
      [ 'deep.a', 'deep.b', 'other.c' ],
      undefined,
      {
        deep: {
          a: 'dog',
          b: 'cat'
        },
        other: {
          c: 'pig'
        }
      },
      createField,
      createArray))
      .toEqual({
        deep: {
          a: { key: 'deep.a' },
          b: { key: 'deep.b' }
        },
        other: {
          c: { key: 'other.c' }
        }
      })
    expect(createField).toHaveBeenCalled()
    expect(createField.calls.length).toBe(3)
    expect(createField.calls[ 0 ].arguments).toEqual([ 'deep.a' ])
    expect(createField.calls[ 1 ].arguments).toEqual([ 'deep.b' ])
    expect(createField.calls[ 2 ].arguments).toEqual([ 'other.c' ])
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should not mutate deep fields with no changes', () => {
    const { createField, createArray } = createSpies()
    const tree = {
      deep: {
        a: { key: 'deep.a' },
        b: { key: 'deep.b' }
      },
      other: {
        c: { key: 'other.c' }
      }
    }
    const result = generateFields(
      [ 'deep.a', 'deep.b', 'other.c' ],
      tree,
      {
        deep: {
          a: 'dog',
          b: 'cat'
        },
        other: {
          c: 'pig'
        }
      },
      createField,
      createArray)
    expect(result).toBe(tree)
    expect(result.deep).toBe(tree.deep)
    expect(result.deep.a).toBe(tree.deep.a)
    expect(result.deep.b).toBe(tree.deep.b)
    expect(result.other).toBe(tree.other)
    expect(result.other.c).toBe(tree.other.c)
    expect(createField).toNotHaveBeenCalled()
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should only mutate deep fields changed branch', () => {
    const { createField, createArray } = createSpies()
    const tree = {
      deep: {
        a: { key: 'deep.a' },
        b: { key: 'deep.b' }
      },
      other: {
        c: { key: 'other.c' }
      }
    }
    const result = generateFields(
      [ 'deep.a', 'deep.b', 'other.c', 'other.d' ],
      tree,
      {
        deep: {
          a: 'dog',
          b: 'cat'
        },
        other: {
          c: 'pig'
        }
      },
      createField,
      createArray)
    expect(result).toEqual({
      deep: {
        a: { key: 'deep.a' },
        b: { key: 'deep.b' }
      },
      other: {
        c: { key: 'other.c' },
        d: { key: 'other.d' }
      }
    })
    expect(result).toNotBe(tree)
    expect(result.deep).toBe(tree.deep)
    expect(result.deep.a).toBe(tree.deep.a)
    expect(result.deep.b).toBe(tree.deep.b)
    expect(result.other).toNotBe(tree.other)
    expect(result.other.c).toBe(tree.other.c)
    expect(createField).toHaveBeenCalled()
    expect(createField.calls.length).toBe(1)
    expect(createField.calls[ 0 ].arguments).toEqual([ 'other.d' ])
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should initialize array fields with no values', () => {
    const { createField, createArray } = createSpies()
    expect(generateFields(
      [ 'a[]', 'b[].c', 'd.e[]' ],
      undefined,
      undefined,
      createField,
      createArray))
      .toEqual({
        a: [],
        b: [],
        d: {
          e: []
        }
      })
    expect(createField).toNotHaveBeenCalled()
    expect(createArray).toHaveBeenCalled()
    expect(createArray.calls.length).toBe(3)
    expect(createArray.calls[ 0 ].arguments[ 0 ]).toBe('a')
    expect(createArray.calls[ 1 ].arguments[ 0 ]).toBe('b')
    expect(createArray.calls[ 2 ].arguments[ 0 ]).toBe('d.e')
  })

  it('should initialize array fields with values', () => {
    const { createField, createArray } = createSpies()
    const result = generateFields(
      [ 'a[]', 'b[].c', 'd.e[]' ],
      undefined,
      {
        a: [ 'dog' ],
        b: [
          { c: 'rat' },
          { c: 'hog' }
        ],
        d: {
          e: [ 'cow', 'sow' ]
        }
      },
      createField,
      createArray)
    expect(result)
      .toEqual({
        a: [
          { key: 'a[0]' }
        ],
        b: [
          { c: { key: 'b[0].c' } },
          { c: { key: 'b[1].c' } }
        ],
        d: {
          e: [
            { key: 'd.e[0]' },
            { key: 'd.e[1]' }
          ]
        }
      })
    expect(createField).toHaveBeenCalled()
    expect(createField.calls.length).toBe(5)
    expect(createField.calls[ 0 ].arguments[ 0 ]).toBe('a[0]')
    expect(createField.calls[ 1 ].arguments[ 0 ]).toBe('b[0].c')
    expect(createField.calls[ 2 ].arguments[ 0 ]).toBe('b[1].c')
    expect(createField.calls[ 3 ].arguments[ 0 ]).toBe('d.e[0]')
    expect(createField.calls[ 4 ].arguments[ 0 ]).toBe('d.e[1]')
    expect(createArray).toHaveBeenCalled()
    expect(createArray.calls.length).toBe(3)
    expect(createArray.calls[ 0 ].arguments[ 0 ]).toBe('a')
    expect(createArray.calls[ 1 ].arguments[ 0 ]).toBe('b')
    expect(createArray.calls[ 2 ].arguments[ 0 ]).toBe('d.e')
  })

  it('should not mutate array fields with no changes', () => {
    const { createField, createArray } = createSpies()
    const tree = {
      a: [
        { key: 'a[0]' }
      ],
      b: [
        { c: { key: 'b[0].c' } },
        { c: { key: 'b[1].c' } }
      ],
      d: {
        e: [
          { key: 'd.e[0]' },
          { key: 'd.e[1]' }
        ]
      }
    }
    tree.a.key = 'a'
    tree.b.key = 'b'
    tree.d.e.key = 'd.e'
    const result = generateFields(
      [ 'a[]', 'b[].c', 'd.e[]' ],
      tree,
      {
        a: [ 'dog' ],
        b: [
          { c: 'rat' },
          { c: 'hog' }
        ],
        d: {
          e: [ 'cow', 'sow' ]
        }
      },
      createField,
      createArray)
    expect(result).toBe(tree)
    expect(result.a).toBe(tree.a)
    expect(result.a[ 0 ]).toBe(tree.a[ 0 ])
    expect(result.b).toBe(tree.b)
    expect(result.b[ 0 ]).toBe(tree.b[ 0 ])
    expect(result.b[ 0 ].c).toBe(tree.b[ 0 ].c)
    expect(result.b[ 1 ]).toBe(tree.b[ 1 ])
    expect(result.b[ 1 ].c).toBe(tree.b[ 1 ].c)
    expect(result.d).toBe(tree.d)
    expect(result.d.e).toBe(tree.d.e)
    expect(result.d.e[ 0 ]).toBe(tree.d.e[ 0 ])
    expect(result.d.e[ 1 ]).toBe(tree.d.e[ 1 ])
    expect(createField).toNotHaveBeenCalled()
    expect(createArray).toNotHaveBeenCalled()
  })

  it('should only mutate array fields changed branch when elements added', () => {
    const { createField, createArray } = createSpies()
    const tree = {
      a: [
        { key: 'a[0]' }
      ],
      b: [
        { c: { key: 'b[0].c' } },
        { c: { key: 'b[1].c' } }
      ],
      d: {
        e: [
          { key: 'd.e[0]' },
          { key: 'd.e[1]' }
        ]
      }
    }
    tree.a.key = 'a'
    tree.b.key = 'b'
    tree.d.e.key = 'd.e'
    const result = generateFields(
      [ 'a[]', 'b[].c', 'd.e[]' ],
      tree,
      {
        a: [ 'dog' ],
        b: [
          { c: 'rat' },
          { c: 'hog' },
          { c: 'ram' }
        ],
        d: {
          e: [ 'cow', 'sow', 'ewe' ]
        }
      },
      createField,
      createArray)
    expect(result).toNotBe(tree)
    expect(result).toEqual({
      a: [
        { key: 'a[0]' }
      ],
      b: [
        { c: { key: 'b[0].c' } },
        { c: { key: 'b[1].c' } },
        { c: { key: 'b[2].c' } }
      ],
      d: {
        e: [
          { key: 'd.e[0]' },
          { key: 'd.e[1]' },
          { key: 'd.e[2]' }
        ]
      }
    })
    expect(result.a).toBe(tree.a)
    expect(result.a[ 0 ]).toBe(tree.a[ 0 ])
    expect(result.b).toNotBe(tree.b)
    expect(result.b[ 0 ]).toBe(tree.b[ 0 ])
    expect(result.b[ 0 ].c).toBe(tree.b[ 0 ].c)
    expect(result.b[ 1 ]).toBe(tree.b[ 1 ])
    expect(result.b[ 1 ].c).toBe(tree.b[ 1 ].c)
    expect(result.d).toNotBe(tree.d)
    expect(result.d.e).toNotBe(tree.d.e)
    expect(result.d.e[ 0 ]).toBe(tree.d.e[ 0 ])
    expect(result.d.e[ 1 ]).toBe(tree.d.e[ 1 ])
    expect(createField).toHaveBeenCalled()
    expect(createField.calls.length).toBe(2)
    expect(createField.calls[ 0 ].arguments).toEqual([ 'b[2].c' ])
    expect(createField.calls[ 1 ].arguments).toEqual([ 'd.e[2]' ])
    expect(createArray).toHaveBeenCalled()
    expect(createArray.calls.length).toBe(2)
    expect(createArray.calls[ 0 ].arguments[ 0 ]).toBe('b')
    expect(createArray.calls[ 1 ].arguments[ 0 ]).toBe('d.e')
  })

  it('should only mutate array fields changed branch when elements removed', () => {
    const { createField, createArray } = createSpies()
    const tree = {
      a: [
        { key: 'a[0]' }
      ],
      b: [
        { c: { key: 'b[0].c' } },
        { c: { key: 'b[1].c' } }
      ],
      d: {
        e: [
          { key: 'd.e[0]' },
          { key: 'd.e[1]' }
        ]
      }
    }
    tree.a.key = 'a'
    tree.b.key = 'b'
    tree.d.e.key = 'd.e'
    const result = generateFields(
      [ 'a[]', 'b[].c', 'd.e[]' ],
      tree,
      {
        a: [ 'dog' ],
        b: [
          { c: 'rat' }
        ],
        d: {
          e: [ 'cow' ]
        }
      },
      createField,
      createArray)
    expect(result).toNotBe(tree)
    expect(result).toEqual({
      a: [
        { key: 'a[0]' }
      ],
      b: [
        { c: { key: 'b[0].c' } }
      ],
      d: {
        e: [
          { key: 'd.e[0]' }
        ]
      }
    })
    expect(result.a).toBe(tree.a)
    expect(result.a[ 0 ]).toBe(tree.a[ 0 ])
    expect(result.b).toNotBe(tree.b)
    expect(result.b[ 0 ]).toBe(tree.b[ 0 ])
    expect(result.b[ 0 ].c).toBe(tree.b[ 0 ].c)
    expect(result.d).toNotBe(tree.d)
    expect(result.d.e).toNotBe(tree.d.e)
    expect(result.d.e[ 0 ]).toBe(tree.d.e[ 0 ])
    expect(createField).toNotHaveBeenCalled()
    expect(createArray).toHaveBeenCalled()
    expect(createArray.calls.length).toBe(2)
    expect(createArray.calls[ 0 ].arguments[ 0 ]).toBe('b')
    expect(createArray.calls[ 1 ].arguments[ 0 ]).toBe('d.e')
  })
})
*/
