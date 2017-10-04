import createDeleteInWithCleanUp from '../deleteInWithCleanUp'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/__tests__/expectations'


const describeDeleteInWithCleanUp = (name, structure, setup) => {
  const { fromJS } = structure
  const deleteInWithCleanUp = createDeleteInWithCleanUp(structure)

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should delete from a flat structure', () => {
      expect(
        deleteInWithCleanUp(
          fromJS({
            dog: 'Scooby',
            cat: 'Garfield'
          }),
          'dog'
        )
      ).toEqualMap({
        cat: 'Garfield'
      })
    })

    it('should not delete parent if has other children', () => {
      expect(
        deleteInWithCleanUp(
          fromJS({
            a: {
              b: 1,
              c: 2
            },
            d: {
              e: 3
            }
          }),
          'a.b'
        )
      ).toEqualMap({
        a: {
          c: 2
        },
        d: {
          e: 3
        }
      })
    })

    it('should just set to undefined if leaf structure is an array', () => {
      expect(
        deleteInWithCleanUp(
          fromJS({
            a: [42]
          }),
          'a[0]'
        )
      ).toEqualMap({
        a: [undefined]
      })
      expect(
        deleteInWithCleanUp(
          fromJS({
            a: [42]
          }),
          'b[0]'
        )
      ).toEqualMap({
        a: [42]
      })
      expect(
        deleteInWithCleanUp(
          fromJS({
            a: [41, 42, 43]
          }),
          'a[1]'
        )
      ).toEqualMap({
        a: [41, undefined, 43]
      })
      expect(
        deleteInWithCleanUp(
          fromJS({
            a: {
              b: 1,
              c: [2]
            },
            d: {
              e: 3
            }
          }),
          'a.c[0]'
        )
      ).toEqualMap({
        a: {
          b: 1,
          c: [undefined]
        },
        d: {
          e: 3
        }
      })
    })

    it('should delete parent if no other children', () => {
      expect(
        deleteInWithCleanUp(
          fromJS({
            a: {
              b: 1,
              c: 2
            },
            d: {
              e: 3
            }
          }),
          'd.e'
        )
      ).toEqualMap({
        a: {
          b: 1,
          c: 2
        }
      })
      expect(
        deleteInWithCleanUp(
          fromJS({
            a: {
              b: {
                c: {
                  d: {
                    e: {
                      f: "That's DEEP!"
                    }
                  }
                }
              }
            }
          }),
          'a.b.c.d.e.f'
        )
      ).toEqualMap({})
    })
  })
}

describeDeleteInWithCleanUp(
  'deleteInWithCleanUp.plain',
  plain,
  () => expect.extend(plainExpectations)
)
describeDeleteInWithCleanUp(
  'deleteInWithCleanUp.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
