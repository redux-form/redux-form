/* eslint react/no-multi-comp:0 */
import createFormValueSelector from '../formValueSelector'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeFormValueSelector = (name, structure, expect) => {
  const { fromJS, getIn } = structure
  const formValueSelector = createFormValueSelector(structure)

  describe(name, () => {
    it('should throw an error if no form specified', () => {
      expect(() => formValueSelector())
        .toThrow('Form value must be specified')
    })

    it('should return a function', () => {
      expect(formValueSelector('myForm')).toBeA('function')
    })

    it('should throw an error if no fields specified', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({})
      expect(() => selector(state))
        .toThrow('No fields specified')
    })

    it('should return undefined for a single value when no redux-form state found', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({})
      expect(selector(state, 'foo')).toBe(undefined)
    })

    it('should return undefined for a single value when no form slice found', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({
        form: {}
      })
      expect(selector(state, 'foo')).toBe(undefined)
    })

    it('should return undefined for a single value when no values found', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({
        form: {
          myForm: {
            // no values
          }
        }
      })
      expect(selector(state, 'foo')).toBe(undefined)
    })

    it('should get a single value', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({
        form: {
          myForm: {
            values: {
              foo: 'bar'
            }
          }
        }
      })
      expect(selector(state, 'foo')).toBe('bar')
    })

    it('should get a single deep value', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({
        form: {
          myForm: {
            values: {
              dog: {
                cat: {
                  ewe: {
                    pig: 'Napoleon'
                  }
                }
              }
            }
          }
        }
      })
      expect(selector(state, 'dog.cat.ewe.pig')).toBe('Napoleon')
    })

    it('should return {} for multiple values when no redux-form state found', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({})
      expect(selector(state, 'foo', 'bar')).toEqual({})
    })

    it('should return {} for multiple values when no form slice found', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({
        form: {}
      })
      expect(selector(state, 'foo', 'bar')).toEqual({})
    })

    it('should return {} for multiple values when no values found', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({
        form: {
          myForm: {
            // no values
          }
        }
      })
      expect(selector(state, 'foo', 'bar')).toEqual({})
    })

    it('should get multiple values', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({
        form: {
          myForm: {
            values: {
              foo: 'bar',
              dog: 'cat',
              another: 'do not read'
            }
          }
        }
      })
      expect(selector(state, 'foo', 'dog'))
        .toEqual({
          foo: 'bar',
          dog: 'cat'
        })
    })

    it('should get multiple deep values', () => {
      const selector = formValueSelector('myForm')
      const state = fromJS({
        form: {
          myForm: {
            values: {
              dog: {
                cat: {
                  ewe: {
                    pig: 'Napoleon'
                  }
                },
                rat: {
                  hog: 'Wilbur'
                }
              }
            }
          }
        }
      })
      expect(selector(state, 'dog.cat.ewe.pig', 'dog.rat.hog'))
        .toEqual({
          dog: {
            cat: {
              ewe: {
                pig: 'Napoleon'
              }
            },
            rat: {
              hog: 'Wilbur'
            }
          }
        })
    })
    
    
    it('should get a single value using a different mount point', () => {
      const selector = formValueSelector('myForm', state => getIn(state, 'otherMountPoint'))
      const state = fromJS({
        otherMountPoint: {
          myForm: {
            values: {
              foo: 'bar'
            }
          }
        }
      })
      expect(selector(state, 'foo')).toBe('bar')
    })
  })
}

describeFormValueSelector('formValueSelector.plain', plain, addExpectations(plainExpectations))
describeFormValueSelector('formValueSelector.immutable', immutable, addExpectations(immutableExpectations))
