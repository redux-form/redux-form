/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-dom/test-utils'
import createReduxForm from '../createReduxForm'
import createReducer from '../createReducer'
import createFields from '../createFields'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/__tests__/expectations'

const describeFields = (name, structure, combineReducers, setup) => {
  const reduxForm = createReduxForm(structure)
  const Fields = createFields(structure)
  const reducer = createReducer(structure)
  const { fromJS, getIn } = structure
  const makeStore = initial =>
    createStore(combineReducers({ form: reducer }), fromJS({ form: initial }))

  class TestInput extends Component {
    render() {
      return <div>TEST INPUT</div>
    }
  }

  const testProps = (state, config = {}) => {
    const store = makeStore({ testForm: state })
    class Form extends Component {
      render() {
        return (
          <div>
            <Fields names={['foo']} component={TestInput} />
          </div>
        )
      }
    }
    const TestForm = reduxForm({ form: 'testForm', ...config })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    return TestUtils.findRenderedComponentWithType(dom, TestInput).props
  }

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should throw an error if not in ReduxForm', () => {
      expect(() => {
        TestUtils.renderIntoDocument(
          <div>
            <Fields names={['foo', 'bar']} component={TestInput} />
          </div>
        )
      }).toThrow(/must be inside a component decorated with reduxForm/)
    })

    it('should throw an error if invalid component prop is provided', () => {
      const store = makeStore()
      const notAComponent = {}
      class Form extends Component {
        render() {
          return <Fields names={['foo', 'bar']} component={notAComponent} />
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      expect(() => {
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <TestForm />
          </Provider>
        )
      }).toThrow(/Element type is invalid/)
    })

    it('should warn if no names prop is provided', () => {
      const spy = jest.spyOn(console, 'error') // mutes prop type warning
      const store = makeStore()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields component={TestInput} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      expect(() => {
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <TestForm />
          </Provider>
        )
      }).toThrow(/No "names" prop was specified/)
      spy.mockReset()
    })

    it('should warn if invalid names prop is provided', () => {
      const spy = jest.spyOn(console, 'error') // mutes prop type warning
      const store = makeStore()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names="This is a string" component={TestInput} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      expect(() => {
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <TestForm />
          </Provider>
        )
      }).toThrow(/Invalid prop "names"/)
      spy.mockReset()
    })

    it('should get value from Redux state', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props.foo.input.value).toBe('bar')
    })

    it('should get meta.form', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props.foo.meta.form).toBe('testForm')
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
      expect(props.foo.meta.initial).toBe('bar')
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
      expect(props1.foo.meta.pristine).toBe(true)
      expect(props1.foo.meta.dirty).toBe(false)
      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      })
      expect(props2.foo.meta.pristine).toBe(false)
      expect(props2.foo.meta.dirty).toBe(true)
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
      expect(props1.foo.meta.pristine).toBe(false)
      expect(props1.foo.meta.dirty).toBe(true)
      const props2 = testProps({
        initial: {
          foo: ''
        },
        values: {
          foo: ''
        }
      })
      expect(props2.foo.meta.pristine).toBe(true)
      expect(props2.foo.meta.dirty).toBe(false)
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
      expect(props1.foo.meta.asyncValidating).toBe(false)
      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        },
        asyncValidating: 'foo'
      })
      expect(props2.foo.meta.asyncValidating).toBe(true)
    })

    it('should get sync errors from outer reduxForm component', () => {
      const props = testProps(
        {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        },
        {
          validate: () => ({ foo: 'foo error' })
        }
      )
      expect(props.foo.meta.error).toBe('foo error')
    })

    it('should get sync warnings from outer reduxForm component', () => {
      const props = testProps(
        {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        },
        {
          warn: () => ({ foo: 'foo warning' })
        }
      )
      expect(props.foo.meta.warning).toBe('foo warning')
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
      expect(props.foo.meta.error).toBe('foo error')
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
      expect(props.foo.meta.error).toBe('foo error')
    })

    it('should get submitFailed prop from Redux state', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        submitFailed: true
      })
      expect(props.foo.meta.submitFailed).toBe(true)
    })

    it('should provide names getter', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      })
      const ref = React.createRef()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['foo', 'bar']} component={TestInput} ref={ref} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(ref.current.names).toEqual(['foo', 'bar'])
    })

    it('should provide values getter', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          }
        }
      })
      const ref = React.createRef()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['foo', 'bar']} component={TestInput} ref={ref} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(ref.current.values).toEqual({ foo: 'fooValue', bar: 'barValue' })
    })

    it('should provide dirty getter that is true when any field is dirty', () => {
      const store = makeStore({
        testForm: {
          initial: {
            foo: 'fooValue',
            bar: 'barValue'
          },
          values: {
            foo: 'fooValue',
            bar: 'barValueDirty'
          }
        }
      })
      const ref = React.createRef()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['foo', 'bar']} component={TestInput} ref={ref} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(ref.current.dirty).toBe(true)
    })

    it('should provide dirty getter that is false when all fields are pristine', () => {
      const store = makeStore({
        testForm: {
          initial: {
            foo: 'fooValue',
            bar: 'barValue'
          },
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          }
        }
      })
      const ref = React.createRef()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['foo', 'bar']} component={TestInput} ref={ref} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(ref.current.dirty).toBe(false)
    })

    it('should provide pristine getter that is false when dirty', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      })
      const ref = React.createRef()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['foo']} component={TestInput} ref={ref} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(ref.current.pristine).toBe(false)
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
      const ref = React.createRef()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['foo']} component={TestInput} ref={ref} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(ref.current.pristine).toBe(true)
    })

    it('should have value set to initial value on first render', () => {
      const store = makeStore({})
      const input = jest.fn(props => <input {...props.foo.input} />)
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['foo', 'bar']} component={input} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm'
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm initialValues={{ foo: 'fooValue', bar: 'barValue' }} />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].foo.input.value).toBe('fooValue')
      expect(input.mock.calls[1][0].bar.input.value).toBe('barValue')
    })

    it('should provide sync error for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const validate = () => ({ foo: ['first error', 'second error'] })
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['foo[0]', 'foo[1]']} component={input} />
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
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].foo[0].meta.valid).toBe(false)
      expect(input.mock.calls[1][0].foo[0].meta.error).toBe('first error')
      expect(input.mock.calls[1][0].foo[1].meta.valid).toBe(false)
      expect(input.mock.calls[1][0].foo[1].meta.error).toBe('second error')
    })

    it('should provide sync error for array-of-objects field', () => {
      const store = makeStore({
        testForm: {
          values: {
            authors: [
              {
                firstName: 'Erik',
                lastName: 'Rasmussen'
              }
            ]
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const validate = () => ({
        authors: [{ _error: 'Object Error' }]
      })
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['authors[0]']} component={input} />
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
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].authors[0].meta.valid).toBe(false)
      expect(input.mock.calls[1][0].authors[0].meta.error).toBe('Object Error')
    })

    it('should provide sync warning for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const warn = () => ({ foo: ['first warning', 'second warning'] })
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['foo[0]', 'foo[1]']} component={input} />
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
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].foo[0].meta.warning).toBe('first warning')
      expect(input.mock.calls[1][0].foo[1].meta.warning).toBe('second warning')
    })

    it('should provide sync warning for array-of-objects field', () => {
      const store = makeStore({
        testForm: {
          values: {
            authors: [
              {
                firstName: 'Erik',
                lastName: 'Rasmussen'
              }
            ]
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const warn = () => ({
        authors: [{ _warning: 'Object Error' }]
      })
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['authors[0]']} component={input} />
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
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].authors[0].meta.warning).toBe(
        'Object Error'
      )
    })

    it('should provide access to rendered component', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          }
        }
      })
      const ref = React.createRef()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields
                names={['foo', 'bar']}
                component={TestInput}
                forwardRef
                ref={ref}
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      const input = TestUtils.findRenderedComponentWithType(dom, TestInput)

      expect(ref.current.getRenderedComponent()).toBe(input)
    })

    it('should unregister fields when unmounted', () => {
      const store = makeStore()
      const input = jest.fn(props => <input {...props.input} />)
      class Form extends Component {
        constructor() {
          super()
          this.state = { toggle: false }
        }

        render() {
          const { toggle } = this.state
          return (
            <div>
              {!toggle && <Fields names={['dog', 'cat']} component={input} />}
              {toggle && <Fields names={['cow', 'ewe']} component={input} />}
              <button onClick={() => this.setState({ toggle: true })}>
                Toggle
              </button>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              dog: { name: 'dog', type: 'Field', count: 1 },
              cat: { name: 'cat', type: 'Field', count: 1 }
            }
          }
        }
      })

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              cow: { name: 'cow', type: 'Field', count: 1 },
              ewe: { name: 'ewe', type: 'Field', count: 1 }
            }
          }
        }
      })
    })

    it('should reconnect when names change', () => {
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
      const input = jest.fn(props => <input {...props.input} />)
      class Form extends Component {
        constructor() {
          super()
          this.state = { field: 'foo' }
        }

        render() {
          return (
            <div>
              <Fields names={[this.state.field]} component={input} />
              <button onClick={() => this.setState({ field: 'bar' })}>
                Change
              </button>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].foo.input.value).toBe('fooValue')
      expect(input.mock.calls[0][0].foo.meta.touched).toBe(false)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].bar.input.value).toBe('barValue')
      expect(input.mock.calls[1][0].bar.meta.touched).toBe(true)
    })

    it('should prefix name getter when inside FormSection', () => {
      const store = makeStore()
      const renderFields = ({ foo, bar }) => (
        <div>
          <input {...foo.input} />
          <input {...bar.input} />
        </div>
      )
      const ref = React.createRef()
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <Fields
                names={['foo', 'bar']}
                component={renderFields}
                ref={ref}
              />
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(ref.current.names).toEqual(['foo.foo', 'foo.bar'])
    })
    it('should prefix name getter when inside multiple FormSection', () => {
      const store = makeStore()
      const renderFields = ({ foo, bar }) => (
        <div>
          <input {...foo.input} />
          <input {...bar.input} />
        </div>
      )
      const ref = React.createRef()
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <FormSection name="fighter">
                <Fields
                  names={['foo', 'bar']}
                  component={renderFields}
                  ref={ref}
                />
              </FormSection>
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(ref.current.names).toEqual(['foo.fighter.foo', 'foo.fighter.bar'])
    })

    it('should prefix name when inside FormSection', () => {
      const store = makeStore()
      const renderFields = ({ foo, bar }) => (
        <div>
          <input {...foo.input} />
          <input {...bar.input} />
        </div>
      )
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <Fields names={['foo', 'bar']} component={renderFields} />
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              'foo.foo': { name: 'foo.foo', type: 'Field', count: 1 },
              'foo.bar': { name: 'foo.bar', type: 'Field', count: 1 }
            }
          }
        }
      })
    })

    it('should prefix name when inside multiple FormSections', () => {
      const store = makeStore()
      const renderFields = ({ foo, bar }) => (
        <div>
          <input {...foo.input} />
          <input {...bar.input} />
        </div>
      )
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <FormSection name="fighter">
                <Fields names={['foo', 'bar']} component={renderFields} />
              </FormSection>
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: {
              'foo.fighter.foo': {
                name: 'foo.fighter.foo',
                type: 'Field',
                count: 1
              },
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

    it('should rerender when props change', () => {
      const store = makeStore()
      const renderFields = jest.fn(props => (
        <div>
          {props.highlighted}
          <input {...props.foo.input} />
        </div>
      ))
      class Form extends Component {
        constructor() {
          super()
          this.state = { highlighted: 0 }
        }

        render() {
          const { highlighted } = this.state
          return (
            <div>
              <Fields
                names={['foo']}
                highlighted={highlighted}
                component={renderFields}
              />
              <button
                onClick={() => this.setState({ highlighted: highlighted + 1 })}
              >
                Change
              </button>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(renderFields).toHaveBeenCalled()
      expect(renderFields).toHaveBeenCalledTimes(1)
      expect(renderFields.mock.calls[0][0].highlighted).toBe(0)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(renderFields).toHaveBeenCalledTimes(2)
      expect(renderFields.mock.calls[1][0].highlighted).toBe(1)
    })

    it('should NOT rerender when props.props is shallow-equal, but !==', () => {
      const store = makeStore()
      const input = jest.fn(props => <input {...props.input} />)
      const renderSpy = jest.fn()
      class Form extends Component {
        constructor() {
          super()
          this.state = { foo: 'bar' }
        }

        render() {
          renderSpy()
          return (
            <div>
              <Fields
                names={['myField']}
                component={input}
                props={{ rel: 'test' }}
              />
              <button onClick={() => this.setState({ foo: 'qux' })}>
                Change
              </button>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(renderSpy).toHaveBeenCalled()
      expect(renderSpy).toHaveBeenCalledTimes(1)

      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].rel).toBe('test')

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(renderSpy).toHaveBeenCalledTimes(2)

      expect(input).toHaveBeenCalledTimes(1)
    })

    it('should rerender when one of the fields changes', () => {
      const store = makeStore({
        testForm: {
          values: {
            cat: 'catValue',
            dog: 'dogValue',
            ewe: 'eweValue',
            fox: 'foxValue'
          }
        }
      })
      const inputPair1 = jest.fn(({ cat, dog }) => (
        <div>
          <input {...cat.input} />
          <input {...dog.input} />
        </div>
      ))
      const inputPair2 = jest.fn(({ ewe, fox }) => (
        <div>
          <input {...ewe.input} />
          <input {...fox.input} />
        </div>
      ))
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['cat', 'dog']} component={inputPair1} />
              <Fields names={['ewe', 'fox']} component={inputPair2} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(inputPair1).toHaveBeenCalled()
      expect(inputPair1).toHaveBeenCalledTimes(1)
      expect(inputPair1.mock.calls[0][0].cat.input.value).toBe('catValue')
      expect(inputPair1.mock.calls[0][0].dog.input.value).toBe('dogValue')

      expect(inputPair2).toHaveBeenCalled()
      expect(inputPair2).toHaveBeenCalledTimes(1)
      expect(inputPair2.mock.calls[0][0].ewe.input.value).toBe('eweValue')
      expect(inputPair2.mock.calls[0][0].fox.input.value).toBe('foxValue')

      inputPair1.mock.calls[0][0].dog.input.onChange('FIDO')

      // input pair 1 should be rerendered
      expect(inputPair1).toHaveBeenCalledTimes(2)
      expect(inputPair1.mock.calls[1][0].cat.input.value).toBe('catValue')
      expect(inputPair1.mock.calls[1][0].dog.input.value).toBe('FIDO')

      // input pair 2 should NOT be rerendered
      expect(inputPair2).toHaveBeenCalledTimes(1)
    })

    it('should call format function on first render', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'Redux Form'
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const format = jest.fn(value => value.toLowerCase())
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['name']} component={input} format={format} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(format).toHaveBeenCalled()
      expect(format).toHaveBeenCalledTimes(1)
      expect(format.mock.calls[0]).toEqual(['Redux Form', 'name'])

      expect(input.mock.calls[0][0].name.input.value).toBe('redux form')
    })

    it('should call parse function on change', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const parse = jest.fn(value => value.toLowerCase())
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['name']} component={input} parse={parse} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(parse).not.toHaveBeenCalled()

      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].name.input.value).toBe('redux form')

      input.mock.calls[0][0].name.input.onChange('REDUX FORM ROCKS')

      expect(parse).toHaveBeenCalled()
      expect(parse).toHaveBeenCalledTimes(1)
      expect(parse.mock.calls[0]).toEqual(['REDUX FORM ROCKS', 'name'])

      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].name.input.value).toBe('redux form rocks')
    })

    it('should call parse function on blur', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const parse = jest.fn(value => value.toLowerCase())
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['name']} component={input} parse={parse} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(parse).not.toHaveBeenCalled()

      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].name.input.value).toBe('redux form')

      input.mock.calls[0][0].name.input.onBlur('REDUX FORM ROCKS')

      expect(parse).toHaveBeenCalled()
      expect(parse).toHaveBeenCalledTimes(1)
      expect(parse.mock.calls[0]).toEqual(['REDUX FORM ROCKS', 'name'])

      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].name.input.value).toBe('redux form rocks')
    })

    it('should handle on focus', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['name']} component={input} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].name.meta.visited).toBe(false)

      input.mock.calls[0][0].name.input.onFocus()

      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].name.meta.visited).toBe(true)
    })

    it('should parse and format to maintain different type in store', () => {
      const store = makeStore({
        testForm: {
          values: {
            age: 42
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const parse = jest.fn(value => value && parseInt(value, 10))
      const format = jest.fn(value => value && value.toString())
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields
                names={['age']}
                component={input}
                format={format}
                parse={parse}
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      // format called once
      expect(format).toHaveBeenCalled()
      expect(format).toHaveBeenCalledTimes(1)

      // parse not called yet
      expect(parse).not.toHaveBeenCalled()

      // input displaying string value
      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].age.input.value).toBe('42')

      // update value
      input.mock.calls[0][0].age.input.onChange('15')

      // parse was called
      expect(parse).toHaveBeenCalled()
      expect(parse).toHaveBeenCalledTimes(1)
      expect(parse.mock.calls[0]).toEqual(['15', 'age'])

      // value in store is number
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              age: 15 // number
            },
            registeredFields: { age: { name: 'age', type: 'Field', count: 1 } }
          }
        }
      })

      // format called again
      expect(format).toHaveBeenCalled()
      expect(format).toHaveBeenCalledTimes(2)
      expect(format.mock.calls[1]).toEqual([15, 'age'])

      // input rerendered with string value
      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].age.input.value).toBe('15')
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
      const passwordInput = jest.fn(props => <input {...props.input} />)
      const confirmInput = jest.fn(props => <input {...props.input} />)
      const validate = values => {
        const password = getIn(values, 'password')
        const confirm = getIn(values, 'confirm')
        return password === confirm ? {} : { confirm: 'Must match!' }
      }
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['password']} component={passwordInput} />
              <Fields names={['confirm']} component={confirmInput} />
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
      expect(passwordInput).toHaveBeenCalledTimes(1)

      // confirm input rendered with error
      expect(confirmInput).toHaveBeenCalled()
      expect(confirmInput).toHaveBeenCalledTimes(2)
      expect(confirmInput.mock.calls[1][0].confirm.meta.valid).toBe(false)
      expect(confirmInput.mock.calls[1][0].confirm.meta.error).toBe(
        'Must match!'
      )

      // update password field so that they match
      passwordInput.mock.calls[0][0].password.input.onChange('redux-form rocks')

      // password input rerendered
      expect(passwordInput).toHaveBeenCalledTimes(2)

      // confirm input should also rerender, but with no error
      expect(confirmInput).toHaveBeenCalledTimes(3)
      expect(confirmInput.mock.calls[2][0].confirm.meta.valid).toBe(true)
      expect(confirmInput.mock.calls[2][0].confirm.meta.error).toBe(undefined)
    })

    it('should rerender when sync error is cleared', () => {
      const store = makeStore()
      const usernameInput = jest.fn(props => <input {...props.input} />)
      const validate = values => {
        const username = getIn(values, 'username')
        return username ? {} : { username: 'Required' }
      }
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['username']} component={usernameInput} />
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
      expect(usernameInput).toHaveBeenCalledTimes(2)

      // username field has error
      expect(usernameInput.mock.calls[1][0].username.meta.valid).toBe(false)
      expect(usernameInput.mock.calls[1][0].username.meta.error).toBe(
        'Required'
      )

      // update username field so it passes
      usernameInput.mock.calls[1][0].username.input.onChange('erikras')

      // username input rerendered
      expect(usernameInput).toHaveBeenCalledTimes(4)

      // should be valid now
      expect(usernameInput.mock.calls[3][0].username.meta.valid).toBe(true)
      expect(usernameInput.mock.calls[3][0].username.meta.error).toBe(undefined)
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
      const passwordInput = jest.fn(props => <input {...props.input} />)
      const confirmInput = jest.fn(props => <input {...props.input} />)
      const warn = values => {
        const password = getIn(values, 'password')
        const confirm = getIn(values, 'confirm')
        return password === confirm
          ? {}
          : { confirm: 'Should match. Or not. Whatever.' }
      }
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['password']} component={passwordInput} />
              <Fields names={['confirm']} component={confirmInput} />
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
      expect(passwordInput).toHaveBeenCalledTimes(1)

      // confirm input rendered with warning
      expect(confirmInput).toHaveBeenCalled()
      expect(confirmInput).toHaveBeenCalledTimes(2)
      expect(confirmInput.mock.calls[1][0].confirm.meta.warning).toBe(
        'Should match. Or not. Whatever.'
      )

      // update password field so that they match
      passwordInput.mock.calls[0][0].password.input.onChange('redux-form rocks')

      // password input rerendered
      expect(passwordInput).toHaveBeenCalledTimes(2)

      // confirm input should also rerender, but with no warning
      expect(confirmInput).toHaveBeenCalledTimes(3)
      expect(confirmInput.mock.calls[2][0].confirm.meta.warning).toBe(undefined)
    })

    it('should rerender when sync warning is cleared', () => {
      const store = makeStore()
      const usernameInput = jest.fn(props => <input {...props.input} />)
      const warn = values => {
        const username = getIn(values, 'username')
        return username ? {} : { username: 'Recommended' }
      }
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['username']} component={usernameInput} />
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
      expect(usernameInput).toHaveBeenCalledTimes(2)

      // username field has warning
      expect(usernameInput.mock.calls[1][0].username.meta.warning).toBe(
        'Recommended'
      )

      // update username field so it passes
      usernameInput.mock.calls[1][0].username.input.onChange('erikras')

      // username input rerendered
      expect(usernameInput).toHaveBeenCalledTimes(4)

      // should be valid now
      expect(usernameInput.mock.calls[3][0].username.meta.warning).toBe(
        undefined
      )
    })

    it('should provide correct prop structure', () => {
      const store = makeStore()
      const renderFields = jest.fn(() => <div />)
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields
                names={['foo', 'bar', 'deep.dive', 'array[0]', 'array[1]']}
                component={renderFields}
                someCustomProp="testing"
                anotherCustomProp={42}
                customBooleanFlag
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(renderFields).toHaveBeenCalled()
      const fields = renderFields.mock.calls[0][0]

      const expectField = field => {
        expect(field).toBeTruthy()
        expect(field.input).toBeTruthy()
        expect(typeof field.input.onChange).toBe('function')
        expect(typeof field.input.onBlur).toBe('function')
        expect(typeof field.input.onFocus).toBe('function')
        expect(field.meta).toBeTruthy()
        expect(field.meta.pristine).toBe(true)
        expect(field.meta.dirty).toBe(false)
        expect(field.someCustomProp).toBeFalsy()
        expect(field.anotherCustomProp).toBeFalsy()
        expect(field.customBooleanFlag).toBeFalsy()
      }

      expectField(fields.foo)
      expectField(fields.bar)
      expect(fields.deep).toBeTruthy()
      expectField(fields.deep.dive)
      expect(fields.array).toBeTruthy()
      expectField(fields.array[0])
      expectField(fields.array[1])
      expect(fields.someCustomProp).toBe('testing')
      expect(fields.anotherCustomProp).toBe(42)
      expect(fields.customBooleanFlag).toBe(true)
    })

    it('should provide correct prop structure after names change', () => {
      const store = makeStore()
      const renderFields = jest.fn(() => <div />)
      class Form extends Component {
        constructor(props) {
          super(props)
          this.state = { names: ['foo', 'bar', 'deep.dive', 'array[0]'] }
          this.changeNames = this.changeNames.bind(this)
        }
        changeNames() {
          this.setState({ names: ['fighter', 'fly.high', 'array[1]'] })
        }
        render() {
          return (
            <div>
              <Fields
                names={this.state.names}
                component={renderFields}
                someCustomProp="testing"
                anotherCustomProp={42}
                customBooleanFlag
              />
              <button type="button" onClick={this.changeNames} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)
      expect(renderFields).toHaveBeenCalled()
      expect(renderFields).toHaveBeenCalledTimes(2)
      const fields = renderFields.mock.calls[1][0]

      const expectField = field => {
        expect(field).toBeTruthy()
        expect(field.input).toBeTruthy()
        expect(typeof field.input.onChange).toBe('function')
        expect(typeof field.input.onBlur).toBe('function')
        expect(typeof field.input.onFocus).toBe('function')
        expect(field.meta).toBeTruthy()
        expect(field.meta.pristine).toBe(true)
        expect(field.meta.dirty).toBe(false)
        expect(field.someCustomProp).toBeFalsy()
        expect(field.anotherCustomProp).toBeFalsy()
        expect(field.customBooleanFlag).toBeFalsy()
      }

      expectField(fields.fighter)
      expect(fields.fly).toBeTruthy()
      expectField(fields.fly.high)
      expect(fields.array).toBeTruthy()
      expectField(fields.array[1])
      expect(fields.someCustomProp).toBe('testing')
      expect(fields.anotherCustomProp).toBe(42)
      expect(fields.customBooleanFlag).toBe(true)

      expect(fields.foo).toBeFalsy()
      expect(fields.bar).toBeFalsy()
      expect(fields.deep).toBeFalsy()
      expect(fields.array[0]).toBeFalsy()
    })

    it('should reassign event handlers when names change', () => {
      const store = makeStore()
      const renderFields = jest.fn(() => <div />)
      class Form extends Component {
        constructor(props) {
          super(props)
          this.state = { names: ['foo', 'bar', 'deep.dive', 'array[0]'] }
          this.changeNames = this.changeNames.bind(this)
        }
        changeNames() {
          this.setState({ names: ['fighter', 'fly.high', 'array[1]'] })
        }
        render() {
          return (
            <div>
              <Fields
                names={this.state.names}
                component={renderFields}
                someCustomProp="testing"
                anotherCustomProp={42}
                customBooleanFlag
              />
              <button type="button" onClick={this.changeNames} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')

      expect(renderFields).toHaveBeenCalled()
      expect(renderFields).toHaveBeenCalledTimes(1)

      // foo is inactive
      expect(renderFields.mock.calls[0][0].foo.meta.active).toBe(false)

      // focus on foo
      renderFields.mock.calls[0][0].foo.input.onFocus()

      // foo is active
      expect(renderFields).toHaveBeenCalledTimes(2)
      expect(renderFields.mock.calls[1][0].foo.meta.active).toBe(true)
      expect(renderFields.mock.calls[1][0].foo.input.value).toBe('')

      // change foo
      renderFields.mock.calls[1][0].foo.input.onChange('erikras')

      // foo is changed
      expect(renderFields).toHaveBeenCalledTimes(3)
      expect(renderFields.mock.calls[2][0].foo.meta.active).toBe(true)
      expect(renderFields.mock.calls[2][0].foo.input.value).toBe('erikras')

      // blur foo
      renderFields.mock.calls[2][0].foo.input.onBlur('@erikras')

      // foo is blurred
      expect(renderFields).toHaveBeenCalledTimes(4)
      expect(renderFields.mock.calls[3][0].foo.meta.active).toBe(false)
      expect(renderFields.mock.calls[3][0].foo.input.value).toBe('@erikras')

      // swap out fields
      TestUtils.Simulate.click(button)

      // original fields gone
      expect(renderFields).toHaveBeenCalledTimes(5)
      expect(renderFields.mock.calls[4][0].foo).toBeFalsy()
      expect(renderFields.mock.calls[4][0].fighter).toBeTruthy()

      // fighter is inactive
      expect(renderFields.mock.calls[4][0].fighter.meta.active).toBe(false)

      // focus on fighter
      renderFields.mock.calls[4][0].fighter.input.onFocus()

      // fighter is active
      expect(renderFields).toHaveBeenCalledTimes(6)
      expect(renderFields.mock.calls[5][0].fighter.meta.active).toBe(true)
      expect(renderFields.mock.calls[5][0].fighter.input.value).toBe('')

      // change fighter
      renderFields.mock.calls[5][0].fighter.input.onChange('reduxForm')

      // fighter is changed
      expect(renderFields).toHaveBeenCalledTimes(7)
      expect(renderFields.mock.calls[6][0].fighter.meta.active).toBe(true)
      expect(renderFields.mock.calls[6][0].fighter.input.value).toBe(
        'reduxForm'
      )

      // blur fighter
      renderFields.mock.calls[6][0].fighter.input.onBlur('@reduxForm')

      // fighter is blurred
      expect(renderFields).toHaveBeenCalledTimes(8)
      expect(renderFields.mock.calls[7][0].fighter.meta.active).toBe(false)
      expect(renderFields.mock.calls[7][0].fighter.input.value).toBe(
        '@reduxForm'
      )
    })
  })
}

describeFields('Fields.plain', plain, plainCombineReducers, () =>
  expect.extend(plainExpectations)
)
describeFields('Fields.immutable', immutable, immutableCombineReducers, () =>
  expect.extend(immutableExpectations)
)
