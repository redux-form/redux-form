import createIsValid from '../isValid'
import plain from '../../structure/plain'
import plainExpectations from '../../structure/plain/expectations'
import immutable from '../../structure/immutable'
import immutableExpectations from '../../structure/immutable/expectations'


const describeIsValid = (name, structure, setup) => {
  const isValid = createIsValid(structure)

  const { fromJS, getIn, setIn } = structure
  const getFormState = state => getIn(state, 'form')

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should return a function', () => {
      expect(isValid('foo', getFormState)).toBeA('function')
    })

    it('should return true when form data not present', () => {
      expect(
        isValid('foo', getFormState)(
          fromJS({
            form: {}
          })
        )
      ).toBe(true)
    })

    it('should return true when there are no errors', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(true)
    })

    it('should return true when there are sync errors for a NON-registered field', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(true)
    })

    it('should return false when there are sync errors for registered fields', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(false)
    })

    it('should return false with sync error for registered array field', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(false)
    })

    it('should return false when there is a syncError', () => {
      expect(
        isValid('foo', getFormState)(
          fromJS({
            form: {
              foo: {
                values: {
                  dog: 'Odie',
                  cat: 'Garfield'
                },
                error: 'Bad data',
                syncError: true,
                registeredFields: {
                  dog: { name: 'dog', type: 'Field', count: 1 },
                  cat: { name: 'cat', type: 'Field', count: 1 }
                }
              }
            }
          })
        )
      ).toBe(false)
    })

    it('should return true when there are async errors for a NON-registered field', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(true)
    })

    it('should return false when there are async errors for registered fields', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(false)
    })

    it('should return false with async error for registered array field', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(false)
    })

    it('should return true when there are submit errors for a NON-registered field', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(true)
    })

    it('should return false when there are submit errors for registered fields', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(false)
    })

    it('should return false with submit error for registered array field', () => {
      expect(
        isValid('foo', getFormState)(
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
      ).toBe(false)
    })

    it('should return false when there is a form-wide submit error', () => {
      expect(
        isValid('foo', getFormState)(
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
                error: 'Form wide'
              }
            }
          })
        )
      ).toBe(false)
    })

    it('should return true when there are submit errors for registered fields but told to ignore submit errors', () => {
      expect(
        isValid('foo', getFormState, true)(
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

    it('should return true when there is a form-wide submit error, but ignoring submit errors', () => {
      expect(
        isValid('foo', getFormState, true)(
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
                error: 'Form wide'
              }
            }
          })
        )
      ).toBe(true)
    })

    it('should use getFormState if provided', () => {
      expect(
        isValid('foo', state => getIn(state, 'someOtherSlice'))(
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
      ).toBe(false)
    })

    it('should have default getFormState', () => {
      expect(
        isValid('foo')(
          fromJS({
            form: {}
          })
        )
      ).toBe(true)
    })
  })
}

describeIsValid('isValid.plain', plain, () => expect.extend(plainExpectations))
describeIsValid(
  'isValid.immutable',
  immutable,
  () => expect.extend(immutableExpectations)
)
