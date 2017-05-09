/* eslint react/no-multi-comp:0 */
import React, {Component} from 'react'
import {createSpy} from 'expect'
import {Provider} from 'react-redux'
import {combineReducers as plainCombineReducers, createStore} from 'redux'
import {combineReducers as immutableCombineReducers} from 'redux-immutablejs'
import TestUtils from 'react-dom/test-utils'
import createReduxForm from '../createReduxForm'
import createReducer from '../createReducer'
import createField from '../createField'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'
import {dragStartMock, dropMock} from '../util/eventMocks'
import {dataKey} from '../util/eventConsts'

const testFormName = 'testForm'

const describeField = (name, structure, combineReducers, expect) => {
  const reduxForm = createReduxForm(structure)
  const Field = createField(structure)
  const reducer = createReducer(structure)
  const {fromJS, getIn} = structure
  const makeStore = initial =>
    createStore(combineReducers({form: reducer}), fromJS({form: initial}))

  class TestInput extends Component {
    render() {
      return <div>TEST INPUT</div>
    }
  }

  const testProps = (state, config = {}) => {
    const store = makeStore({[testFormName]: state})
    class Form extends Component {
      render() {
        return <div><Field name="foo" component={TestInput} /></div>
      }
    }
    const TestForm = reduxForm({form: testFormName, ...config})(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    return TestUtils.findRenderedComponentWithType(dom, TestInput).props
  }

  describe(name, () => {
    it('should throw an error if not in ReduxForm', () => {
      expect(() => {
        TestUtils.renderIntoDocument(
          <div>
            <Field name="foo" component={TestInput} />
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

    it('should get initial value from Redux state', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      })
      expect(props.meta.initial).toBe('bar')
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
      const props3 = testProps({
        initial: {
          foo: [4, 'abc', {def: null, key: [-45, '...', [0, 99]]}]
        },
        values: {
          foo: [4, 'abc', {def: null, key: [-45, '...', [0, 99]]}]
        }
      })
      expect(props3.meta.pristine).toBe(true)
      expect(props3.meta.dirty).toBe(false)
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

    it('should get active from Redux state', () => {
      const props1 = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props1.meta.active).toBe(false)
      const props2 = testProps({
        values: {
          foo: 'bar'
        },
        fields: {
          foo: {
            active: true
          }
        }
      })
      expect(props2.meta.active).toBe(true)
    })

    it('should get autofilled from Redux state', () => {
      const props1 = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props1.meta.autofilled).toBe(false)
      const props2 = testProps({
        values: {
          foo: 'bar'
        },
        fields: {
          foo: {
            autofilled: true
          }
        }
      })
      expect(props2.meta.autofilled).toBe(true)
    })

    it('should get touched from Redux state', () => {
      const props1 = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props1.meta.touched).toBe(false)
      const props2 = testProps({
        values: {
          foo: 'bar'
        },
        fields: {
          foo: {
            touched: true
          }
        }
      })
      expect(props2.meta.touched).toBe(true)
    })

    it('should get visited from Redux state', () => {
      const props1 = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props1.meta.visited).toBe(false)
      const props2 = testProps({
        values: {
          foo: 'bar'
        },
        fields: {
          foo: {
            visited: true
          }
        }
      })
      expect(props2.meta.visited).toBe(true)
    })

    it('should pass in the form name as meta.form', () => {
      const props = testProps()
      expect(props.meta.form).toBe(testFormName)
    })

    it('should get sync errors from outer reduxForm component', () => {
      const props = testProps(
        {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          },
          registeredFields: {
            foo: {name: 'foo', type: 'Field'}
          }
        },
        {
          validate: () => ({foo: 'foo error'})
        }
      )
      expect(props.meta.error).toBe('foo error')
    })

    it('should get sync warnings from outer reduxForm component', () => {
      const props = testProps(
        {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          },
          registeredFields: {
            foo: {name: 'foo', type: 'Field'}
          }
        },
        {
          warn: () => ({foo: 'foo warning'})
        }
      )
      expect(props.meta.warning).toBe('foo warning')
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

    it('should get submitFailed prop from Redux state', () => {
      const props = testProps({
        submitFailed: true
      })
      expect(props.meta.submitFailed).toBe(true)
    })

    it('should provide meta.dispatch', () => {
      const props = testProps({})
      expect(props.meta.dispatch).toExist().toBeA('function')
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
          return <div><Field name="foo" component={TestInput} /></div>
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
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
          return <div><Field name="foo" component={TestInput} /></div>
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
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
          return <div><Field name="foo" component={TestInput} /></div>
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
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
          return <div><Field name="foo" component={TestInput} /></div>
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
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
          return <div><Field name="foo" component={TestInput} /></div>
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
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
          return <div><Field name="foo" component={TestInput} /></div>
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Field)
      expect(stub.pristine).toBe(true)
    })

    it('should have value set to initial value on first render', () => {
      const store = makeStore({})
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      class Form extends Component {
        render() {
          return <div><Field name="foo" component={input} /></div>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm'
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm initialValues={{foo: 'bar'}} />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls[0].arguments[0].input.value).toBe('bar')
    })

    it('should provide sync error for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      })
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const validate = () => ({foo: ['bar error']})
      class Form extends Component {
        render() {
          return <div><Field name="foo[0]" component={input} /></div>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        validate
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[0].arguments[0].meta.valid).toBe(false)
      expect(input.calls[0].arguments[0].meta.error).toBe('bar error')
    })

    it('should provide sync warning for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      })
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const warn = () => ({foo: ['bar warning']})
      class Form extends Component {
        render() {
          return <div><Field name="foo[0]" component={input} /></div>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[0].arguments[0].meta.warning).toBe('bar warning')
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
          return <div><Field name="foo" component={TestInput} withRef /></div>
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
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
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = {field: 'foo'}
        }

        render() {
          return (
            <div>
              <Field name={this.state.field} component={input} />
              <button onClick={() => this.setState({field: 'bar'})}>
                Change
              </button>
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[0].arguments[0].input.value).toBe('fooValue')
      expect(input.calls[0].arguments[0].meta.touched).toBe(false)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input.calls.length).toBe(2)
      expect(input.calls[1].arguments[0].input.value).toBe('barValue')
      expect(input.calls[1].arguments[0].meta.touched).toBe(true)
    })

    it('should prefix name getter when inside FormSection', () => {
      const store = makeStore()
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo" component="span">
              <Field name="bar" component="input" />
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Field)
      expect(stub.name).toBe('foo.bar')
    })
    it('should prefix name getter when inside multiple FormSection', () => {
      const store = makeStore()
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <FormSection name="fighter">
                <Field name="bar" component="input" />
              </FormSection>
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Field)
      expect(stub.name).toBe('foo.fighter.bar')
    })

    it('should prefix name when inside FormSection', () => {
      const store = makeStore()
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo" component="span">
              <Field name="bar" component="input" />
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              'foo.bar': {name: 'foo.bar', type: 'Field', count: 1}
            }
          }
        }
      })
    })

    it('should prefix name when inside multiple FormSections', () => {
      const store = makeStore()
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <FormSection name="fighter">
                <Field name="bar" component="input" />
              </FormSection>
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              'foo.fighter.bar': {
                name: 'foo.fighter.bar',
                type: 'Field',
                count: 1
              }
            }
          }
        }
      })
    })

    it('should re-register when name changes', () => {
      const store = makeStore()
      class Form extends Component {
        constructor() {
          super()
          this.state = {field: 'foo'}
        }

        render() {
          return (
            <div>
              <Field name={this.state.field} component="input" />
              <button onClick={() => this.setState({field: 'bar'})}>
                Change
              </button>
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {foo: {name: 'foo', type: 'Field', count: 1}}
          }
        }
      })

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {bar: {name: 'bar', type: 'Field', count: 1}}
          }
        }
      })
    })

    it('should rerender when props change', () => {
      const store = makeStore()
      const input = createSpy(props => (
        <div>
          {props.highlighted}<input {...props.input} />
        </div>
      )).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = {highlighted: 0}
        }

        render() {
          const {highlighted} = this.state
          return (
            <div>
              <Field name="foo" highlighted={highlighted} component={input} />
              <button
                onClick={() => this.setState({highlighted: highlighted + 1})}
              >
                Change
              </button>
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[0].arguments[0].highlighted).toBe(0)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input.calls.length).toBe(2)
      expect(input.calls[1].arguments[0].highlighted).toBe(1)
    })

    it('should NOT rerender when props.props is shallow-equal, but !==', () => {
      const store = makeStore()
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const renderSpy = createSpy()
      class Form extends Component {
        constructor() {
          super()
          this.state = {foo: 'bar'}
        }

        render() {
          renderSpy()
          return (
            <div>
              <Field name="myField" component={input} props={{rel: 'test'}} />
              <button onClick={() => this.setState({foo: 'qux'})}>
                Change
              </button>
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(renderSpy).toHaveBeenCalled()
      expect(renderSpy.calls.length).toBe(1)

      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[0].arguments[0].rel).toBe('test')

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
      const renderUsername = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const normalize = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="title" component="input" />
              <Field name="author" component="input" />
              <Field
                name="username"
                component={renderUsername}
                normalize={normalize}
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(normalize).toNotHaveBeenCalled()

      expect(renderUsername.calls[0].arguments[0].input.value).toBe(
        'oldusername'
      )
      renderUsername.calls[0].arguments[0].input.onChange('ERIKRAS')

      expect(normalize).toHaveBeenCalled().toHaveBeenCalledWith(
        'ERIKRAS',
        'oldusername',
        fromJS({
          title: 'Redux Form',
          author: 'Erik Rasmussen',
          username: 'ERIKRAS'
        }),
        fromJS({
          title: 'Redux Form',
          author: 'Erik Rasmussen',
          username: 'oldusername'
        })
      )
      expect(normalize.calls.length).toBe(1)

      expect(renderUsername.calls[1].arguments[0].input.value).toBe('erikras')
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
      const renderUsername = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const normalize = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="title" component="input" />
              <Field name="author" component="input" />
              <Field
                name="username"
                component={renderUsername}
                normalize={normalize}
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(normalize).toNotHaveBeenCalled()

      expect(renderUsername.calls[0].arguments[0].input.value).toBe(
        'oldusername'
      )
      renderUsername.calls[0].arguments[0].input.onBlur('ERIKRAS')

      expect(normalize).toHaveBeenCalled().toHaveBeenCalledWith(
        'ERIKRAS',
        'oldusername',
        fromJS({
          title: 'Redux Form',
          author: 'Erik Rasmussen',
          username: 'ERIKRAS'
        }),
        fromJS({
          title: 'Redux Form',
          author: 'Erik Rasmussen',
          username: 'oldusername'
        })
      )
      expect(normalize.calls.length).toBe(1)

      expect(renderUsername.calls[1].arguments[0].input.value).toBe('erikras')
    })

    it('should call asyncValidate function on blur', () => {
      const store = makeStore({
        testForm: {
          values: {
            title: 'Redux Form',
            author: 'Erik Rasmussen',
            username: 'oldusername'
          }
        }
      })
      const renderUsername = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="title" component="input" />
              <Field name="author" component="input" />
              <Field name="username" component={renderUsername} />
            </div>
          )
        }
      }
      const asyncValidate = createSpy(
        () => new Promise(resolve => resolve())
      ).andCallThrough()
      const TestForm = reduxForm({form: 'testForm', asyncValidate})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      renderUsername.calls[0].arguments[0].input.onBlur('ERIKRAS')

      expect(asyncValidate).toHaveBeenCalled()
    })

    it('should call handle on focus', () => {
      const store = makeStore({
        testForm: {
          values: {
            title: 'Redux Form'
          }
        }
      })
      const renderTitle = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      class Form extends Component {
        render() {
          return <Field name="title" component={renderTitle} />
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(renderTitle.calls[0].arguments[0].meta.visited).toBe(false)
      renderTitle.calls[0].arguments[0].input.onFocus()
      expect(renderTitle.calls[1].arguments[0].meta.visited).toBe(true)
    })

    it('should not change the value of a radio when blur', () => {
      const store = makeStore({
        testForm: {
          values: {
            title: 'Redux Form',
            author: 'Erik Rasmussen',
            sex: 'male'
          }
        }
      })
      const renderSex = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="title" component="input" />
              <Field name="author" component="input" />
              <Field
                name="sex"
                value="female"
                type="radio"
                component={renderSex}
              />
              <Field
                name="sex"
                value="male"
                type="radio"
                component={renderSex}
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(renderSex.calls[0].arguments[0].input.checked).toBe(false)
      expect(renderSex.calls[1].arguments[0].input.checked).toBe(true)
      renderSex.calls[0].arguments[0].input.onBlur('female')

      expect(renderSex.calls[2].arguments[0].input.checked).toBe(false)
      expect(renderSex.calls[3].arguments[0].input.checked).toBe(true)
    })

    it('should call handle on drag start with value', () => {
      const store = makeStore({
        testForm: {
          values: {
            title: 'Redux Form'
          }
        }
      })
      const renderTitle = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const dragSpy = createSpy((key, val) => val).andCallThrough()
      const event = dragStartMock(dragSpy)
      class Form extends Component {
        render() {
          return <Field name="title" component={renderTitle} />
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(dragSpy).toNotHaveBeenCalled()
      renderTitle.calls[0].arguments[0].input.onDragStart(event)
      expect(dragSpy)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(dataKey, 'Redux Form')
    })

    it('should call handle on drag start without value', () => {
      const store = makeStore({
        testForm: {
          values: {
            title: null
          }
        }
      })
      const renderTitle = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const dragSpy = createSpy((key, val) => val).andCallThrough()
      const event = dragStartMock(dragSpy)
      class Form extends Component {
        render() {
          return <Field name="title" component={renderTitle} />
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(dragSpy).toNotHaveBeenCalled()
      renderTitle.calls[0].arguments[0].input.onDragStart(event)
      expect(dragSpy).toHaveBeenCalled().toHaveBeenCalledWith(dataKey, '')
    })

    it('should call handle on drop', () => {
      const store = makeStore({
        testForm: {
          values: {
            title: 'Redux Form'
          }
        }
      })
      const renderTitle = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const dropSpy = createSpy(key => key).andCallThrough()
      const event = dropMock(dropSpy)
      event.preventDefault = createSpy(event.preventDefault)
      class Form extends Component {
        render() {
          return <Field name="title" component={renderTitle} />
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(dropSpy).toNotHaveBeenCalled()
      renderTitle.calls[0].arguments[0].input.onDrop(event)
      expect(event.preventDefault).toHaveBeenCalled()
      expect(dropSpy).toHaveBeenCalled().toHaveBeenCalledWith(dataKey)
    })

    it('should call format function on first render', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'Redux Form'
          }
        }
      })
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const format = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="name" component={input} format={format} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(format).toHaveBeenCalled()
      expect(format.calls.length).toBe(1)
      expect(format.calls[0].arguments).toEqual(['Redux Form', 'name'])

      expect(input.calls[0].arguments[0].input.value).toBe('redux form')
    })

    it('should call parse function on change', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      })
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const parse = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="name" component={input} parse={parse} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(parse).toNotHaveBeenCalled()

      expect(input.calls.length).toBe(1)
      expect(input.calls[0].arguments[0].input.value).toBe('redux form')

      input.calls[0].arguments[0].input.onChange('REDUX FORM ROCKS')

      expect(parse).toHaveBeenCalled()
      expect(parse.calls.length).toBe(1)
      expect(parse.calls[0].arguments).toEqual(['REDUX FORM ROCKS', 'name'])

      expect(input.calls.length).toBe(2)
      expect(input.calls[1].arguments[0].input.value).toBe('redux form rocks')
    })

    it('should call parse function on blur', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      })
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const parse = createSpy(value => value.toLowerCase()).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="name" component={input} parse={parse} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(parse).toNotHaveBeenCalled()

      expect(input.calls.length).toBe(1)
      expect(input.calls[0].arguments[0].input.value).toBe('redux form')

      input.calls[0].arguments[0].input.onBlur('REDUX FORM ROCKS')

      expect(parse).toHaveBeenCalled()
      expect(parse.calls.length).toBe(1)
      expect(parse.calls[0].arguments).toEqual(['REDUX FORM ROCKS', 'name'])

      expect(input.calls.length).toBe(2)
      expect(input.calls[1].arguments[0].input.value).toBe('redux form rocks')
    })

    it('should not update a value if onBlur is passed undefined', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      })
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="name" component={input} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      // verify state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              name: 'redux form'
            },
            registeredFields: {
              name: {
                name: 'name',
                type: 'Field',
                count: 1
              }
            }
          }
        }
      })

      // verify props
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[0].arguments[0].meta.active).toBe(false)
      expect(input.calls[0].arguments[0].input.value).toBe('redux form')

      // call onFocus
      input.calls[0].arguments[0].input.onFocus()

      // verify state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            active: 'name',
            values: {
              name: 'redux form'
            },
            registeredFields: {
              name: {
                name: 'name',
                type: 'Field',
                count: 1
              }
            },
            fields: {
              name: {
                visited: true,
                active: true
              }
            }
          }
        }
      })

      // verify props
      expect(input.calls.length).toBe(2) // active now
      expect(input.calls[1].arguments[0].meta.active).toBe(true)
      expect(input.calls[1].arguments[0].input.value).toBe('redux form')

      // call onBlur
      input.calls[0].arguments[0].input.onBlur()

      // verify state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            anyTouched: true,
            values: {
              name: 'redux form' // UNCHANGED!
            },
            registeredFields: {
              name: {
                name: 'name',
                type: 'Field',
                count: 1
              }
            },
            fields: {
              name: {
                visited: true,
                touched: true
              }
            }
          }
        }
      })

      // verify props
      expect(input.calls.length).toBe(3) // not active now
      expect(input.calls[2].arguments[0].meta.active).toBe(false)
      expect(input.calls[2].arguments[0].input.value).toBe('redux form') // UNCHANGED!
    })

    it('should parse and format to maintain different type in store', () => {
      const store = makeStore({
        testForm: {
          values: {
            age: 42
          }
        }
      })
      const input = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const parse = createSpy(
        value => value && parseInt(value, 10)
      ).andCallThrough()
      const format = createSpy(
        value => value && value.toString()
      ).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field
                name="age"
                component={input}
                format={format}
                parse={parse}
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      // format called once
      expect(format).toHaveBeenCalled()
      expect(format.calls.length).toBe(1)

      // parse not called yet
      expect(parse).toNotHaveBeenCalled()

      // input displaying string value
      expect(input.calls.length).toBe(1)
      expect(input.calls[0].arguments[0].input.value).toBe('42')

      // update value
      input.calls[0].arguments[0].input.onChange('15')

      // parse was called
      expect(parse).toHaveBeenCalled()
      expect(parse.calls.length).toBe(1)
      expect(parse.calls[0].arguments).toEqual(['15', 'age'])

      // value in store is number
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              age: 15 // number
            },
            registeredFields: {age: {name: 'age', type: 'Field', count: 1}}
          }
        }
      })

      // format called again
      expect(format).toHaveBeenCalled()
      expect(format.calls.length).toBe(2)
      expect(format.calls[1].arguments).toEqual([15, 'age'])

      // input rerendered with string value
      expect(input.calls.length).toBe(2)
      expect(input.calls[1].arguments[0].input.value).toBe('15')
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
      const passwordInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const confirmInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const validate = values => {
        const password = getIn(values, 'password')
        const confirm = getIn(values, 'confirm')
        return password === confirm ? {} : {confirm: 'Must match!'}
      }
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="password" component={passwordInput} />
              <Field name="confirm" component={confirmInput} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        validate
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      // password input rendered
      expect(passwordInput).toHaveBeenCalled()
      expect(passwordInput.calls.length).toBe(1)

      // confirm input rendered with error
      expect(confirmInput).toHaveBeenCalled()
      expect(confirmInput.calls.length).toBe(1)
      expect(confirmInput.calls[0].arguments[0].meta.valid).toBe(false)
      expect(confirmInput.calls[0].arguments[0].meta.error).toBe('Must match!')

      // update password field so that they match
      passwordInput.calls[0].arguments[0].input.onChange('redux-form rocks')

      // password input rerendered
      expect(passwordInput.calls.length).toBe(2)

      // confirm input should also rerender, but with no error
      expect(confirmInput.calls.length).toBe(2)
      expect(confirmInput.calls[1].arguments[0].meta.valid).toBe(true)
      expect(confirmInput.calls[1].arguments[0].meta.error).toBe(undefined)
    })

    it('should rerender when sync error is cleared', () => {
      const store = makeStore()
      const usernameInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const validate = values => {
        const username = getIn(values, 'username')
        return username ? {} : {username: 'Required'}
      }
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="username" component={usernameInput} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        validate
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      // username input rendered
      expect(usernameInput).toHaveBeenCalled()
      expect(usernameInput.calls.length).toBe(1)

      // username field has error
      expect(usernameInput.calls[0].arguments[0].meta.valid).toBe(false)
      expect(usernameInput.calls[0].arguments[0].meta.error).toBe('Required')

      // update username field so it passes
      usernameInput.calls[0].arguments[0].input.onChange('erikras')

      // username input rerendered
      expect(usernameInput.calls.length).toBe(2)

      // should be valid now
      expect(usernameInput.calls[1].arguments[0].meta.valid).toBe(true)
      expect(usernameInput.calls[1].arguments[0].meta.error).toBe(undefined)
    })

    it('should rerender when sync warning changes', () => {
      const store = makeStore({
        testForm: {
          values: {
            password: 'redux-form sucks',
            confirm: 'redux-form rocks'
          }
        }
      })
      const passwordInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const confirmInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const warn = values => {
        const password = getIn(values, 'password')
        const confirm = getIn(values, 'confirm')
        return password === confirm
          ? {}
          : {confirm: 'Should match. Or not. Whatever.'}
      }
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="password" component={passwordInput} />
              <Field name="confirm" component={confirmInput} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      // password input rendered
      expect(passwordInput).toHaveBeenCalled()
      expect(passwordInput.calls.length).toBe(1)

      // confirm input rendered with warning
      expect(confirmInput).toHaveBeenCalled()
      expect(confirmInput.calls.length).toBe(1)
      expect(confirmInput.calls[0].arguments[0].meta.warning).toBe(
        'Should match. Or not. Whatever.'
      )

      // update password field so that they match
      passwordInput.calls[0].arguments[0].input.onChange('redux-form rocks')

      // password input rerendered
      expect(passwordInput.calls.length).toBe(2)

      // confirm input should also rerender, but with no warning
      expect(confirmInput.calls.length).toBe(2)
      expect(confirmInput.calls[1].arguments[0].meta.warning).toBe(undefined)
    })

    it('should rerender when sync warning is cleared', () => {
      const store = makeStore()
      const usernameInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const warn = values => {
        const username = getIn(values, 'username')
        return username ? {} : {username: 'Recommended'}
      }
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="username" component={usernameInput} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      // username input rendered
      expect(usernameInput).toHaveBeenCalled()
      expect(usernameInput.calls.length).toBe(1)

      // username field has warning
      expect(usernameInput.calls[0].arguments[0].meta.warning).toBe(
        'Recommended'
      )

      // update username field so it passes
      usernameInput.calls[0].arguments[0].input.onChange('erikras')

      // username input rerendered
      expect(usernameInput.calls.length).toBe(2)

      // should be valid now
      expect(usernameInput.calls[1].arguments[0].meta.warning).toBe(undefined)
    })

    it('should sync validate with field level validator', () => {
      const store = makeStore()
      const usernameInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const required = createSpy(
        value => (value == null ? 'Required' : undefined)
      ).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field
                name="username"
                component={usernameInput}
                validate={required}
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm'
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      // username input rendered
      expect(usernameInput).toHaveBeenCalled()
      expect(usernameInput.calls.length).toBe(2)
      expect(required).toHaveBeenCalled()
      expect(required.calls.length).toBe(1)

      // username field has error
      expect(usernameInput.calls[1].arguments[0].meta.valid).toBe(false)
      expect(usernameInput.calls[1].arguments[0].meta.error).toBe('Required')

      // update username field so it passes
      usernameInput.calls[0].arguments[0].input.onChange('erikras')

      // username input rerendered
      expect(usernameInput.calls.length).toBe(3)

      // should be valid now
      expect(usernameInput.calls[2].arguments[0].meta.valid).toBe(true)
      expect(usernameInput.calls[2].arguments[0].meta.error).toBe(undefined)
    })

    it('should sync warn with field level warning function', () => {
      const store = makeStore()
      const usernameInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const required = createSpy(
        value => (value == null ? 'Recommended' : undefined)
      ).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field
                name="username"
                component={usernameInput}
                warn={required}
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm'
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      // username input rendered
      expect(usernameInput).toHaveBeenCalled()
      expect(usernameInput.calls.length).toBe(2)
      expect(required).toHaveBeenCalled()
      expect(required.calls.length).toBe(1)

      // username field has warning
      expect(usernameInput.calls[1].arguments[0].meta.valid).toBe(true)
      expect(usernameInput.calls[1].arguments[0].meta.warning).toBe(
        'Recommended'
      )

      // update username field so it passes
      usernameInput.calls[0].arguments[0].input.onChange('erikras')

      // username input rerendered
      expect(usernameInput.calls.length).toBe(3)

      // should be valid now
      expect(usernameInput.calls[2].arguments[0].meta.valid).toBe(true)
      expect(usernameInput.calls[2].arguments[0].meta.warning).toBe(undefined)
    })

    it('should not generate any warnings by passing api props into custom', () => {
      const store = makeStore()
      const renderSpy = createSpy()
      class InputComponent extends Component {
        render() {
          renderSpy(this.props)
          return <input {...this.props.input} />
        }
      }
      const apiProps = {
        // all the official API props you can pass to Field
        component: InputComponent,
        name: 'foo',
        normalize: x => x,
        parse: x => x,
        props: {},
        format: x => x,
        validate: () => undefined,
        warn: () => undefined,
        withRef: true
      }
      class Form extends Component {
        render() {
          return (
            <div>
              <Field {...apiProps} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm'
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(renderSpy).toHaveBeenCalled()
      const props = renderSpy.calls[0].arguments[0]
      Object.keys(apiProps).forEach(key => expect(props[key]).toNotExist())
    })

    it('should only rerender field that has changed', () => {
      const store = makeStore()
      const input1 = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const input2 = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="input1" component={input1} />
              <Field name="input2" component={input2} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input1).toHaveBeenCalled()
      expect(input1.calls.length).toBe(1)
      expect(input1.calls[0].arguments[0].input.value).toBe('')

      expect(input2).toHaveBeenCalled()
      expect(input2.calls.length).toBe(1)
      expect(input2.calls[0].arguments[0].input.value).toBe('')

      // change input #1
      input1.calls[0].arguments[0].input.onChange('foo')

      // expect input #1 to have been rerendered
      expect(input1.calls.length).toBe(2)
      expect(input1.calls[1].arguments[0].input.value).toBe('foo')

      // expect input #2 to NOT have been rerendered
      expect(input2.calls.length).toBe(1)
    })

    it('should allow onChange callback', () => {
      const store = makeStore()
      const renderInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const callback = createSpy()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="foo" component={renderInput} onChange={callback} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
      input.value = 'bar'

      expect(callback).toNotHaveBeenCalled()

      // rendered once with no onChange prop passed down in custom props
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].onChange).toNotExist()

      TestUtils.Simulate.change(input)

      // call back was called
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(1)
      expect(callback.calls[0].arguments[0]).toExist() // event
      expect(callback.calls[0].arguments[1]).toBe('bar')
      expect(callback.calls[0].arguments[2]).toBe(undefined)

      // value changed
      expect(renderInput.calls.length).toBe(2)
      expect(renderInput.calls[1].arguments[0].input.value).toBe('bar')
    })

    it('should allow onChange callback to prevent change', () => {
      const store = makeStore()
      const renderInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const callback = createSpy(event =>
        event.preventDefault()
      ).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="foo" component={renderInput} onChange={callback} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
      input.value = 'bar'

      expect(callback).toNotHaveBeenCalled()

      // rendered once with no onChange prop passed down in custom props
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].onChange).toNotExist()

      TestUtils.Simulate.change(input)

      // call back was called
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(1)
      expect(callback.calls[0].arguments[0]).toExist()
      expect(callback.calls[0].arguments[1]).toBe('bar')
      expect(callback.calls[0].arguments[2]).toBe(undefined)

      // value NOT changed
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].input.value).toBe('')
    })

    it('should allow onBlur callback', () => {
      const store = makeStore()
      const renderInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const callback = createSpy()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="foo" component={renderInput} onBlur={callback} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
      input.value = 'bar'

      expect(callback).toNotHaveBeenCalled()

      // rendered once with no onBlur prop passed down in custom props
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].onBlur).toNotExist()

      TestUtils.Simulate.blur(input)

      // call back was called
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(1)
      expect(callback.calls[0].arguments[0]).toExist() // event
      expect(callback.calls[0].arguments[1]).toBe('bar')
      expect(callback.calls[0].arguments[2]).toBe(undefined)

      // value changed
      expect(renderInput.calls.length).toBe(2)
      expect(renderInput.calls[1].arguments[0].input.value).toBe('bar')
    })

    it('should allow onBlur callback to prevent blur', () => {
      const store = makeStore()
      const renderInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const callback = createSpy(event =>
        event.preventDefault()
      ).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="foo" component={renderInput} onBlur={callback} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
      input.value = 'bar'

      expect(callback).toNotHaveBeenCalled()

      // rendered once with no onBlur prop passed down in custom props
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].onBlur).toNotExist()

      TestUtils.Simulate.blur(input)

      // call back was called
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(1)
      expect(callback.calls[0].arguments[0]).toExist()
      expect(callback.calls[0].arguments[1]).toBe('bar')
      expect(callback.calls[0].arguments[2]).toBe(undefined)

      // value NOT changed
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].input.value).toBe('')
    })

    it('should allow onFocus callback', () => {
      const store = makeStore()
      const renderInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const callback = createSpy()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="foo" component={renderInput} onFocus={callback} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')

      expect(callback).toNotHaveBeenCalled()

      // rendered once with no onFocus prop passed down in custom props
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].onFocus).toNotExist()

      // not marked as active
      expect(renderInput.calls[0].arguments[0].meta.active).toBe(false)

      TestUtils.Simulate.focus(input)

      // call back was called
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(1)
      expect(callback.calls[0].arguments[0]).toExist() // event

      // field marked active
      expect(renderInput.calls.length).toBe(2)
      expect(renderInput.calls[1].arguments[0].meta.active).toBe(true)
    })

    it('should allow onFocus callback to prevent focus', () => {
      const store = makeStore()
      const renderInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const callback = createSpy(event =>
        event.preventDefault()
      ).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="foo" component={renderInput} onFocus={callback} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')

      expect(callback).toNotHaveBeenCalled()

      // rendered once with no onFocus prop passed down in custom props
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].onFocus).toNotExist()

      // not marked as active
      expect(renderInput.calls[0].arguments[0].meta.active).toBe(false)

      TestUtils.Simulate.focus(input)

      // call back was called
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(1)
      expect(callback.calls[0].arguments[0]).toExist()

      // field NOT marked active
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].meta.active).toBe(false)
    })

    it('should allow onDrop callback', () => {
      const store = makeStore()
      const renderInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const callback = createSpy()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="foo" component={renderInput} onDrop={callback} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')

      expect(callback).toNotHaveBeenCalled()

      // rendered once with no onDrop prop passed down in custom props
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].onDrop).toNotExist()

      TestUtils.Simulate.drop(input, {
        dataTransfer: {getData: () => 'bar'}
      })

      // call back was called
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(1)
      expect(callback.calls[0].arguments[0]).toExist() // event
      expect(callback.calls[0].arguments[1]).toBe('bar')
      expect(callback.calls[0].arguments[2]).toBe(undefined)

      // value changed
      expect(renderInput.calls.length).toBe(2)
      expect(renderInput.calls[1].arguments[0].input.value).toBe('bar')
    })

    it('should allow onDrop callback to prevent drop', () => {
      const store = makeStore()
      const renderInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const callback = createSpy(event =>
        event.preventDefault()
      ).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="foo" component={renderInput} onDrop={callback} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
      input.value = 'bar'

      expect(callback).toNotHaveBeenCalled()

      // rendered once with no onDrop prop passed down in custom props
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].onDrop).toNotExist()

      TestUtils.Simulate.drop(input, {
        dataTransfer: {getData: () => 'bar'}
      })

      // call back was called
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(1)
      expect(callback.calls[0].arguments[0]).toExist()
      expect(callback.calls[0].arguments[1]).toBe('bar')
      expect(callback.calls[0].arguments[2]).toBe(undefined)

      // value NOT changed
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].input.value).toBe('')
    })

    it('should allow onDragStart callback', () => {
      const store = makeStore()
      const renderInput = createSpy(props => (
        <input {...props.input} />
      )).andCallThrough()
      const callback = createSpy()
      class Form extends Component {
        render() {
          return (
            <div>
              <Field
                name="foo"
                component={renderInput}
                onDragStart={callback}
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({form: 'testForm'})(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')

      expect(callback).toNotHaveBeenCalled()

      // rendered once with no onDragStart prop passed down in custom props
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].onDragStart).toNotExist()

      TestUtils.Simulate.dragStart(input, {
        dataTransfer: {setData: () => {}}
      })

      // call back was called
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(1)
      expect(callback.calls[0].arguments[0]).toExist() // event

      // value NOT changed
      expect(renderInput.calls.length).toBe(1)
    })
  })
}

describeField(
  'Field.plain',
  plain,
  plainCombineReducers,
  addExpectations(plainExpectations)
)
describeField(
  'Field.immutable',
  immutable,
  immutableCombineReducers,
  addExpectations(immutableExpectations)
)
