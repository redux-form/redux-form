import createDeleteInWithCleanUp from '../deleteInWithCleanUp'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeDeleteInWithCleanUp = (name, structure, expect) => {
  const { fromJS } = structure
  const deleteInWithCleanUp = createDeleteInWithCleanUp(structure)

  describe(name, () => {
    it('should delete from a flat structure', () => {
      expect(deleteInWithCleanUp(fromJS({
        dog: 'Scooby',
        cat: 'Garfield'
      }), 'dog')).toEqualMap({
        cat: 'Garfield'
      })
    })

    it('should not delete parent if has other children', () => {
      expect(deleteInWithCleanUp(fromJS({
        a: {
          b: 1,
          c: 2
        },
        d: {
          e: 3
        }
      }), 'a.b')).toEqualMap({
        a: {
          c: 2
        },
        d: {
          e: 3
        }
      })
    })

    it('should delete parent if no other children', () => {
      expect(deleteInWithCleanUp(fromJS({
        a: {
          b: 1,
          c: 2
        },
        d: {
          e: 3
        }
      }), 'd.e')).toEqualMap({
        a: {
          b: 1,
          c: 2
        }
      })
      expect(deleteInWithCleanUp(fromJS({
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: 'That\'s DEEP!'
                }
              }
            }
          }
        }
      }), 'a.b.c.d.e.f')).toEqualMap({})
    })
  })
}

describeDeleteInWithCleanUp('deleteInWithCleanUp.plain', plain, addExpectations(plainExpectations))
describeDeleteInWithCleanUp('deleteInWithCleanUp.immutable', immutable, addExpectations(immutableExpectations))

