import createGetFormMeta from '../getFormMeta'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'


const describeGetFormMeta = (name, structure, setup) => {
  const getFormMeta = createGetFormMeta(structure)

  const { fromJS, getIn } = structure

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(typeof createGetFormMeta('foo')).toBe('function')
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
  () => expect.extend(plainExpectations)
)
describeGetFormMeta(
  'getFormMeta.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
