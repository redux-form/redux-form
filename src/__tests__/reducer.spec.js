import expect from 'expect';
import reducer, {globalErrorKey} from '../reducer';
import bindActionData from '../bindActionData';
import {addArrayValue, blur, change, focus, initialize, removeArrayValue, reset, startAsyncValidation, startSubmit,
  stopAsyncValidation, stopSubmit, swapArrayValues, touch, untouch, destroy} from '../actions';
import {isFieldValue, makeFieldValue} from '../fieldValue';

describe('reducer', () => {
  it('should initialize state to {}', () => {
    const state = reducer();
    expect(state)
      .toExist()
      .toBeA('object');
    expect(Object.keys(state).length).toBe(0);
  });

  it('should not modify state when action has no form', () => {
    const state = {foo: 'bar'};
    expect(reducer(state, {type: 'SOMETHING_ELSE'})).toBe(state);
  });

  it('should initialize form state when action has form', () => {
    const state = reducer(undefined, {form: 'foo'});
    expect(state)
      .toExist()
      .toBeA('object');
    expect(Object.keys(state).length).toBe(1);
    expect(state.foo)
      .toExist()
      .toBeA('object')
      .toEqual({
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should add an empty array value with empty state', () => {
    const state = reducer({}, {
      ...addArrayValue('myField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: [
          {
            value: undefined
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField[0])).toBe(true);
  });

  it('should add an empty deep array value with empty state', () => {
    const state = reducer({}, {
      ...addArrayValue('myField.myArray'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          myArray: [
            {
              value: undefined
            }
          ]
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.myArray)).toBe(false);
    expect(isFieldValue(state.foo.myField.myArray[0])).toBe(true);
  });

  it('should add a deep array value with initial value', () => {
    const state = reducer({}, {
      ...addArrayValue('myField.myArray', 20, undefined),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          myArray: [
            {
              value: 20
            }
          ]
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.myArray)).toBe(false);
    expect(isFieldValue(state.foo.myField.myArray[0])).toBe(true);
  });

  it('should push an array value', () => {
    const state = reducer({
      testForm: {
        myField: [
          makeFieldValue({
            value: 'foo'
          }),
          makeFieldValue({
            value: 'bar'
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...addArrayValue('myField', 'baz'),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'bar'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);
  });

  it('should insert an array value', () => {
    const state = reducer({
      testForm: {
        myField: [
          makeFieldValue({
            value: 'foo'
          }),
          makeFieldValue({
            value: 'bar'
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...addArrayValue('myField', 'baz', 1),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'baz'
          },
          {
            value: 'bar'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);
  });

  // TODO: Find a way to make this pass:
  /*
   it('should push an array value which is a deep object', () => {
   const state = reducer({
   testForm: {
   friends: [
   {
   name: {
   initial: 'name-1',
   value: 'name-1'
   },
   address: {
   street: {
   initial: 'street-1',
   value: 'street-1'
   },
   postalCode: {
   initial: 'postalCode-1',
   value: 'postalCode-1'
   }
   }
   },
   {
   name: {
   initial: 'name-2',
   value: 'name-2'
   },
   address: {
   street: {
   initial: 'street-2',
   value: 'street-2'
   },
   postalCode: {
   initial: 'postalCode-2',
   value: 'postalCode-2'
   }
   }
   }
   ],
   _active: undefined,
   _asyncValidating: false,
   _error: undefined,
   _initialized: false,
   _submitting: false,
   _submitFailed: false
   }
   }, {
   ...addArrayValue('friends', {
   name: 'name-3',
   address: {
   street: 'street-3',
   postalCode: 'postalCode-3'
   }
   }, undefined),
   form: 'testForm'
   });
   expect(state.testForm)
   .toEqual({
   friends: [
   {
   name: {
   initial: 'name-1',
   value: 'name-1'
   },
   address: {
   street: {
   initial: 'street-1',
   value: 'street-1'
   },
   postalCode: {
   initial: 'postalCode-1',
   value: 'postalCode-1'
   }
   }
   },
   {
   name: {
   initial: 'name-2',
   value: 'name-2'
   },
   address: {
   street: {
   initial: 'street-2',
   value: 'street-2'
   },
   postalCode: {
   initial: 'postalCode-2',
   value: 'postalCode-2'
   }
   }
   },
   {
   name: {
   initial: 'name-3',
   value: 'name-3'
   },
   address: {
   street: {
   initial: 'street-3',
   value: 'street-3'
   },
   postalCode: {
   initial: 'postalCode-3',
   value: 'postalCode-3'
   }
   }
   }
   ],
   _active: undefined,
   _asyncValidating: false,
   _error: undefined,
   _initialized: false,
   _submitting: false,
   _submitFailed: false
   });
   });
   */

  it('should push a deep array value which is a nested object', () => {
    const state = reducer({
      testForm: {
        myField: [
          {
            foo: makeFieldValue({
              initial: {a: 'foo-a1', b: 'foo-b1'},
              value: {a: 'foo-a1', b: 'foo-b1'},
            }),
            bar: makeFieldValue({
              initial: {a: 'bar-a1', b: 'bar-b1'},
              value: {a: 'bar-a1', b: 'bar-b1'},
            })
          },
          {
            foo: makeFieldValue({
              initial: {a: 'foo-a2', b: 'foo-b2'},
              value: {a: 'foo-a2', b: 'foo-b2'},
            }),
            bar: makeFieldValue({
              initial: {a: 'bar-a2', b: 'bar-b2'},
              value: {a: 'bar-a2', b: 'bar-b2'},
            })
          },
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...addArrayValue('myField', {foo: {a: 'foo-a3', b: 'foo-b3'}, bar: {a: 'bar-a3', b: 'bar-b3'}}, undefined),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            foo: {
              initial: {a: 'foo-a1', b: 'foo-b1'},
              value: {a: 'foo-a1', b: 'foo-b1'},
            },
            bar: {
              initial: {a: 'bar-a1', b: 'bar-b1'},
              value: {a: 'bar-a1', b: 'bar-b1'},
            }
          },
          {
            foo: {
              initial: {a: 'foo-a2', b: 'foo-b2'},
              value: {a: 'foo-a2', b: 'foo-b2'},
            },
            bar: {
              initial: {a: 'bar-a2', b: 'bar-b2'},
              value: {a: 'bar-a2', b: 'bar-b2'},
            }
          },
          {
            foo: {
              initial: {a: 'foo-a3', b: 'foo-b3'},
              value: {a: 'foo-a3', b: 'foo-b3'},
            },
            bar: {
              initial: {a: 'bar-a3', b: 'bar-b3'},
              value: {a: 'bar-a3', b: 'bar-b3'},
            }
          },
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[0].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(false);
    expect(isFieldValue(state.testForm.myField[2].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[2].bar)).toBe(true);
  });

  it('should push a subarray value which is an object', () => {
    const state = reducer({
      testForm: {
        myField: [
          {
            myField2: [
              {
                foo: makeFieldValue({
                  initial: 'foo-1-1',
                  value: 'foo-1-1'
                }),
                bar: makeFieldValue({
                  initial: 'bar-1-1',
                  value: 'bar-1-1'
                })
              },
              {
                foo: makeFieldValue({
                  initial: 'foo-1-2',
                  value: 'foo-1-2'
                }),
                bar: makeFieldValue({
                  initial: 'bar-1-2',
                  value: 'bar-1-2'
                })
              }
            ]
          },
          {
            myField2: [
              {
                foo: makeFieldValue({
                  initial: 'foo-2-1',
                  value: 'foo-2-1'
                }),
                bar: makeFieldValue({
                  initial: 'bar-2-1',
                  value: 'bar-2-1'
                })
              },
              {
                foo: makeFieldValue({
                  initial: 'foo-2-2',
                  value: 'foo-2-2'
                }),
                bar: makeFieldValue({
                  initial: 'bar-2-2',
                  value: 'bar-2-2'
                })
              }
            ]
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...addArrayValue('myField[1].myField2', {foo: 'foo-2-3', bar: 'bar-2-3'}, undefined),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            myField2: [
              {
                foo: {
                  initial: 'foo-1-1',
                  value: 'foo-1-1'
                },
                bar: {
                  initial: 'bar-1-1',
                  value: 'bar-1-1'
                }
              },
              {
                foo: {
                  initial: 'foo-1-2',
                  value: 'foo-1-2'
                },
                bar: {
                  initial: 'bar-1-2',
                  value: 'bar-1-2'
                }
              },
            ],
          },
          {
            myField2: [
              {
                foo: {
                  initial: 'foo-2-1',
                  value: 'foo-2-1'
                },
                bar: {
                  initial: 'bar-2-1',
                  value: 'bar-2-1'
                }
              },
              {
                foo: {
                  initial: 'foo-2-2',
                  value: 'foo-2-2'
                },
                bar: {
                  initial: 'bar-2-2',
                  value: 'bar-2-2'
                }
              },
              {
                foo: {
                  initial: 'foo-2-3',
                  value: 'foo-2-3'
                },
                bar: {
                  initial: 'bar-2-3',
                  value: 'bar-2-3'
                }
              },
            ],
          },
        ],
        _active: undefined,
        _asyncValidating: false,
        _error: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].myField2)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].myField2[0])).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].myField2[0].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[0].myField2[0].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[0].myField2[1])).toBe(false);
    expect(isFieldValue(state.testForm.myField[0].myField2[1].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[0].myField2[1].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2)).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2[0])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2[0].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[0].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[1])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2[1].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[1].bar)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[2])).toBe(false);
    expect(isFieldValue(state.testForm.myField[1].myField2[2].foo)).toBe(true);
    expect(isFieldValue(state.testForm.myField[1].myField2[2].bar)).toBe(true);
  });

  it('should set value on blur with empty state', () => {
    const state = reducer({}, {
      ...blur('myField', 'myValue'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'myValue'
        },
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on blur and touch with empty state', () => {
    const state = reducer({}, {
      ...blur('myField', 'myValue'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'myValue',
          touched: true
        },
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on blur and touch with initial value', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'initialValue',
          touched: false
        }),
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myField', 'myValue'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'myValue',
          touched: true
        },
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should not modify value if undefined is passed on blur (for android react native)', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'myValue',
          touched: false
        }),
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myField'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'myValue',
          touched: true
        },
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should not modify value if undefined is passed on blur, even if no value existed (for android react native)', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          value: undefined
        }),
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myField'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: undefined,
          touched: true
        },
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set nested value on blur', () => {
    const state = reducer({
      foo: {
        myField: {
          mySubField: makeFieldValue({
            value: undefined
          })
        },
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myField.mySubField', 'hello'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          mySubField: {
            value: 'hello',
            touched: true
          }
        },
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.mySubField)).toBe(true);
  });

  it('should set array value on blur', () => {
    const state = reducer({
      foo: {
        myArray: [
          makeFieldValue({value: undefined})
        ],
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...blur('myArray[0]', 'hello'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myArray: [
          {
            value: 'hello',
            touched: true
          }
        ],
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myArray[0])).toBe(true);
  });

  it('should set value on change with empty state', () => {
    const state = reducer({}, {
      ...change('myField', 'myValue'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'myValue'
        },
        _active: undefined, // CHANGE doesn't touch _active
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on change and touch with empty state', () => {
    const state = reducer({}, {
      ...change('myField', 'myValue'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'myValue',
          touched: true
        },
        _active: undefined, // CHANGE doesn't touch _active
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on change and touch with initial value', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'initialValue',
          touched: false
        }),
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: 'Some global error',
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...change('myField', 'myValue'),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'myValue',
          touched: true
        },
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: 'Some global error',
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set value on change and remove field-level submit and async errors', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          value: 'initial',
          submitError: 'submit error',
          asyncError: 'async error'
        }),
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: 'Some global error',
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...change('myField', 'different'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'different'
        },
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: 'Some global error',
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set nested value on change with empty state', () => {
    const state = reducer({}, {
      ...change('myField.mySubField', 'myValue'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          mySubField: {
            value: 'myValue'
          }
        },
        _active: undefined, // CHANGE doesn't touch _active
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.mySubField)).toBe(true);
  });

  it('should set visited on focus and update active with no previous state', () => {
    const state = reducer({}, {
      ...focus('myField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          visited: true
        },
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set visited on focus and update active on deep field with no previous state', () => {
    const state = reducer({}, {
      ...focus('myField.subField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          subField: {
            visited: true
          }
        },
        _active: 'myField.subField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.subField)).toBe(true);
  });

  it('should set visited on focus and update current with previous state', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'initialValue',
          visited: false
        }),
        _active: 'otherField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...focus('myField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'initialValue',
          visited: true
        },
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set initialize values on initialize on empty state', () => {
    const state = reducer({}, {
      ...initialize({myField: 'initialValue'}, ['myField']),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'initialValue'
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: true,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should allow initializing null values', () => {
    const state = reducer({}, {
      ...initialize({bar: 'baz', dog: null}, ['bar', 'dog']),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        bar: {
          initial: 'baz',
          value: 'baz'
        },
        dog: {
          initial: null,
          value: null
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: true,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.bar)).toBe(true);
    expect(isFieldValue(state.foo.dog)).toBe(true);
  });

  it('should initialize nested values on initialize on empty state', () => {
    const state = reducer({}, {
      ...initialize({myField: {subField: 'initialValue'}}, ['myField.subField'], {}),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          subField: {
            initial: 'initialValue',
            value: 'initialValue'
          }
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: true,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField.subField)).toBe(true);
  });

  it('should initialize array values on initialize on empty state', () => {
    const state = reducer({}, {
      ...initialize({myField: ['initialValue']}, ['myField[]'], {}),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: [
          {
            initial: 'initialValue',
            value: 'initialValue'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: true,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(false);
    expect(isFieldValue(state.foo.myField[0])).toBe(true);
  });

  it('should initialize array values with subvalues on initialize on empty state', () => {
    const state = reducer({}, {
      ...initialize({
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
      }, ['accounts[].name', 'accounts[].email'], {}),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        accounts: [
          {
            name: {
              initial: 'Bobby Tables',
              value: 'Bobby Tables'
            },
            email: {
              initial: 'bobby@gmail.com',
              value: 'bobby@gmail.com'
            }
          },
          {
            name: {
              initial: 'Sammy Tables',
              value: 'Sammy Tables'
            },
            email: {
              initial: 'sammy@gmail.com',
              value: 'sammy@gmail.com'
            }
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: true,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.accounts)).toBe(false);
    expect(isFieldValue(state.foo.accounts[0])).toBe(false);
    expect(isFieldValue(state.foo.accounts[0].name)).toBe(true);
    expect(isFieldValue(state.foo.accounts[0].email)).toBe(true);
    expect(isFieldValue(state.foo.accounts[1])).toBe(false);
    expect(isFieldValue(state.foo.accounts[1].name)).toBe(true);
    expect(isFieldValue(state.foo.accounts[1].email)).toBe(true);
  });

  it('should set initialize values, making form pristine when initializing', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          value: 'dirtyValue',
          touched: true
        }),
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...initialize({myField: 'cleanValue'}, ['myField']),
      form: 'foo',
      touch: true
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'cleanValue',
          value: 'cleanValue'
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: true,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should pop an array value', () => {
    const state = reducer({
      testForm: {
        myField: [
          makeFieldValue({
            value: 'foo'
          }),
          makeFieldValue({
            value: 'bar'
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...removeArrayValue('myField'),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
  });

  it('should not change empty array value on remove', () => {
    const state = reducer({
      testForm: {
        myField: [],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...removeArrayValue('myField'),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should remove an array value from start of array', () => {
    const state = reducer({
      testForm: {
        myField: [
          makeFieldValue({
            value: 'foo'
          }),
          makeFieldValue({
            value: 'bar'
          }),
          makeFieldValue({
            value: 'baz'
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...removeArrayValue('myField', 0),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'bar'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
  });

  it('should remove an array value from middle of array', () => {
    const state = reducer({
      testForm: {
        myField: [
          makeFieldValue({
            value: 'foo'
          }),
          makeFieldValue({
            value: 'bar'
          }),
          makeFieldValue({
            value: 'baz'
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...removeArrayValue('myField', 1),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
  });

  it('should not change empty array value on swap', () => {
    const state = reducer({
      testForm: {
        myField: [],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...swapArrayValues('myField'),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should should swap two array values at different indexes', () => {
    const state = reducer({
      testForm: {
        myField: [
          makeFieldValue({
            value: 'foo'
          }),
          makeFieldValue({
            value: 'bar'
          }),
          makeFieldValue({
            value: 'baz'
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...swapArrayValues('myField', 0, 2),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'baz'
          },
          {
            value: 'bar'
          },
          {
            value: 'foo'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);

  });

  it('should not change array on swap with the same index', () => {
    const state = reducer({
      testForm: {
        myField: [
          makeFieldValue({
            value: 'foo'
          }),
          makeFieldValue({
            value: 'bar'
          }),
          makeFieldValue({
            value: 'baz'
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...swapArrayValues('myField', 1, 1),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'bar'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);

  });

  it('should not change array on swap with out of bounds index', () => {
    const state = reducer({
      testForm: {
        myField: [
          makeFieldValue({
            value: 'foo'
          }),
          makeFieldValue({
            value: 'bar'
          }),
          makeFieldValue({
            value: 'baz'
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...swapArrayValues('myField', 1, 4),
      form: 'testForm'
    });
    expect(state.testForm)
      .toEqual({
        myField: [
          {
            value: 'foo'
          },
          {
            value: 'bar'
          },
          {
            value: 'baz'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.testForm.myField)).toBe(false);
    expect(isFieldValue(state.testForm.myField[0])).toBe(true);
    expect(isFieldValue(state.testForm.myField[1])).toBe(true);
    expect(isFieldValue(state.testForm.myField[2])).toBe(true);

  });

  it('should reset values on reset on with previous state', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...reset(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'initialValue'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherInitialValue'
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should reset deep values on reset on with previous state', () => {
    const state = reducer({
      foo: {
        deepField: {
          myField: makeFieldValue({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          myOtherField: makeFieldValue({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        },
        _active: 'myField',
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...reset(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        deepField: {
          myField: {
            initial: 'initialValue',
            value: 'initialValue'
          },
          myOtherField: {
            initial: 'otherInitialValue',
            value: 'otherInitialValue'
          }
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.deepField)).toBe(false);
    expect(isFieldValue(state.foo.deepField.myField)).toBe(true);
    expect(isFieldValue(state.foo.deepField.myOtherField)).toBe(true);
  });

  it('should set asyncValidating on startAsyncValidation', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...startAsyncValidation(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: true,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set asyncValidating with field name on startAsyncValidation', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'initialValue'
        }),
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...startAsyncValidation('myField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'initialValue'
        },
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: 'myField',
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
  });

  it('should set submitting on startSubmit', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...startSubmit(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: true,
        _submitFailed: false
      });
  });

  it('should set submitting on startSubmit, and NOT reset submitFailed', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: true
      }
    }, {
      ...startSubmit(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: true,
        _submitFailed: true
      });
  });

  it('should set asyncError on nested fields on stopAsyncValidation', () => {
    const state = reducer({
      foo: {
        bar: {
          myField: makeFieldValue({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          myOtherField: makeFieldValue({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        },
        _active: undefined,
        _asyncValidating: true,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...stopAsyncValidation({
        bar: {
          myField: 'Error about myField',
          myOtherField: 'Error about myOtherField'
        }
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        bar: {
          myField: {
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true,
            asyncError: 'Error about myField'
          },
          myOtherField: {
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true,
            asyncError: 'Error about myOtherField'
          }
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.bar)).toBe(false);
    expect(isFieldValue(state.foo.bar.myField)).toBe(true);
    expect(isFieldValue(state.foo.bar.myOtherField)).toBe(true);
  });

  it('should set asyncError on array fields on stopAsyncValidation', () => {
    const state = reducer({
      foo: {
        bar: [
          makeFieldValue({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          makeFieldValue({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        ],
        _active: undefined,
        _asyncValidating: true,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...stopAsyncValidation({
        bar: [
          'Error about myField',
          'Error about myOtherField'
        ]
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        bar: [
          {
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true,
            asyncError: 'Error about myField'
          },
          {
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true,
            asyncError: 'Error about myOtherField'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.bar)).toBe(false);
    expect(isFieldValue(state.foo.bar[0])).toBe(true);
    expect(isFieldValue(state.foo.bar[1])).toBe(true);
  });

  it('should unset asyncValidating on stopAsyncValidation', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: true,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...stopAsyncValidation({
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true,
          asyncError: 'Error about myField'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true,
          asyncError: 'Error about myOtherField'
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unset field async errors on stopAsyncValidation', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          asyncError: 'myFieldError',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          asyncError: 'myOtherFieldError',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: true,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...stopAsyncValidation(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unset asyncValidating on stopAsyncValidation and set global error', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: true,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...stopAsyncValidation({
        [globalErrorKey]: 'This is a global error'
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: 'This is a global error',
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unset submitting on stopSubmit', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: true,
        _submitFailed: false
      }
    }, {
      ...stopSubmit(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should set submitError on nested fields on stopSubmit', () => {
    const state = reducer({
      foo: {
        bar: {
          myField: makeFieldValue({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          myOtherField: makeFieldValue({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: true,
        _submitFailed: false
      }
    }, {
      ...stopSubmit({
        bar: {
          myField: 'Error about myField',
          myOtherField: 'Error about myOtherField'
        }
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        bar: {
          myField: {
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true,
            submitError: 'Error about myField'
          },
          myOtherField: {
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true,
            submitError: 'Error about myOtherField'
          }
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: true
      });
    expect(isFieldValue(state.foo.bar)).toBe(false);
    expect(isFieldValue(state.foo.bar.myField)).toBe(true);
    expect(isFieldValue(state.foo.bar.myOtherField)).toBe(true);
  });

  it('should set submitError on array fields on stopSubmit', () => {
    const state = reducer({
      foo: {
        bar: [
          makeFieldValue({
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true
          }),
          makeFieldValue({
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: true,
        _submitFailed: false
      }
    }, {
      ...stopSubmit({
        bar: [
          'Error about myField',
          'Error about myOtherField'
        ]
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        bar: [
          {
            initial: 'initialValue',
            value: 'dirtyValue',
            touched: true,
            submitError: 'Error about myField'
          },
          {
            initial: 'otherInitialValue',
            value: 'otherDirtyValue',
            touched: true,
            submitError: 'Error about myOtherField'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: true
      });
    expect(isFieldValue(state.foo.bar)).toBe(false);
    expect(isFieldValue(state.foo.bar[0])).toBe(true);
    expect(isFieldValue(state.foo.bar[1])).toBe(true);
  });

  it('should unset submitFailed on stopSubmit with no errors', () => {
    const state = reducer({
      foo: {
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: true,
        _submitFailed: true
      }
    }, {
      ...stopSubmit(),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        doesnt: 'matter',
        should: 'notchange',
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should unset submitting and set submit errors on stopSubmit', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: true,
        _submitFailed: false
      }
    }, {
      ...stopSubmit({
        myField: 'Error about myField',
        myOtherField: 'Error about myOtherField'
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true,
          submitError: 'Error about myField'
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true,
          submitError: 'Error about myOtherField'
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: true
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unset submitting and set submit global error on stopSubmit', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: true,
        _submitFailed: false
      }
    }, {
      ...stopSubmit({
        [globalErrorKey]: 'This is a global error'
      }),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          initial: 'initialValue',
          value: 'dirtyValue',
          touched: true
        },
        myOtherField: {
          initial: 'otherInitialValue',
          value: 'otherDirtyValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: 'This is a global error',
        _initialized: false,
        _submitting: false,
        _submitFailed: true
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should mark fields as touched on touch', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          value: 'initialValue',
          touched: false
        }),
        myOtherField: makeFieldValue({
          value: 'otherInitialValue',
          touched: false
        }),
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...touch('myField', 'myOtherField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'initialValue',
          touched: true
        },
        myOtherField: {
          value: 'otherInitialValue',
          touched: true
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should mark deep fields as touched on touch', () => {
    const state = reducer({
      foo: {
        deep: {
          myField: makeFieldValue({
            value: 'initialValue',
            touched: false
          }),
          myOtherField: makeFieldValue({
            value: 'otherInitialValue',
            touched: false
          }),
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...touch('deep.myField', 'deep.myOtherField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        deep: {
          myField: {
            value: 'initialValue',
            touched: true
          },
          myOtherField: {
            value: 'otherInitialValue',
            touched: true
          }
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.deep)).toBe(false);
    expect(isFieldValue(state.foo.deep.myField)).toBe(true);
    expect(isFieldValue(state.foo.deep.myOtherField)).toBe(true);
  });

  it('should mark array fields as touched on touch', () => {
    const state = reducer({
      foo: {
        myFields: [
          makeFieldValue({
            value: 'initialValue',
            touched: false
          }),
          makeFieldValue({
            value: 'otherInitialValue',
            touched: false
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...touch('myFields[0]', 'myFields[1]'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myFields: [
          {
            value: 'initialValue',
            touched: true
          },
          {
            value: 'otherInitialValue',
            touched: true
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array fields as touched on touch', () => {
    const state = reducer({
      foo: {
        myFields: [
          makeFieldValue({
            value: 'initialValue',
            touched: false
          }),
          makeFieldValue({
            value: 'otherInitialValue',
            touched: false
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...touch('myFields[]'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myFields: [
          {
            value: 'initialValue',
            touched: true
          },
          {
            value: 'otherInitialValue',
            touched: true
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array subfields as touched on touch', () => {
    const state = reducer({
      foo: {
        myFields: [
          {
            name: makeFieldValue({
              value: 'initialValue',
              touched: false
            })
          },
          {
            name: makeFieldValue({
              value: 'otherInitialValue',
              touched: false
            })
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...touch('myFields[].name'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myFields: [
          {
            name: {
              value: 'initialValue',
              touched: true
            }
          },
          {
            name: {
              value: 'otherInitialValue',
              touched: true
            }
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(false);
    expect(isFieldValue(state.foo.myFields[0].name)).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(false);
    expect(isFieldValue(state.foo.myFields[1].name)).toBe(true);
  });

  it('should ignore empty index-less array fields on touch', () => {
    const state = reducer({
      foo: {
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...touch('myFields[]'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should ignore empty index-less array subfields on touch', () => {
    const state = reducer({
      foo: {
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...touch('myFields[].name'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
  });

  it('should unmark fields as touched on untouch', () => {
    const state = reducer({
      foo: {
        myField: makeFieldValue({
          value: 'initialValue',
          touched: true
        }),
        myOtherField: makeFieldValue({
          value: 'otherInitialValue',
          touched: true
        }),
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...untouch('myField', 'myOtherField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myField: {
          value: 'initialValue'
        },
        myOtherField: {
          value: 'otherInitialValue'
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myField)).toBe(true);
    expect(isFieldValue(state.foo.myOtherField)).toBe(true);
  });

  it('should unmark deep fields as touched on untouch', () => {
    const state = reducer({
      foo: {
        deep: {
          myField: makeFieldValue({
            value: 'initialValue',
            touched: true
          }),
          myOtherField: makeFieldValue({
            value: 'otherInitialValue',
            touched: true
          })
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...untouch('deep.myField', 'deep.myOtherField'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        deep: {
          myField: {
            value: 'initialValue'
          },
          myOtherField: {
            value: 'otherInitialValue'
          }
        },
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.deep)).toBe(false);
    expect(isFieldValue(state.foo.deep.myField)).toBe(true);
    expect(isFieldValue(state.foo.deep.myOtherField)).toBe(true);
  });

  it('should unmark array fields as touched on untouch', () => {
    const state = reducer({
      foo: {
        myFields: [
          makeFieldValue({
            value: 'initialValue',
            touched: true
          }),
          makeFieldValue({
            value: 'otherInitialValue',
            touched: true
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...untouch('myFields[0]', 'myFields[1]'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myFields: [
          {
            value: 'initialValue'
          },
          {
            value: 'otherInitialValue'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array fields as touched on touch', () => {
    const state = reducer({
      foo: {
        myFields: [
          makeFieldValue({
            value: 'initialValue',
            touched: true
          }),
          makeFieldValue({
            value: 'otherInitialValue',
            touched: true
          })
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...untouch('myFields[]'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myFields: [
          {
            value: 'initialValue'
          },
          {
            value: 'otherInitialValue'
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(true);
  });

  it('should mark index-less array subfields as touched on touch', () => {
    const state = reducer({
      foo: {
        myFields: [
          {
            name: makeFieldValue({
              value: 'initialValue',
              touched: true
            })
          },
          {
            name: makeFieldValue({
              value: 'otherInitialValue',
              touched: true
            })
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...untouch('myFields[].name'),
      form: 'foo'
    });
    expect(state.foo)
      .toEqual({
        myFields: [
          {
            name: {
              value: 'initialValue'
            }
          },
          {
            name: {
              value: 'otherInitialValue'
            }
          }
        ],
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      });
    expect(isFieldValue(state.foo.myFields)).toBe(false);
    expect(isFieldValue(state.foo.myFields[0])).toBe(false);
    expect(isFieldValue(state.foo.myFields[0].name)).toBe(true);
    expect(isFieldValue(state.foo.myFields[1])).toBe(false);
    expect(isFieldValue(state.foo.myFields[1].name)).toBe(true);
  });

  it('should destroy forms on destroy', () => {
    const state = reducer({
      foo: {
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      },
      bar: {
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...destroy(),
      form: 'foo'
    });
    expect(state)
      .toEqual({
        bar: {
          _active: undefined,
          _asyncValidating: false,
          [globalErrorKey]: undefined,
          _initialized: false,
          _submitting: false,
          _submitFailed: false
        }
      });
  });

  it('should destroy last form on destroy', () => {
    const state = reducer({
      foo: {
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    }, {
      ...destroy(),
      form: 'foo'
    });
    expect(state)
      .toEqual({});
  });

  it('should destroy form and formkey on destroy', () => {
    const destroyWithKey = (key) => bindActionData(destroy, {key})();
    const state = reducer({
      fooForm: {
        barKey: {
          _active: undefined,
          _asyncValidating: false,
          [globalErrorKey]: undefined,
          _initialized: false,
          _submitting: false,
          _submitFailed: false
        },
        bazKey: {
          _active: undefined,
          _asyncValidating: false,
          [globalErrorKey]: undefined,
          _initialized: false,
          _submitting: false,
          _submitFailed: false
        }
      }
    }, {
      ...destroyWithKey('barKey'),
      form: 'fooForm'
    });
    expect(state.fooForm).toEqual({
      bazKey: {
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      }
    });
  });

  describe('reducer.plugin', () => {
    it('should initialize form state when there is a reducer plugin', () => {
      const result = reducer.plugin({
        foo: (state) => state
      })();
      expect(result)
        .toExist()
        .toBeA('object');
      expect(Object.keys(result).length).toBe(1);
      expect(result.foo)
        .toExist()
        .toBeA('object')
        .toEqual({
          _active: undefined,
          _asyncValidating: false,
          [globalErrorKey]: undefined,
          _initialized: false,
          _submitting: false,
          _submitFailed: false
        });
    });
  });

  describe('reducer.normalize', () => {
    it('should initialize form state when there is a normalizer', () => {
      const state = reducer.normalize({
        foo: {
          myField: () => 'normalized'
        }
      })();
      expect(state)
        .toExist()
        .toBeA('object');
      expect(Object.keys(state).length).toBe(1);
      expect(state.foo)
        .toExist()
        .toBeA('object')
        .toEqual({
          _active: undefined,
          _asyncValidating: false,
          [globalErrorKey]: undefined,
          _initialized: false,
          _submitting: false,
          _submitFailed: false,
          myField: {
            value: 'normalized'
          }
        });
    });

    it('should normalize keyed forms depending on action form key', () => {
      const defaultFields = {
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      };
      const normalize = reducer.normalize({
        foo: {
          myField: () => 'normalized'
        }
      });
      const state = normalize({
        foo: {
          firstSubform: {}
        }
      }, {
        form: 'foo',
        key: 'firstSubform'
      });
      const nextState = normalize(state, {
        form: 'foo',
        key: 'secondSubForm'
      });
      expect(state)
        .toExist()
        .toBeA('object');
      expect(Object.keys(state).length).toBe(1);
      expect(state.foo)
        .toExist()
        .toBeA('object')
        .toEqual({
          firstSubform: {
            ...defaultFields,
            myField: {
              value: 'normalized'
            }
          }
        });
      expect(nextState.foo)
        .toEqual({
          firstSubform: {
            ...defaultFields,
            myField: {
              value: 'normalized'
            }
          },
          secondSubForm: {
            ...defaultFields,
            myField: {
              value: 'normalized'
            }
          }
        });
    });

    it('should normalize simple form values', () => {
      const defaultFields = {
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      };
      const normalize = reducer.normalize({
        foo: {
          name: () => 'normalized'
        }
      });
      const state = normalize({
        foo: {
          name: {
            value: 'dog'
          }
        }
      });
      expect(state)
        .toExist()
        .toBeA('object');
      expect(state.foo)
        .toExist()
        .toBeA('object')
        .toEqual({
          ...defaultFields,
          name: {
            value: 'normalized'
          }
        });
    });

    it('should allow resetForm to work on a normalized form', () => {
      const defaultFields = {
        _active: undefined,
        _asyncValidating: false,
        [globalErrorKey]: undefined,
        _initialized: false,
        _submitting: false,
        _submitFailed: false
      };
      const normalizingReducer = reducer.normalize({
        foo: {
          name: value => value && value.toUpperCase()
        }
      });
      const empty = normalizingReducer();
      const state = normalizingReducer(empty, {
        form: 'foo',
        ...change('name', 'dog')
      });
      expect(state)
        .toExist()
        .toBeA('object');
      expect(state.foo)
        .toExist()
        .toBeA('object')
        .toEqual({
          ...defaultFields,
          name: {
            value: 'DOG'
          }
        });
      const result = normalizingReducer(state, {
        form: 'foo',
        ...reset()
      });
      expect(result)
        .toExist()
        .toBeA('object');
      expect(result.foo)
        .toExist()
        .toBeA('object')
        .toEqual({
          ...defaultFields,
          name: {
            value: undefined
          }
        });
    });
  });
});
