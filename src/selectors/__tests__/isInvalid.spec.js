import createIsInvalid from '../isInvalid'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'
import addExpectations from '../../__tests__/addExpectations'

const describeIsInvalid = (name, structure, expect) => {
  const isInvalid = createIsInvalid(structure)

  const { fromJS, getIn, setIn } = structure

  describe(name, () => {
    it('should return a function', () => {
      expect(isInvalid('foo')).toBeA('function')
    })

    it('should return false when form data not present', () => {
      expect(isInvalid('foo')(fromJS({
        form: {}
      }))).toBe(false)
    })

    it('should return false when there are no errors', () => {
      expect(isInvalid('foo')(fromJS({
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
      }))).toBe(false)
    })

    it('should return false when there are sync errors for a NON-registered field', () => {
      expect(isInvalid('foo')(setIn(fromJS({
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
      }))).toBe(false)
    })

    it('should return true when there are sync errors for registered fields', () => {
      expect(isInvalid('foo')(setIn(fromJS({
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
      }))).toBe(true)
    })

    it('should return true with sync error for registered array field', () => {
      expect(isInvalid('foo')(setIn(fromJS({
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
      }))).toBe(true)
    })

    it('should return true when there is a global error', () => {
      expect(isInvalid('foo')(fromJS({
        form: {
          foo: {
            values: {
              dog: 'Odie',
              cat: 'Garfield'
            },
            error: 'Bad Data',
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ]
          }
        }
      }))).toBe(true)
    })

    it('should return false when there are async errors for a NON-registered field', () => {
      expect(isInvalid('foo')(fromJS({
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
      }))).toBe(false)
    })

    it('should return true when there are async errors for registered fields', () => {
      expect(isInvalid('foo')(fromJS({
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
      }))).toBe(true)
    })

    it('should return true with async error for registered array field', () => {
      expect(isInvalid('foo')(fromJS({
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
      }))).toBe(true)
    })

    it('should return false when there are submit errors for a NON-registered field', () => {
      expect(isInvalid('foo')(fromJS({
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
      }))).toBe(false)
    })

    it('should return true when there are submit errors for registered fields', () => {
      expect(isInvalid('foo')(fromJS({
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
      }))).toBe(true)
    })

    it('should return true with submit error for registered array field', () => {
      expect(isInvalid('foo')(fromJS({
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
      }))).toBe(true)
    })

    it('should use getFormState if provided', () => {
      expect(isInvalid('foo', state => getIn(state, 'someOtherSlice'))(fromJS({
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
      }))).toBe(true)
    })
  })
}

describeIsInvalid('isInvalid.plain', plain, addExpectations(plainExpectations))
describeIsInvalid('isInvalid.immutable', immutable, addExpectations(immutableExpectations))
