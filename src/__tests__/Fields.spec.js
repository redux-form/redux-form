/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { createSpy, spyOn } from 'expect'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-addons-test-utils'
import createReduxForm from '../reduxForm'
import createReducer from '../reducer'
import createFields from '../Fields'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeFields = (name, structure, combineReducers, expect) => {
  const reduxForm = createReduxForm(structure)
  const Fields = createFields(structure)
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
        return <div><Fields names={[ 'foo' ]} component={TestInput}/></div>
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
            <Fields names={[ 'foo', 'bar' ]} component={TestInput}/>
          </div>
        )
      }).toThrow(/must be inside a component decorated with reduxForm/)
    })

    it('should warn if no names prop is provided', () => {
      const spy = spyOn(console, 'error')  // mutes prop type warning
      const store = makeStore()
      class Form extends Component {
        render() {
          return <div><Fields component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      expect(() => {
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <TestForm/>
          </Provider>
        )
      }).toThrow(/No "names" prop was specified/)
      spy.restore()
    })

    it('should warn if invalid names prop is provided', () => {
      const spy = spyOn(console, 'error')  // mutes prop type warning
      const store = makeStore()
      class Form extends Component {
        render() {
          return <div><Fields names="This is a string" component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      expect(() => {
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <TestForm/>
          </Provider>
        )
      }).toThrow(/Invalid prop "names"/)
      spy.restore()
    })

    it('should get value from Redux state', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props.foo.input.value).toBe('bar')
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
      expect(props.foo.meta.error).toBe('foo error')
    })

    it('should get sync warnings from outer reduxForm component', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }, {
        warn: () => ({ foo: 'foo warning' })
      })
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
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'foo', 'bar' ]} component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Fields)
      expect(stub.names).toEqual([ 'foo', 'bar' ])
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
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'foo', 'bar' ]} component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Fields)
      expect(stub.values).toEqual({ foo: 'fooValue', bar: 'barValue' })
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
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'foo', 'bar' ]} component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Fields)
      expect(stub.dirty).toBe(true)
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
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'foo', 'bar' ]} component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Fields)
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
          return <div><Fields names={[ 'foo' ]} component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Fields)
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
          return <div><Fields names={[ 'foo' ]} component={TestInput}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, Fields)
      expect(stub.pristine).toBe(true)
    })

    it('should have value set to initial value on first render', () => {
      const store = makeStore({})
      const input = createSpy(props => <input {...props.foo.input}/>).andCallThrough()
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'foo', 'bar' ]} component={input}/></div>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm'
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm initialValues={{ foo: 'fooValue', bar: 'barValue' }}/>
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls[ 0 ].arguments[ 0 ].foo.input.value).toBe('fooValue')
      expect(input.calls[ 0 ].arguments[ 0 ].bar.input.value).toBe('barValue')
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
      const validate = () => ({ foo: [ 'first error', 'second error' ] })
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'foo[0]', 'foo[1]' ]} component={input}/></div>
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
      expect(input.calls[ 0 ].arguments[ 0 ].foo[ 0 ].meta.valid).toBe(false)
      expect(input.calls[ 0 ].arguments[ 0 ].foo[ 0 ].meta.error).toBe('first error')
      expect(input.calls[ 0 ].arguments[ 0 ].foo[ 1 ].meta.valid).toBe(false)
      expect(input.calls[ 0 ].arguments[ 0 ].foo[ 1 ].meta.error).toBe('second error')
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
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const validate = () => ({
        authors: [
          { _error: 'Object Error' }
        ]
      })
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'authors[0]' ]} component={input}/></div>
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
      expect(input.calls[ 0 ].arguments[ 0 ].authors[ 0 ].meta.valid).toBe(false)
      expect(input.calls[ 0 ].arguments[ 0 ].authors[ 0 ].meta.error).toBe('Object Error')
    })

    it('should provide sync warning for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [ 'bar' ]
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const warn = () => ({ foo: [ 'first warning', 'second warning' ] })
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'foo[0]', 'foo[1]' ]} component={input}/></div>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].foo[ 0 ].meta.warning).toBe('first warning')
      expect(input.calls[ 0 ].arguments[ 0 ].foo[ 1 ].meta.warning).toBe('second warning')
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
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const warn = () => ({
        authors: [
          { _warning: 'Object Error' }
        ]
      })
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'authors[0]' ]} component={input}/></div>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].authors[ 0 ].meta.warning).toBe('Object Error')
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
      class Form extends Component {
        render() {
          return <div><Fields names={[ 'foo', 'bar' ]} component={TestInput} withRef/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const field = TestUtils.findRenderedComponentWithType(dom, Fields)
      const input = TestUtils.findRenderedComponentWithType(dom, TestInput)

      expect(field.getRenderedComponent()).toBe(input)
    })

    it('should unregister fields when unmounted', () => {
      const store = makeStore()
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { toggle: false }
        }

        render() {
          const { toggle } = this.state
          return (<div>
            {!toggle && <Fields names={[ 'dog', 'cat' ]} component={input}/>}
            {toggle && <Fields names={[ 'cow', 'ewe' ]} component={input}/>}
            <button onClick={() => this.setState({ toggle: true })}>Toggle</button>
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
            registeredFields: [
              { name: 'dog', type: 'Field' },
              { name: 'cat', type: 'Field' }
            ]
          }
        }
      })

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              { name: 'cow', type: 'Field' },
              { name: 'ewe', type: 'Field' }
            ]
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
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { field: 'foo' }
        }

        render() {
          return (<div>
            <Fields names={[ this.state.field ]} component={input}/>
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
      expect(input.calls[ 0 ].arguments[ 0 ].foo.input.value).toBe('fooValue')
      expect(input.calls[ 0 ].arguments[ 0 ].foo.meta.touched).toBe(false)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].bar.input.value).toBe('barValue')
      expect(input.calls[ 1 ].arguments[ 0 ].bar.meta.touched).toBe(true)
    })


    it('should prefix name when inside FormSection', () => {
      const store = makeStore()
      const renderFields = ({ foo, bar }) => <div>
        <input {...foo.input}/>
        <input {...bar.input}/>
      </div>
      class Form extends Component {
        render() {
          return (<FormSection name="foo">
            <Fields names={[ 'foo', 'bar' ]} component={renderFields}/>
          </FormSection>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ 
              { name: 'foo.foo', type: 'Field' },
              { name: 'foo.bar', type: 'Field' }              
            ]
          }
        }
      })
    })

    it('should prefix name when inside multiple FormSections', () => {
      const store = makeStore()
      const renderFields = ({ foo, bar }) => <div>
        <input {...foo.input}/>
        <input {...bar.input}/>
      </div>
      class Form extends Component {
        render() {
          return (<FormSection name="foo">
            <FormSection name="fighter">
              <Fields names={[ 'foo', 'bar' ]} component={renderFields}/>
            </FormSection>
          </FormSection>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ 
              { name: 'foo.fighter.foo', type: 'Field' },
              { name: 'foo.fighter.bar', type: 'Field' }              
            ]
          }
        }
      })
    })


    it('should rerender when props change', () => {
      const store = makeStore()
      const renderFields = createSpy(props => <div>{props.highlighted}<input {...props.foo.input}/></div>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { highlighted: 0 }
        }

        render() {
          const { highlighted } = this.state
          return (<div>
            <Fields names={[ 'foo' ]} highlighted={highlighted} component={renderFields}/>
            <button onClick={() => this.setState({ highlighted: highlighted + 1 })}>Change</button>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(renderFields).toHaveBeenCalled()
      expect(renderFields.calls.length).toBe(1)
      expect(renderFields.calls[ 0 ].arguments[ 0 ].highlighted).toBe(0)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(renderFields.calls.length).toBe(2)
      expect(renderFields.calls[ 1 ].arguments[ 0 ].highlighted).toBe(1)
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
            <Fields names={[ 'myField' ]} component={input} props={{ rel: 'test' }}/>
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
      const inputPair1 = createSpy(({ cat, dog }) => <div>
        <input {...cat.input}/>
        <input {...dog.input}/>
      </div>).andCallThrough()
      const inputPair2 = createSpy(({ ewe, fox }) => <div>
        <input {...ewe.input}/>
        <input {...fox.input}/>
      </div>).andCallThrough()
      class Form extends Component {
        render() {
          return (<div>
            <Fields names={[ 'cat', 'dog' ]} component={inputPair1}/>
            <Fields names={[ 'ewe', 'fox' ]} component={inputPair2}/>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(inputPair1).toHaveBeenCalled()
      expect(inputPair1.calls.length).toBe(1)
      expect(inputPair1.calls[ 0 ].arguments[ 0 ].cat.input.value).toBe('catValue')
      expect(inputPair1.calls[ 0 ].arguments[ 0 ].dog.input.value).toBe('dogValue')

      expect(inputPair2).toHaveBeenCalled()
      expect(inputPair2.calls.length).toBe(1)
      expect(inputPair2.calls[ 0 ].arguments[ 0 ].ewe.input.value).toBe('eweValue')
      expect(inputPair2.calls[ 0 ].arguments[ 0 ].fox.input.value).toBe('foxValue')

      inputPair1.calls[ 0 ].arguments[ 0 ].dog.input.onChange('FIDO')

      // input pair 1 should be rerendered
      expect(inputPair1.calls.length).toBe(2)
      expect(inputPair1.calls[ 1 ].arguments[ 0 ].cat.input.value).toBe('catValue')
      expect(inputPair1.calls[ 1 ].arguments[ 0 ].dog.input.value).toBe('FIDO')

      // input pair 2 should NOT be rerendered
      expect(inputPair2.calls.length).toBe(1)
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
              <Fields names={[ 'name' ]} component={input} format={format}/>
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
      expect(format.calls[ 0 ].arguments).toEqual([ 'Redux Form', 'name' ])

      expect(input.calls[ 0 ].arguments[ 0 ].name.input.value).toBe('redux form')
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
              <Fields names={[ 'name' ]} component={input} parse={parse}/>
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
      expect(input.calls[ 0 ].arguments[ 0 ].name.input.value).toBe('redux form')

      input.calls[ 0 ].arguments[ 0 ].name.input.onChange('REDUX FORM ROCKS')

      expect(parse).toHaveBeenCalled()
      expect(parse.calls.length).toBe(1)
      expect(parse.calls[ 0 ].arguments).toEqual([ 'REDUX FORM ROCKS', 'name' ])

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].name.input.value).toBe('redux form rocks')
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
              <Fields names={[ 'name' ]} component={input} parse={parse}/>
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
      expect(input.calls[ 0 ].arguments[ 0 ].name.input.value).toBe('redux form')

      input.calls[ 0 ].arguments[ 0 ].name.input.onBlur('REDUX FORM ROCKS')

      expect(parse).toHaveBeenCalled()
      expect(parse.calls.length).toBe(1)
      expect(parse.calls[ 0 ].arguments).toEqual([ 'REDUX FORM ROCKS', 'name' ])

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].name.input.value).toBe('redux form rocks')
    })

    it('should handle on focus', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'redux form'
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={[ 'name' ]} component={input}/>
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

      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].name.meta.visited).toBe(false)

      input.calls[ 0 ].arguments[ 0 ].name.input.onFocus()

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].name.meta.visited).toBe(true)
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
              <Fields names={[ 'age' ]} component={input} format={format} parse={parse}/>
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
      expect(input.calls[ 0 ].arguments[ 0 ].age.input.value).toBe('42')

      // update value
      input.calls[ 0 ].arguments[ 0 ].age.input.onChange('15')

      // parse was called
      expect(parse).toHaveBeenCalled()
      expect(parse.calls.length).toBe(1)
      expect(parse.calls[ 0 ].arguments).toEqual([ '15', 'age' ])

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
      expect(format.calls[ 1 ].arguments).toEqual([ 15, 'age' ])

      // input rerendered with string value
      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].age.input.value).toBe('15')
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
            <Fields names={[ 'password' ]} component={passwordInput}/>
            <Fields names={[ 'confirm' ]} component={confirmInput}/>
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
      expect(confirmInput.calls[ 0 ].arguments[ 0 ].confirm.meta.valid).toBe(false)
      expect(confirmInput.calls[ 0 ].arguments[ 0 ].confirm.meta.error).toBe('Must match!')

      // update password field so that they match
      passwordInput.calls[ 0 ].arguments[ 0 ].password.input.onChange('redux-form rocks')

      // password input rerendered
      expect(passwordInput.calls.length).toBe(2)

      // confirm input should also rerender, but with no error
      expect(confirmInput.calls.length).toBe(2)
      expect(confirmInput.calls[ 1 ].arguments[ 0 ].confirm.meta.valid).toBe(true)
      expect(confirmInput.calls[ 1 ].arguments[ 0 ].confirm.meta.error).toBe(undefined)
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
            <Fields names={[ 'username' ]} component={usernameInput}/>
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
      expect(usernameInput.calls[ 0 ].arguments[ 0 ].username.meta.valid).toBe(false)
      expect(usernameInput.calls[ 0 ].arguments[ 0 ].username.meta.error).toBe('Required')

      // update username field so it passes
      usernameInput.calls[ 0 ].arguments[ 0 ].username.input.onChange('erikras')

      // username input rerendered
      expect(usernameInput.calls.length).toBe(2)

      // should be valid now
      expect(usernameInput.calls[ 1 ].arguments[ 0 ].username.meta.valid).toBe(true)
      expect(usernameInput.calls[ 1 ].arguments[ 0 ].username.meta.error).toBe(undefined)
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
      const passwordInput = createSpy(props => <input {...props.input}/>).andCallThrough()
      const confirmInput = createSpy(props => <input {...props.input}/>).andCallThrough()
      const warn = values => {
        const password = getIn(values, 'password')
        const confirm = getIn(values, 'confirm')
        return password === confirm ? {} : { confirm: 'Should match. Or not. Whatever.' }
      }
      class Form extends Component {
        render() {
          return (<div>
            <Fields names={[ 'password' ]} component={passwordInput}/>
            <Fields names={[ 'confirm' ]} component={confirmInput}/>
          </div>)
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      // password input rendered
      expect(passwordInput).toHaveBeenCalled()
      expect(passwordInput.calls.length).toBe(1)

      // confirm input rendered with warning
      expect(confirmInput).toHaveBeenCalled()
      expect(confirmInput.calls.length).toBe(1)
      expect(confirmInput.calls[ 0 ].arguments[ 0 ].confirm.meta.warning).toBe('Should match. Or not. Whatever.')

      // update password field so that they match
      passwordInput.calls[ 0 ].arguments[ 0 ].password.input.onChange('redux-form rocks')

      // password input rerendered
      expect(passwordInput.calls.length).toBe(2)

      // confirm input should also rerender, but with no warning
      expect(confirmInput.calls.length).toBe(2)
      expect(confirmInput.calls[ 1 ].arguments[ 0 ].confirm.meta.warning).toBe(undefined)
    })

    it('should rerender when sync warning is cleared', () => {
      const store = makeStore()
      const usernameInput = createSpy(props => <input {...props.input}/>).andCallThrough()
      const warn = values => {
        const username = getIn(values, 'username')
        return username ? {} : { username: 'Recommended' }
      }
      class Form extends Component {
        render() {
          return (<div>
            <Fields names={[ 'username' ]} component={usernameInput}/>
          </div>)
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      // username input rendered
      expect(usernameInput).toHaveBeenCalled()
      expect(usernameInput.calls.length).toBe(1)

      // username field has warning
      expect(usernameInput.calls[ 0 ].arguments[ 0 ].username.meta.warning).toBe('Recommended')

      // update username field so it passes
      usernameInput.calls[ 0 ].arguments[ 0 ].username.input.onChange('erikras')

      // username input rerendered
      expect(usernameInput.calls.length).toBe(2)

      // should be valid now
      expect(usernameInput.calls[ 1 ].arguments[ 0 ].username.meta.warning).toBe(undefined)
    })

    it('should provide correct prop structure', () => {
      const store = makeStore()
      const renderFields = createSpy(() => <div/>).andCallThrough()
      class Form extends Component {
        render() {
          return (<div>
            <Fields
              names={[ 'foo', 'bar', 'deep.dive', 'array[0]', 'array[1]' ]}
              component={renderFields}
              someCustomProp="testing"
              anotherCustomProp={42}
              customBooleanFlag/>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      expect(renderFields).toHaveBeenCalled()
      const fields = renderFields.calls[ 0 ].arguments[ 0 ]

      const expectField = field => {
        expect(field).toExist()
        expect(field.input).toExist()
        expect(field.input.onChange).toBeA('function')
        expect(field.input.onBlur).toBeA('function')
        expect(field.input.onFocus).toBeA('function')
        expect(field.meta).toExist()
        expect(field.meta.pristine).toBe(true)
        expect(field.meta.dirty).toBe(false)
        expect(field.someCustomProp).toNotExist()
        expect(field.anotherCustomProp).toNotExist()
        expect(field.customBooleanFlag).toNotExist()
      }

      expectField(fields.foo)
      expectField(fields.bar)
      expect(fields.deep).toExist()
      expectField(fields.deep.dive)
      expect(fields.array).toExist()
      expectField(fields.array[0])
      expectField(fields.array[1])
      expect(fields.someCustomProp).toBe('testing')
      expect(fields.anotherCustomProp).toBe(42)
      expect(fields.customBooleanFlag).toBe(true)
    })
  })
}

describeFields('Fields.plain', plain, plainCombineReducers, addExpectations(plainExpectations))
describeFields('Fields.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations))
