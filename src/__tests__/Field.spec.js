/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { createSpy } from 'expect'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-addons-test-utils'
import createReduxForm from '../reduxForm'
import createReducer from '../reducer'
import createField from '../Field'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeField = (name, structure, combineReducers, expect) => {
  const reduxForm = createReduxForm(structure)
  const Field = createField(structure)
  const reducer = createReducer(structure)
  const { fromJS } = structure
  const makeStore = (initial) => createStore(
    combineReducers({ form: reducer }), fromJS({ form: initial }))

  class TestInput extends Component {
    render() {
      return <div>TEST INPUT</div>
    }
  }


  const testProps = (state, config = {}) => {
    const store = makeStore({ testForm: state })
    class Form extends Component {
      render() {
        return <div><Field name="foo" component={TestInput}/></div>
      }
    }
    const TestForm = reduxForm({ form: 'testForm', ...config })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm/>
      </Provider>
    )
    return TestUtils.findRenderedComponentWithType(dom, TestInput).props
  }

  describe(name, () => {
    it('should throw an error if not in ReduxForm', () => {
      expect(() => {
        TestUtils.renderIntoDocument(<div>
            <Field name="foo" component={TestInput}/>
          </div>
        )
      }).toThrow(/must be inside a component decorated with reduxForm/)
    })

    it('should get value from Redux state', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props.value).toBe('bar')
    })

    it('should get dirty/pristine from Redux state', () => {
      const props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      })
      expect(props1.pristine).toBe(true)
      expect(props1.dirty).toBe(false)
      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      })
      expect(props2.pristine).toBe(false)
      expect(props2.dirty).toBe(true)
    })

    it('should get asyncValidating from Redux state', () => {
      const props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        asyncValidating: 'dog'
      })
      expect(props1.asyncValidating).toBe(false)
      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        },
        asyncValidating: 'foo'
      })
      expect(props2.asyncValidating).toBe(true)
    })

    it('should get sync errors from outer reduxForm component', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }, {
        validate: () => ({ foo: 'foo error' })
      })
      expect(props.error).toBe('foo error')
    })

    it('should get async errors from Redux state', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        asyncErrors: {
          foo: 'foo error'
        }
      })
      expect(props.error).toBe('foo error')
    })

    it('should get submit errors from Redux state', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        submitErrors: {
          foo: 'foo error'
        }
      })
      expect(props.error).toBe('foo error')
    })

    it('should provide name getter', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      })
      class Form extends Component {
        render() {
          return <div><Field name="foo" component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Field)
      expect(stub.name).toBe('foo')
    })

    it('should provide value getter', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      })
      class Form extends Component {
        render() {
          return <div><Field name="foo" component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Field)
      expect(stub.value).toBe('bar')
    })

    it('should provide dirty getter that is true when dirty', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      })
      class Form extends Component {
        render() {
          return <div><Field name="foo" component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Field)
      expect(stub.dirty).toBe(true)
    })

    it('should provide dirty getter that is false when pristine', () => {
      const store = makeStore({
        testForm: {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        }
      })
      class Form extends Component {
        render() {
          return <div><Field name="foo" component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Field)
      expect(stub.dirty).toBe(false)
    })
    
    it('should provide pristine getter that is false when dirty', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      })
      class Form extends Component {
        render() {
          return <div><Field name="foo" component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Field)
      expect(stub.pristine).toBe(false)
    })

    it('should provide pristine getter that is true when pristine', () => {
      const store = makeStore({
        testForm: {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        }
      })
      class Form extends Component {
        render() {
          return <div><Field name="foo" component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Field)
      expect(stub.pristine).toBe(true)
    })

    it('should have value set to initial value on first render', () => {
      const store = makeStore({})
      const input = createSpy(props => <input {...props}/>).andCallThrough()
      class Form extends Component {
        render() {
          return <div><Field name="foo" component={input}/></div>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm'
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm initialValues={{ foo: 'bar' }}/>
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls[0].arguments[0].value).toBe('bar')
    })

    it('should provide sync error for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [ 'bar' ]
          }
        }
      })
      const input = createSpy(props => <input {...props}/>).andCallThrough()
      const validate = () => ({ foo: [ 'bar error' ] })
      class Form extends Component {
        render() {
          return <div><Field name="foo[0]" component={input}/></div>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        validate
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls[0].arguments[0].valid).toBe(false)
      expect(input.calls[0].arguments[0].error).toBe('bar error')
    })

    it('should provide access to rendered component', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      })
      class Form extends Component {
        render() {
          return <div><Field name="foo" component={TestInput} withRef/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const field = TestUtils.findRenderedComponentWithType(dom, Field)
      const input = TestUtils.findRenderedComponentWithType(dom, TestInput)

      expect(field.getRenderedComponent()).toBe(input)
    })

    it('should reconnect when name changes', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          },
          fields: {
            bar: {
              touched: true
            }
          }
        }
      })
      const input = createSpy(props => <input {...props}/>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { field: 'foo' }
        }

        render() {
          return (<div>
            <Field name={this.state.field} component={input}/>
            <button onClick={() => this.setState({ field: 'bar' })}>Change</button>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].value).toBe('fooValue')
      expect(input.calls[ 0 ].arguments[ 0 ].touched).toBe(false)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].value).toBe('barValue')
      expect(input.calls[ 1 ].arguments[ 0 ].touched).toBe(true)
    })

    it('should rerender when props change', () => {
      const store = makeStore()
      const input = createSpy(props => <input {...props}/>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { foo: 'foo', bar: 'bar' }
        }

        render() {
          return (<div>
            <Field name="foo" foo={this.state.foo} bar={this.state.bar} component={input}/>
            <button onClick={() => this.setState({ foo: 'qux', bar: 'baz' })}>Change</button>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].foo).toBe('foo')
      expect(input.calls[ 0 ].arguments[ 0 ].bar).toBe('bar')

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].foo).toBe('qux')
      expect(input.calls[ 1 ].arguments[ 0 ].bar).toBe('baz')
    })

    // ----------------------------------------------
    // Uncomment this to confirm that #1024 is fixed.
    // ----------------------------------------------
    // it('should rerender when sync error changes', () => {
    //   const store = makeStore({
    //     testForm: {
    //       values: {
    //         password: 'redux-form sucks',
    //         confirm: 'redux-form rocks'
    //       }
    //     }
    //   })
    //   const passwordInput = createSpy(props => <input {...props}/>).andCallThrough()
    //   const confirmInput = createSpy(props => <input {...props}/>).andCallThrough()
    //   const validate = ({ password, confirm }) =>
    //     password === confirm ? {} : { confirm: 'Must match!' }
    //   class Form extends Component {
    //     render() {
    //       return (<div>
    //         <Field name="password" component={passwordInput}/>
    //         <Field name="confirm" component={confirmInput}/>
    //       </div>)
    //     }
    //   }
    //   const TestForm = reduxForm({
    //     form: 'testForm',
    //     validate
    //   })(Form)
    //   const dom = TestUtils.renderIntoDocument(
    //     <Provider store={store}>
    //       <TestForm/>
    //     </Provider>
    //   )
    //
    //   // password input rendered
    //   expect(passwordInput).toHaveBeenCalled()
    //   expect(passwordInput.calls.length).toBe(1)
    //
    //   // confirm input rendered with error
    //   expect(confirmInput).toHaveBeenCalled()
    //   expect(confirmInput.calls.length).toBe(1)
    //   expect(confirmInput.calls[ 0 ].arguments[ 0 ].valid).toBe(false)
    //   expect(confirmInput.calls[ 0 ].arguments[ 0 ].error).toBe('Must match!')
    //
    //   // update password field so that they match
    //   passwordInput.calls[ 0 ].arguments[ 0 ].onChange('redux-form rocks')
    //
    //   // password input rerendered
    //   expect(passwordInput.calls.length).toBe(2)
    //
    //   // confirm input should also rerender, but with no error
    //   expect(confirmInput.calls.length).toBe(2)
    //   expect(confirmInput.calls[ 1 ].arguments[ 0 ].valid).toBe(true)
    //   expect(confirmInput.calls[ 1 ].arguments[ 0 ].error).toBe(undefined)
    // })
  })
}

describeField('Field.plain', plain, plainCombineReducers, addExpectations(plainExpectations))
describeField('Field.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations))
