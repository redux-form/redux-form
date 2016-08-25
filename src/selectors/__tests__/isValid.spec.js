import createIsValid from '../isValid'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeIsValid = (name, structure, expect) => {
  const isValid = createIsValid(structure)

  const { fromJS, getIn, setIn } = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(isValid('foo')).toBeA('function')
    })

    it('should return true when form data not present', () => {
      expect(isValid('foo')(fromJS({
        form: {}
      }))).toBe(true)
    })

    it('should return true when there are no errors', () => {
      expect(isValid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Snoopy',
              cat: 'Garfield'
            },
            asyncErrors: {},
            submitErrors: {},
            syncErrors: {}
          }
        }
      }))).toBe(true)
    })

    it('should return true when there are sync errors for a NON-registered field', () => {
      expect(isValid('foo')(setIn(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ],
            syncErrors: {
              horse: 'Too old'
            }
          }
        }
      }), 'form.foo.syncErrors', {
        horse: 'Too Old'
      }))).toBe(true)
    })

    it('should return false when there are sync errors for registered fields', () => {
      expect(isValid('foo')(setIn(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ]
          }
        }
      }), 'form.foo.syncErrors', {
        dog: 'Too old'
      }))).toBe(false)
    })

    it('should return false with sync error for registered array field', () => {
      expect(isValid('foo')(setIn(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cats: [ 'Garfield' ]
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cats', type: 'FieldArray' }
            ]
          }
        }
      }), 'form.foo.syncErrors', {
        cats: {
          _error: 'Too many cats'
        }
      }))).toBe(false)
    })

    it('should return false when there is a global error', () => {
      expect(isValid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            error: 'Bad data',
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ]
          }
        }
      }))).toBe(false)
    })

    it('should return true when there are async errors for a NON-registered field', () => {
      expect(isValid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ],
            asyncErrors: {
              horse: 'Too old'
            }
          }
        }
      }))).toBe(true)
    })

    it('should return false when there are async errors for registered fields', () => {
      expect(isValid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ],
            asyncErrors: {
              dog: 'Too old'
            }
          }
        }
      }))).toBe(false)
    })

    it('should return false with async error for registered array field', () => {
      expect(isValid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cats: [ 'Garfield' ]
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cats', type: 'FieldArray' }
            ],
            asyncErrors: {
              cats: {
                _error: 'Too many cats'
              }
            }
          }
        }
      }))).toBe(false)
    })

    it('should return true when there are submit errors for a NON-registered field', () => {
      expect(isValid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ],
            submitErrors: {
              horse: 'Too old'
            }
          }
        }
      }))).toBe(true)
    })

    it('should return false when there are submit errors for registered fields', () => {
      expect(isValid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ],
            submitErrors: {
              dog: 'Too old'
            }
          }
        }
      }))).toBe(false)
    })

    it('should return false with submit error for registered array field', () => {
      expect(isValid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cats: [ 'Garfield' ]
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cats', type: 'FieldArray' }
            ],
            submitErrors: {
              cats: {
                _error: 'Too many cats'
              }
            }
          }
        }
      }))).toBe(false)
    })

    it('should use getFormState if provided', () => {
      expect(isValid('foo', state => getIn(state, 'someOtherSlice'))(fromJS({
        someOtherSlice: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ],
            submitErrors: {
              dog: 'That dog is ugly'
            }
          }
        }
      }))).toBe(false)
    })
  })
}

describeIsValid('isValid.plain', plain, addExpectations(plainExpectations))
describeIsValid('isValid.immutable', immutable, addExpectations(immutableExpectations))
