import createGetFormMeta from '../getFormMeta'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeGetFormMeta = (name, structure, expect) => {
  const getFormMeta = createGetFormMeta(structure)

  const {fromJS, getIn} = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(createGetFormMeta('foo')).toBeA('function')
    })

    it('should get the form values from state', () => {
      expect(
        getFormMeta('foo')(
          fromJS({
            form: {
              foo: {
                fields: {
                  dog: {
                    visited: true,
                    touched: false
                  },
                  cat: {
                    visited: false,
                    touched: true
                  }
                }
              }
            }
          })
        )
      ).toEqualMap({
        dog: {
          visited: true,
          touched: false
        },
        cat: {
          visited: false,
          touched: true
        }
      })
    })

    it('should return undefined if there are no fields', () => {
      expect(
        getFormMeta('foo')(
          fromJS({
            form: {
              foo: {}
            }
          })
        )
      ).toEqual(undefined)
    })

    it('should use getFormState if provided', () => {
      expect(
        getFormMeta('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                fields: {
                  dog: {
                    visited: true,
                    touched: false
                  },
                  cat: {
                    visited: false,
                    touched: true
                  }
                }
              }
            }
          })
        )
      ).toEqualMap({
        dog: {
          visited: true,
          touched: false
        },
        cat: {
          visited: false,
          touched: true
        }
      })
    })
  })
}

describeGetFormMeta(
  'getFormMeta.plain',
  plain,
  addExpectations(plainExpectations)
)
describeGetFormMeta(
  'getFormMeta.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
