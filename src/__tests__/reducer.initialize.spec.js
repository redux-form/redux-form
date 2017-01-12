import { initialize } from '../actions'

const describeInitialize = (reducer, expect, { fromJS }) => () => {
  it('should set initialize values on initialize on empty state', () => {
    const state = reducer(undefined, initialize('foo', { myField: 'initialValue' }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'initialValue'
          },
          initial: {
            myField: 'initialValue'
          }
        }
      })
  })

  it('should allow initializing null values', () => {
    const state = reducer(undefined, initialize('foo', { bar: 'baz', dog: null }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            bar: 'baz',
            dog: null
          },
          initial: {
            bar: 'baz',
            dog: null
          }
        }
      })
  })

  it('should initialize nested values on initialize on empty state', () => {
    const state = reducer(undefined, initialize('foo', { myField: { subField: 'initialValue' } }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: {
              subField: 'initialValue'
            }
          },
          initial: {
            myField: {
              subField: 'initialValue'
            }
          }
        }
      })
  })

  it('should initialize array values on initialize on empty state', () => {
    const state = reducer(undefined, initialize('foo', { myField: [ 'initialValue' ] }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: [ 'initialValue' ]
          },
          initial: {
            myField: [ 'initialValue' ]
          }
        }
      })
  })

  it('should initialize array values with subvalues on initialize on empty state', () => {
    const state = reducer(undefined, initialize('foo', {
      accounts: [
        {
          name: 'Bobby Tables',
          email: 'bobby@gmail.com'
        },
        {
          name: 'Sammy Tables',
          email: 'sammy@gmail.com'
        }
      ]
    }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            accounts: [
              {
                name: 'Bobby Tables',
                email: 'bobby@gmail.com'
              },
              {
                name: 'Sammy Tables',
                email: 'sammy@gmail.com'
              }
            ]
          },
          initial: {
            accounts: [
              {
                name: 'Bobby Tables',
                email: 'bobby@gmail.com'
              },
              {
                name: 'Sammy Tables',
                email: 'sammy@gmail.com'
              }
            ]
          }
        }
      })
  })

  it('should set initialize values, making form pristine when initializing', () => {
    const state = reducer(fromJS({
      foo: {
        values: {
          myField: 'dirtyValue'
        },
        fields: {
          myField: {
            touched: true
          }
        }
      }
    }), initialize('foo', { myField: 'cleanValue' }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {
            myField: 'cleanValue'
          },
          initial: {
            myField: 'cleanValue'
          }
        }
      })
  })

  it('should set initialize values, and not remove registered fields', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [
          { name: 'username', type: 'Field' },
          { name: 'password', type: 'Field' }
        ],
        values: {
          username: 'dirtyValue'
        },
        fields: {
          username: {
            touched: true
          }
        }
      }
    }), initialize('foo', { username: 'cleanValue', password: 'cleanPassword' }))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'username', type: 'Field' },
            { name: 'password', type: 'Field' }
          ],
          values: {
            username: 'cleanValue',
            password: 'cleanPassword'
          },
          initial: {
            username: 'cleanValue',
            password: 'cleanPassword'
          }
        }
      })
  })
  
  it('should not retain submitSucceeded when keepSubmitSucceeded is not set', () => {
    const state = reducer(fromJS({
      foo: {
        submitSucceeded: true 
      }
    }), initialize('foo', {}))
    expect(state)
      .toEqualMap({
        foo: {
          values: {},
          initial: {}
        }
      })    
  })
  
  it('should retain submitSucceeded when keepSubmitSucceeded is set', () => {
    const state = reducer(fromJS({
      foo: {
        submitSucceeded: true 
      }
    }), initialize('foo', {}, { keepSubmitSucceeded: true }))
    expect(state)
      .toEqualMap({
        foo: {
          values: {},
          initial: {},
          submitSucceeded: true 
        }
      })    
  })

  it('should retain dirty values when keepDirty is set', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [
          { name: 'myField', type: 'Field' }
        ],
        values: {
          myField: 'dirtyValue'
        },
        initial: {
          myField: 'initialValue'
        }
      }
    }), initialize('foo', { myField: 'newValue' }, true))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'myField', type: 'Field' }
          ],
          values: {
            myField: 'dirtyValue'
          },
          initial: {
            myField: 'newValue'
          }
        }
      })
  })

  it('should replace pristine values when keepDirty is set', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [
          { name: 'myField', type: 'Field' }
        ],
        values: {
          myField: 'initialValue'
        },
        initial: {
          myField: 'initialValue'
        }
      }
    }), initialize('foo', { myField: 'newValue' }, true))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'myField', type: 'Field' }
          ],
          values: {
            myField: 'newValue'
          },
          initial: {
            myField: 'newValue'
          }
        }
      })
  })

  it('should treat a matching dirty value as pristine when keepDirty is set', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [
          { name: 'myField', type: 'Field' }
        ],
        values: {
          myField: 'newValue'
        },
        initial: {
          myField: 'initialValue'
        }
      }
    }), initialize('foo', { myField: 'newValue' }, true))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'myField', type: 'Field' }
          ],
          values: {
            myField: 'newValue'
          },
          initial: {
            myField: 'newValue'
          }
        }
      })
  })
  
  it('allows passing keepDirty in options argument', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [
          { name: 'myField', type: 'Field' }
        ],
        values: {
          myField: 'dirtyValue'
        },
        initial: {
          myField: 'initialValue'
        }
      }
    }), initialize('foo', { myField: 'newValue' }, { keepDirty: true }))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'myField', type: 'Field' }
          ],
          values: {
            myField: 'dirtyValue'
          },
          initial: {
            myField: 'newValue'
          }
        }
      })
  })

  it('should persist warnings if they exist', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [
          { name: 'myField', type: 'Field' }
        ],
        values: {
          myField: 'newValue'
        },
        initial: {
          myField: 'initialValue'
        },
        warning: 'form wide warning',
        syncWarnings: {
          myField: 'field warning'
        }
      }
    }), initialize('foo', { myField: 'newValue' }, true))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'myField', type: 'Field' }
          ],
          values: {
            myField: 'newValue'
          },
          initial: {
            myField: 'newValue'
          },
          warning: 'form wide warning',
          syncWarnings: {
            myField: 'field warning'
          }
        }
      })
  })

  it('should persist errors if they exist', () => {
    const state = reducer(fromJS({
      foo: {
        registeredFields: [
          { name: 'myField', type: 'Field' }
        ],
        values: {
          myField: 'newValue'
        },
        initial: {
          myField: 'initialValue'
        },
        error: 'form wide error',
        syncErrors: {
          myField: 'field error'
        }
      }
    }), initialize('foo', { myField: 'newValue' }, true))
    expect(state)
      .toEqualMap({
        foo: {
          registeredFields: [
            { name: 'myField', type: 'Field' }
          ],
          values: {
            myField: 'newValue'
          },
          initial: {
            myField: 'newValue'
          },
          error: 'form wide error',
          syncErrors: {
            myField: 'field error'
          }
        }
      })
  })
  
}

export default describeInitialize
