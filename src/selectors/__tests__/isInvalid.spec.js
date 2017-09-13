import createIsInvalid from '../isInvalid'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'


const describeIsInvalid = (name, structure, setup) => {
  const isInvalid = createIsInvalid(structure)

  const { fromJS, getIn, setIn } = structure
  const getFormState = state => getIn(state, 'form')

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(typeof isInvalid('foo', getFormState)).toBe('function')
    })

    it('should return false when form data not present', () => {
      expect(
        isInvalid('foo', getFormState)(
          fromJS({
            form: {}
          })
        )
      ).toBe(false)
    })

    it('should return false when there are no errors', () => {
      expect(
        isInvalid('foo', getFormState)(
          fromJS({
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
          })
        )
      ).toBe(false)
    })

    it('should return false when there are sync errors for a NON-registered field', () => {
      expect(
        isInvalid('foo', getFormState)(
          setIn(
            fromJS({
              form: {
                foo: {
                  values: {
                    dog: 'Odie',
                    cat: 'Garfield'
                  },
                  registeredFields: {
                    dog: { name: 'dog', type: 'Field', count: 1 },
                    cat: { name: 'cat', type: 'Field', count: 1 }
                  },
                  syncErrors: {
                    horse: 'Too old'
                  }
                }
              }
            }),
            'form.foo.syncErrors',
            {
              horse: 'Too Old'
            }
          )
        )
      ).toBe(false)
    })

    it('should return true when there are sync errors for registered fields', () => {
      expect(
        isInvalid('foo', getFormState)(
          setIn(
            fromJS({
              form: {
                foo: {
                  values: {
                    dog: 'Odie',
                    cat: 'Garfield'
                  },
                  registeredFields: {
                    dog: { name: 'dog', type: 'Field', count: 1 },
                    cat: { name: 'cat', type: 'Field', count: 1 }
                  }
                }
              }
            }),
            'form.foo.syncErrors',
            {
              dog: 'Too old'
            }
          )
        )
      ).toBe(true)
    })

    it('should return true with sync error for registered array field', () => {
      expect(
        isInvalid('foo', getFormState)(
          setIn(
            fromJS({
              form: {
                foo: {
                  values: {
                    dog: 'Odie',
                    cats: ['Garfield']
                  },
                  registeredFields: {
                    dog: { name: 'dog', type: 'Field', count: 1 },
                    cats: { name: 'cats', type: 'FieldArray', count: 1 }
                  }
                }
              }
            }),
            'form.foo.syncErrors',
            {
              cats: {
                _error: 'Too many cats'
              }
            }
          )
        )
      ).toBe(true)
    })

    it('should return true when there is a syncError', () => {
      expect(
        isInvalid('foo', getFormState)(
          fromJS({
            form: {
              foo: {
                values: {
                  dog: 'Odie',
                  cat: 'Garfield'
                },
                error: 'Bad Data',
                syncError: true,
                registeredFields: {
                  dog: { name: 'dog', type: 'Field', count: 1 },
                  cat: { name: 'cat', type: 'Field', count: 1 }
                }
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should return false when there are async errors for a NON-registered field', () => {
      expect(
        isInvalid('foo', getFormState)(
          fromJS({
            form: {
              foo: {
                values: {
                  dog: 'Odie',
                  cat: 'Garfield'
                },
                registeredFields: {
                  dog: { name: 'dog', type: 'Field', count: 1 },
                  cat: { name: 'cat', type: 'Field', count: 1 }
                },
                asyncErrors: {
                  horse: 'Too old'
                }
              }
            }
          })
        )
      ).toBe(false)
    })

    it('should return true when there are async errors for registered fields', () => {
      expect(
        isInvalid('foo', getFormState)(
          fromJS({
            form: {
              foo: {
                values: {
                  dog: 'Odie',
                  cat: 'Garfield'
                },
                registeredFields: {
                  dog: { name: 'dog', type: 'Field', count: 1 },
                  cat: { name: 'cat', type: 'Field', count: 1 }
                },
                asyncErrors: {
                  dog: 'Too old'
                }
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should return true with async error for registered array field', () => {
      expect(
        isInvalid('foo', getFormState)(
          fromJS({
            form: {
              foo: {
                values: {
                  dog: 'Odie',
                  cats: ['Garfield']
                },
                registeredFields: {
                  dog: { name: 'dog', type: 'Field', count: 1 },
                  cats: { name: 'cats', type: 'FieldArray', count: 1 }
                },
                asyncErrors: {
                  cats: {
                    _error: 'Too many cats'
                  }
                }
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should return false when there are submit errors for a NON-registered field', () => {
      expect(
        isInvalid('foo', getFormState)(
          fromJS({
            form: {
              foo: {
                values: {
                  dog: 'Odie',
                  cat: 'Garfield'
                },
                registeredFields: {
                  dog: { name: 'dog', type: 'Field', count: 1 },
                  cat: { name: 'cat', type: 'Field', count: 1 }
                },
                submitErrors: {
                  horse: 'Too old'
                }
              }
            }
          })
        )
      ).toBe(false)
    })

    it('should return true when there are submit errors for registered fields', () => {
      expect(
        isInvalid('foo', getFormState)(
          fromJS({
            form: {
              foo: {
                values: {
                  dog: 'Odie',
                  cat: 'Garfield'
                },
                registeredFields: {
                  dog: { name: 'dog', type: 'Field', count: 1 },
                  cat: { name: 'cat', type: 'Field', count: 1 }
                },
                submitErrors: {
                  dog: 'Too old'
                }
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should return true with submit error for registered array field', () => {
      expect(
        isInvalid('foo', getFormState)(
          fromJS({
            form: {
              foo: {
                values: {
                  dog: 'Odie',
                  cats: ['Garfield']
                },
                registeredFields: {
                  dog: { name: 'dog', type: 'Field', count: 1 },
                  cats: { name: 'cats', type: 'FieldArray', count: 1 }
                },
                submitErrors: {
                  cats: {
                    _error: 'Too many cats'
                  }
                }
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should use getFormState if provided', () => {
      expect(
        isInvalid('foo', state => getIn(state, 'someOtherSlice'))(
          fromJS({
            someOtherSlice: {
              foo: {
                values: {
                  dog: 'Odie',
                  cat: 'Garfield'
                },
                registeredFields: {
                  dog: { name: 'dog', type: 'Field', count: 1 },
                  cat: { name: 'cat', type: 'Field', count: 1 }
                },
                submitErrors: {
                  dog: 'That dog is ugly'
                }
              }
            }
          })
        )
      ).toBe(true)
    })
  })
}

describeIsInvalid('isInvalid.plain', plain, () => expect.extend(plainExpectations))
describeIsInvalid(
  'isInvalid.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
