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
  const { fromJS, getIn } = structure
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
      expect(props.input.value).toBe('bar')
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
      expect(props1.meta.pristine).toBe(true)
      expect(props1.meta.dirty).toBe(false)
      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      })
      expect(props2.meta.pristine).toBe(false)
      expect(props2.meta.dirty).toBe(true)
    })

    it('should allow an empty value from Redux state to be pristine', () => {
      const props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: ''
        }
      })
      expect(props1.meta.pristine).toBe(false)
      expect(props1.meta.dirty).toBe(true)
      const props2 = testProps({
        initial: {
          foo: ''
        },
        values: {
          foo: ''
        }
      })
      expect(props2.meta.pristine).toBe(true)
      expect(props2.meta.dirty).toBe(false)
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
      expect(props1.meta.asyncValidating).toBe(false)
      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        },
        asyncValidating: 'foo'
      })
      expect(props2.meta.asyncValidating).toBe(true)
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
      expect(props.meta.error).toBe('foo error')
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
      expect(props.meta.error).toBe('foo error')
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
      expect(props.meta.error).toBe('foo error')
    })

    it('should provide meta.dispatch', () => {
      const props = testProps({})
      expect(props.meta.dispatch)
        .toExist()
        .toBeA('function')
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
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
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
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('bar')
    })

    it('should provide sync error for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [ 'bar' ]
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
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
      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].meta.valid).toBe(false)
      expect(input.calls[ 0 ].arguments[ 0 ].meta.error).toBe('bar error')
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
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
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
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('fooValue')
      expect(input.calls[ 0 ].arguments[ 0 ].meta.touched).toBe(false)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].input.value).toBe('barValue')
      expect(input.calls[ 1 ].arguments[ 0 ].meta.touched).toBe(true)
    })

    it('should re-register when name changes', () => {
      const store = makeStore()
      class Form extends Component {
        constructor() {
          super()
          this.state = { field: 'foo' }
        }

        render() {
          return (<div>
            <Field name={this.state.field} component="input"/>
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

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'foo', type: 'Field' } ]
          }
        }
      })

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'bar', type: 'Field' } ]
          }
        }
      })
    })

    it('should rerender when props change', () => {
      const store = makeStore()
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { foo: 'foo' }
        }

        render() {
          return (<div>
            <Field name="foo" rel={this.state.foo} component={input}/>
            <button onClick={() => this.setState({ foo: 'qux' })}>Change</button>
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
      expect(input.calls[ 0 ].arguments[ 0 ].rel).toBe('foo')

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].rel).toBe('qux')
    })

    it('should NOT rerender when props.props is shallow-equal, but !==', () => {
      const store = makeStore()
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderSpy = createSpy()
      class Form extends Component {
        constructor() {
          super()
          this.state = { foo: 'bar' }
        }

        render() {
          renderSpy()
          return (<div>
            <Field name="myField" component={input} props={{ rel: 'test' }}/>
            <button onClick={() => this.setState({ foo: 'qux' })}>Change</button>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(renderSpy).toHaveBeenCalled()
      expect(renderSpy.calls.length).toBe(1)

      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].rel).toBe('test')

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(renderSpy.calls.length).toBe(2)

      expect(input.calls.length).toBe(1)
    })

    it('should call normalize function on change', () => {
      const store = makeStore({
        testForm: {
          values: {
            title: 'Redux Form',
            author: 'Erik Rasmussen',
            username: 'oldusername'
          }
        }
      })
      const renderUsername = createSpy(props => <input {...props.input}/>).andCallThrough()
      const normalize = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="title" component="input"/>
              <Field name="author" component="input"/>
              <Field name="username" component={renderUsername} normalize={normalize}/>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      expect(normalize).toNotHaveBeenCalled()

      expect(renderUsername.calls[ 0 ].arguments[ 0 ].input.value).toBe('oldusername')
      renderUsername.calls[ 0 ].arguments[ 0 ].input.onChange('ERIKRAS')

      expect(normalize)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(
          'ERIKRAS',
          'oldusername',
          fromJS({
            title: 'Redux Form',
            author: 'Erik Rasmussen',
            username: 'ERIKRAS'
          }), fromJS({
            title: 'Redux Form',
            author: 'Erik Rasmussen',
            username: 'oldusername'
          })
        )
      expect(normalize.calls.length).toBe(1)

      expect(renderUsername.calls[ 1 ].arguments[ 0 ].input.value).toBe('erikras')
    })

    it('should call normalize function on blur', () => {
      const store = makeStore({
        testForm: {
          values: {
            title: 'Redux Form',
            author: 'Erik Rasmussen',
            username: 'oldusername'
          }
        }
      })
      const renderUsername = createSpy(props => <input {...props.input}/>).andCallThrough()
      const normalize = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="title" component="input"/>
              <Field name="author" component="input"/>
              <Field name="username" component={renderUsername} normalize={normalize}/>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      expect(normalize).toNotHaveBeenCalled()

      expect(renderUsername.calls[ 0 ].arguments[ 0 ].input.value).toBe('oldusername')
      renderUsername.calls[ 0 ].arguments[ 0 ].input.onBlur('ERIKRAS')

      expect(normalize)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(
          'ERIKRAS',
          'oldusername',
          fromJS({
            title: 'Redux Form',
            author: 'Erik Rasmussen',
            username: 'ERIKRAS'
          }), fromJS({
            title: 'Redux Form',
            author: 'Erik Rasmussen',
            username: 'oldusername'
          })
        )
      expect(normalize.calls.length).toBe(1)

      expect(renderUsername.calls[ 1 ].arguments[ 0 ].input.value).toBe('erikras')
    })

    it('should call format function on first render', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'Redux Form'
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const format = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="name" component={input} format={format}/>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      expect(format).toHaveBeenCalled()
      expect(format.calls.length).toBe(1)
      expect(format.calls[ 0 ].arguments).toEqual([ 'Redux Form' ])

      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('redux form')
    })

    it('should call parse function on change', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const parse = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="name" component={input} parse={parse}/>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      expect(parse).toNotHaveBeenCalled()

      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('redux form')

      input.calls[ 0 ].arguments[ 0 ].input.onChange('REDUX FORM ROCKS')

      expect(parse).toHaveBeenCalled()
      expect(parse.calls.length).toBe(1)
      expect(parse.calls[ 0 ].arguments).toEqual([ 'REDUX FORM ROCKS' ])

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].input.value).toBe('redux form rocks')
    })

    it('should call parse function on blur', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const parse = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="name" component={input} parse={parse}/>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      expect(parse).toNotHaveBeenCalled()

      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('redux form')

      input.calls[ 0 ].arguments[ 0 ].input.onBlur('REDUX FORM ROCKS')

      expect(parse).toHaveBeenCalled()
      expect(parse.calls.length).toBe(1)
      expect(parse.calls[ 0 ].arguments).toEqual([ 'REDUX FORM ROCKS' ])

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].input.value).toBe('redux form rocks')
    })

    it('should parse and format to maintain different type in store', () => {
      const store = makeStore({
        testForm: {
          values: {
            age: 42
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const parse = createSpy(value => value && parseInt(value)).andCallThrough()
      const format = createSpy(value => value && value.toString()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="age" component={input} format={format} parse={parse}/>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      // format called once
      expect(format).toHaveBeenCalled()
      expect(format.calls.length).toBe(1)

      // parse not called yet
      expect(parse).toNotHaveBeenCalled()

      // input displaying string value
      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('42')

      // update value
      input.calls[ 0 ].arguments[ 0 ].input.onChange('15')

      // parse was called
      expect(parse).toHaveBeenCalled()
      expect(parse.calls.length).toBe(1)
      expect(parse.calls[ 0 ].arguments).toEqual([ '15' ])

      // value in store is number
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              age: 15 // number
            },
            registeredFields: [ { name: 'age', type: 'Field' } ]
          }
        }
      })

      // format called again
      expect(format).toHaveBeenCalled()
      expect(format.calls.length).toBe(2)
      expect(format.calls[ 1 ].arguments).toEqual([ 15 ])

      // input rerendered with string value
      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].input.value).toBe('15')
    })

    it('should rerender when sync error changes', () => {
      const store = makeStore({
        testForm: {
          values: {
            password: 'redux-form sucks',
            confirm: 'redux-form rocks'
          }
        }
      })
      const passwordInput = createSpy(props => <input {...props.input}/>).andCallThrough()
      const confirmInput = createSpy(props => <input {...props.input}/>).andCallThrough()
      const validate = values => {
        const password = getIn(values, 'password')
        const confirm = getIn(values, 'confirm')
        return password === confirm ? {} : { confirm: 'Must match!' }
      }
      class Form extends Component {
        render() {
          return (<div>
            <Field name="password" component={passwordInput}/>
            <Field name="confirm" component={confirmInput}/>
          </div>)
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

      // password input rendered
      expect(passwordInput).toHaveBeenCalled()
      expect(passwordInput.calls.length).toBe(1)

      // confirm input rendered with error
      expect(confirmInput).toHaveBeenCalled()
      expect(confirmInput.calls.length).toBe(1)
      expect(confirmInput.calls[ 0 ].arguments[ 0 ].meta.valid).toBe(false)
      expect(confirmInput.calls[ 0 ].arguments[ 0 ].meta.error).toBe('Must match!')

      // update password field so that they match
      passwordInput.calls[ 0 ].arguments[ 0 ].input.onChange('redux-form rocks')

      // password input rerendered
      expect(passwordInput.calls.length).toBe(2)

      // confirm input should also rerender, but with no error
      expect(confirmInput.calls.length).toBe(2)
      expect(confirmInput.calls[ 1 ].arguments[ 0 ].meta.valid).toBe(true)
      expect(confirmInput.calls[ 1 ].arguments[ 0 ].meta.error).toBe(undefined)
    })

    it('should rerender when sync error is cleared', () => {
      const store = makeStore()
      const usernameInput = createSpy(props => <input {...props.input}/>).andCallThrough()
      const validate = values => {
        const username = getIn(values, 'username')
        return username ? {} : { username: 'Required' }
      }
      class Form extends Component {
        render() {
          return (<div>
            <Field name="username" component={usernameInput}/>
          </div>)
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

      // username input rendered
      expect(usernameInput).toHaveBeenCalled()
      expect(usernameInput.calls.length).toBe(1)

      // username field has error
      expect(usernameInput.calls[ 0 ].arguments[ 0 ].meta.valid).toBe(false)
      expect(usernameInput.calls[ 0 ].arguments[ 0 ].meta.error).toBe('Required')

      // update username field so it passes
      usernameInput.calls[ 0 ].arguments[ 0 ].input.onChange('erikras')

      // username input rerendered twice, once for value, once for sync error
      expect(usernameInput.calls.length).toBe(3)

      // should be valid now
      expect(usernameInput.calls[ 2 ].arguments[ 0 ].meta.valid).toBe(true)
      expect(usernameInput.calls[ 2 ].arguments[ 0 ].meta.error).toBe(undefined)
    })
  })
}

describeField('Field.plain', plain, plainCombineReducers, addExpectations(plainExpectations))
describeField('Field.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations))
