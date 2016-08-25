/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import TestUtils from 'react-addons-test-utils'
import { createSpy } from 'expect'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import { Provider } from 'react-redux'
import { noop } from 'lodash'
import createReducer from '../reducer'
import createReduxForm from '../reduxForm'
import createField from '../Field'
import createFieldArray from '../FieldArray'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'
import SubmissionError from '../SubmissionError'
import { change } from '../actions'

const describeReduxForm = (name, structure, combineReducers, expect) => {
  const { fromJS, getIn } = structure
  const reduxForm = createReduxForm(structure)
  const Field = createField(structure)
  const FieldArray = createFieldArray(structure)
  const reducer = createReducer(structure)

  describe(name, () => {
    const makeStore = (initial = {}) => createStore(
      combineReducers({ form: reducer }), fromJS({ form: initial }))

    const propChecker = (formState, renderSpy = noop, config = {}) => {
      const store = makeStore({ testForm: formState })
      class Form extends Component {
        render() {
          renderSpy(this.props)
          return (
            <div>
              <Field name="foo" component="input"/>
            </div>
          )
        }
      }
      const Decorated = reduxForm({ form: 'testForm', ...config })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )
      return TestUtils.findRenderedComponentWithType(dom, Form).props
    }

    it('should return a decorator function', () => {
      expect(reduxForm).toBeA('function')
    })

    it('should render without error', () => {
      const store = makeStore()
      class Form extends Component {
        render() {
          return <div />
        }
      }
      expect(() => {
        const Decorated = reduxForm({ form: 'testForm' })(Form)
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <Decorated/>
          </Provider>
        )
      }).toNotThrow()
    })

    it('should provide a the correct props', () => {
      const props = propChecker({})
      expect(Object.keys(props).sort()).toEqual([
        'anyTouched',
        'array',
        'asyncValidate',
        'asyncValidating',
        'autofill',
        'blur',
        'change',
        'destroy',
        'dirty',
        'dispatch',
        'error',
        'form',
        'handleSubmit',
        'initialValues',
        'initialize',
        'initialized',
        'invalid',
        'pristine',
        'pure',
        'reset',
        'submitFailed',
        'submitSucceeded',
        'submitting',
        'touch',
        'untouch',
        'valid'
      ])
      expect(props.anyTouched).toBeA('boolean')
      expect(props.array).toExist().toBeA('object')
      expect(Object.keys(props.array).sort()).toEqual([
        'insert',
        'move',
        'pop',
        'push',
        'remove',
        'removeAll',
        'shift',
        'splice',
        'swap',
        'unshift'
      ])
      expect(props.array.insert).toExist().toBeA('function')
      expect(props.array.move).toExist().toBeA('function')
      expect(props.array.pop).toExist().toBeA('function')
      expect(props.array.push).toExist().toBeA('function')
      expect(props.array.remove).toExist().toBeA('function')
      expect(props.array.removeAll).toExist().toBeA('function')
      expect(props.array.shift).toExist().toBeA('function')
      expect(props.array.splice).toExist().toBeA('function')
      expect(props.array.swap).toExist().toBeA('function')
      expect(props.array.unshift).toExist().toBeA('function')
      expect(props.asyncValidate).toExist().toBeA('function')
      expect(props.asyncValidating).toBeA('boolean')
      expect(props.destroy).toExist().toBeA('function')
      expect(props.dirty).toBeA('boolean')
      expect(props.form).toExist().toBeA('string')
      expect(props.handleSubmit).toExist().toBeA('function')
      expect(props.initialize).toExist().toBeA('function')
      expect(props.initialized).toBeA('boolean')
      expect(props.pristine).toBeA('boolean')
      expect(props.reset).toExist().toBeA('function')
      expect(props.submitFailed).toBeA('boolean')
      expect(props.submitSucceeded).toBeA('boolean')
      expect(props.touch).toExist().toBeA('function')
      expect(props.untouch).toExist().toBeA('function')
      expect(props.valid).toBeA('boolean')
    })

    it('should provide dirty prop', () => {
      expect(propChecker({}).dirty).toBe(false)
      expect(propChecker({
        // no initial values
        values: {
          foo: 'bar'
        }
      }).dirty).toBe(true)
      expect(propChecker({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }).dirty).toBe(false)
      expect(propChecker({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      }).dirty).toBe(true)
    })

    it('should provide pristine prop', () => {
      expect(propChecker({}).pristine).toBe(true)
      expect(propChecker({
        // no initial values
        values: {
          foo: 'bar'
        }
      }).pristine).toBe(false)
      expect(propChecker({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }).pristine).toBe(true)
      expect(propChecker({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      }).pristine).toBe(false)
    })

    it('should provide valid prop', () => {
      expect(propChecker({}).valid).toBe(true)
      expect(propChecker({}, undefined, {
        validate: () => ({ foo: 'sync error' })
      }).valid).toBe(false)
      expect(propChecker({
        asyncErrors: {
          foo: 'bar'
        }
      }).valid).toBe(false)
      expect(propChecker({
        asyncErrors: {
          nested: {
            myArrayField: [
              undefined,
              undefined
            ]
          }
        }
      }).valid).toBe(true)
    })

    it('should provide invalid prop', () => {
      expect(propChecker({}).invalid).toBe(false)
      expect(propChecker({}, undefined, {
        validate: () => ({ foo: 'sync error' })
      }).invalid).toBe(true)
      expect(propChecker({
        asyncErrors: {
          foo: 'bar'
        }
      }).invalid).toBe(true)
    })

    it('should provide submitting prop', () => {
      expect(propChecker({}).submitting).toBe(false)
      expect(propChecker({ submitting: true }).submitting).toBe(true)
      expect(propChecker({ submitting: false }).submitting).toBe(false)
    })

    it('should put props under prop namespace if specified', () => {
      const props = propChecker({}, noop, {
        propNamespace: 'fooProps',
        someOtherProp: 'whatever'
      })
      expect(props.fooProps).toExist().toBeA('object')
      expect(props.dispatch).toNotExist()
      expect(props.dirty).toNotExist()
      expect(props.pristine).toNotExist()
      expect(props.submitting).toNotExist()
      expect(props.someOtherProp).toExist()
      expect(props.fooProps.dispatch).toBeA('function')
      expect(props.fooProps.dirty).toBeA('boolean')
      expect(props.fooProps.pristine).toBeA('boolean')
      expect(props.fooProps.submitting).toBeA('boolean')
      expect(props.fooProps.someOtherProp).toNotExist()
    })

    it('should provide bound array action creators', () => {
      const arrayProp = propChecker({}).array
      expect(arrayProp).toExist()
      expect(arrayProp.insert).toExist().toBeA('function')
      expect(arrayProp.pop).toExist().toBeA('function')
      expect(arrayProp.push).toExist().toBeA('function')
      expect(arrayProp.remove).toExist().toBeA('function')
      expect(arrayProp.shift).toExist().toBeA('function')
      expect(arrayProp.splice).toExist().toBeA('function')
      expect(arrayProp.swap).toExist().toBeA('function')
      expect(arrayProp.unshift).toExist().toBeA('function')
    })

    it('should not rerender unless form-wide props (except value!) change', () => {
      const spy = createSpy()
      const { dispatch } = propChecker({}, spy, {
        validate: values => {
          const foo = getIn(values, 'foo')
          return foo && foo.length > 5 ? { foo: 'Too long' } : {}
        }
      })  // render 0
      expect(spy.calls.length).toBe(1)

      // simulate typing the word "giraffe"
      dispatch(change('testForm', 'foo', 'g'))       // render 1 (now dirty)
      expect(spy.calls.length).toBe(2)

      dispatch(change('testForm', 'foo', 'gi'))      // no render
      dispatch(change('testForm', 'foo', 'gir'))     // no render
      dispatch(change('testForm', 'foo', 'gira'))    // no render
      dispatch(change('testForm', 'foo', 'giraf'))   // no render
      dispatch(change('testForm', 'foo', 'giraff'))  // render 2 (invalid)
      expect(spy.calls.length).toBe(3)
      dispatch(change('testForm', 'foo', 'giraffe')) // no render

      dispatch(change('testForm', 'foo', '')) // render 3 (clean/valid)
      expect(spy.calls.length).toBe(5)  // two renders, one to change value, and other to revalidate

      expect(spy.calls[ 0 ].arguments[ 0 ].dirty).toBe(false)
      expect(spy.calls[ 0 ].arguments[ 0 ].invalid).toBe(false)
      expect(spy.calls[ 0 ].arguments[ 0 ].pristine).toBe(true)
      expect(spy.calls[ 0 ].arguments[ 0 ].valid).toBe(true)

      expect(spy.calls[ 1 ].arguments[ 0 ].dirty).toBe(true)
      expect(spy.calls[ 1 ].arguments[ 0 ].invalid).toBe(false)
      expect(spy.calls[ 1 ].arguments[ 0 ].pristine).toBe(false)
      expect(spy.calls[ 1 ].arguments[ 0 ].valid).toBe(true)

      expect(spy.calls[ 2 ].arguments[ 0 ].dirty).toBe(true)
      expect(spy.calls[ 2 ].arguments[ 0 ].invalid).toBe(true)
      expect(spy.calls[ 2 ].arguments[ 0 ].pristine).toBe(false)
      expect(spy.calls[ 2 ].arguments[ 0 ].valid).toBe(false)

      expect(spy.calls[ 4 ].arguments[ 0 ].dirty).toBe(false)
      expect(spy.calls[ 4 ].arguments[ 0 ].invalid).toBe(false)
      expect(spy.calls[ 4 ].arguments[ 0 ].pristine).toBe(true)
      expect(spy.calls[ 4 ].arguments[ 0 ].valid).toBe(true)
    })

    it('should rerender on every change if pure is false', () => {
      const spy = createSpy()
      const { dispatch } = propChecker({}, spy, {
        pure: false
      })
      expect(spy.calls.length).toBe(2)  // twice, second one is for after field registration

      // simulate typing the word "giraffe"
      dispatch(change('testForm', 'foo', 'g'))
      expect(spy.calls.length).toBe(3)
      dispatch(change('testForm', 'foo', 'gi'))
      expect(spy.calls.length).toBe(4)
      dispatch(change('testForm', 'foo', 'gir'))
      expect(spy.calls.length).toBe(5)
      dispatch(change('testForm', 'foo', 'gira'))
      expect(spy.calls.length).toBe(6)
      dispatch(change('testForm', 'foo', 'giraf'))
      expect(spy.calls.length).toBe(7)
      dispatch(change('testForm', 'foo', 'giraff'))
      expect(spy.calls.length).toBe(8)
      dispatch(change('testForm', 'foo', 'giraffe'))
      expect(spy.calls.length).toBe(9)
    })

    it('should initialize values with initialValues on first render', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()
      const initialValues = {
        deep: {
          foo: 'bar'
        }
      }
      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated initialValues={initialValues}/>
        </Provider>
      )
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: initialValues,
            values: initialValues,
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ]
          }
        }
      })
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)
      const checkProps = props => {
        expect(props.pristine).toBe(true)
        expect(props.dirty).toBe(false)
        expect(props.initialized).toBe(false) // will be true on second render
        expect(props.initialValues).toEqualMap(initialValues)
      }
      checkProps(formRender.calls[ 0 ].arguments[ 0 ])

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      expect(inputRender.calls[ 0 ].arguments[ 0 ].meta.pristine).toBe(true)
      expect(inputRender.calls[ 0 ].arguments[ 0 ].meta.dirty).toBe(false)
      expect(inputRender.calls[ 0 ].arguments[ 0 ].input.value).toBe('bar')
    })

    it('should initialize with initialValues on later render if not already initialized', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()
      const initialValues = {
        deep: {
          foo: 'bar'
        }
      }

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({ form: 'testForm' })(Form)

      class Container extends Component {
        constructor(props) {
          super(props)
          this.state = {}
        }

        render() {
          return (
            <div>
              <Provider store={store}>
                <Decorated {...this.state}/>
              </Provider>
              <button onClick={() => this.setState({ initialValues })}>Init</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(<Container/>)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ]
          }
        }
      })
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      const checkInputProps = (props, value) => {
        expect(props.meta.pristine).toBe(true)
        expect(props.meta.dirty).toBe(false)
        expect(props.input.value).toBe(value)
      }
      checkInputProps(inputRender.calls[ 0 ].arguments[ 0 ], '')

      // initialize
      const initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(initButton)

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              {
                name: 'deep.foo',
                type: 'Field'
              }
            ],
            initial: initialValues,
            values: initialValues
          }
        }
      })

      // no need to rerender form on initialize
      expect(formRender.calls.length).toBe(1)

      // check rerendered input
      expect(inputRender.calls.length).toBe(2)
      checkInputProps(inputRender.calls[ 1 ].arguments[ 0 ], 'bar')
    })

    it('should NOT reinitialize with initialValues', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()
      const initialValues1 = {
        deep: {
          foo: 'bar'
        }
      }
      const initialValues2 = {
        deep: {
          foo: 'baz'
        }
      }

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({ form: 'testForm' })(Form)

      class Container extends Component {
        constructor(props) {
          super(props)
          this.state = { initialValues: initialValues1 }
        }

        render() {
          return (
            <div>
              <Provider store={store}>
                <Decorated {...this.state}/>
              </Provider>
              <button onClick={() => this.setState({ initialValues: initialValues2 })}>Init</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(<Container/>)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ],
            initial: initialValues1,
            values: initialValues1
          }
        }
      })
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      const checkInputProps = (props, value) => {
        expect(props.meta.pristine).toBe(true)
        expect(props.meta.dirty).toBe(false)
        expect(props.input.value).toBe(value)
      }
      checkInputProps(inputRender.calls[ 0 ].arguments[ 0 ], 'bar')

      // initialize
      const initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(initButton)

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              {
                name: 'deep.foo',
                type: 'Field'
              }
            ],
            initial: initialValues1,
            values: initialValues1
          }
        }
      })

      // rerender just because prop changed
      expect(formRender.calls.length).toBe(2)

      // no need to rerender input since nothing changed
      expect(inputRender.calls.length).toBe(1)
    })

    it('should reinitialize with initialValues if enableReinitialize', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()
      const initialValues1 = {
        deep: {
          foo: 'bar'
        }
      }
      const initialValues2 = {
        deep: {
          foo: 'baz'
        }
      }

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true
      })(Form)

      class Container extends Component {
        constructor(props) {
          super(props)
          this.state = { initialValues: initialValues1 }
        }

        render() {
          return (
            <div>
              <Provider store={store}>
                <Decorated {...this.state}/>
              </Provider>
              <button onClick={() => this.setState({ initialValues: initialValues2 })}>Init</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(<Container/>)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ],
            initial: initialValues1,
            values: initialValues1
          }
        }
      })
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      const checkInputProps = (props, value) => {
        expect(props.meta.pristine).toBe(true)
        expect(props.meta.dirty).toBe(false)
        expect(props.input.value).toBe(value)
      }
      checkInputProps(inputRender.calls[ 0 ].arguments[ 0 ], 'bar')

      // initialize
      const initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(initButton)

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              {
                name: 'deep.foo',
                type: 'Field'
              }
            ],
            initial: initialValues2,
            values: initialValues2
          }
        }
      })

      // rerendered twice because prop changed and values initialized
      expect(formRender.calls.length).toBe(3)

      // should rerender input with new value
      expect(inputRender.calls.length).toBe(2)
      checkInputProps(inputRender.calls[ 1 ].arguments[ 0 ], 'baz')
    })

    it('should retain dirty fields if keepDirtyOnReinitialize is set', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()
      const initialValues1 = {
        deep: {
          foo: 'bar'
        }
      }
      const initialValues2 = {
        deep: {
          foo: 'baz'
        }
      }

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true,
        keepDirtyOnReinitialize: true
      })(Form)

      class Container extends Component {
        constructor(props) {
          super(props)
          this.state = { initialValues: initialValues1 }
        }

        render() {
          return (
            <div>
              <Provider store={store}>
                <Decorated {...this.state}/>
              </Provider>
              <button onClick={() => this.setState({ initialValues: initialValues2 })}>Init</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(<Container/>)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ],
            initial: initialValues1,
            values: initialValues1
          }
        }
      })
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      const checkInputProps = (props, value, dirty) => {
        expect(props.meta.pristine).toBe(!dirty)
        expect(props.meta.dirty).toBe(dirty)
        expect(props.input.value).toBe(value)
      }
      checkInputProps(inputRender.calls[ 0 ].arguments[ 0 ], 'bar', false)

      // Change the input value.
      const onChange = inputRender.calls[ 0 ].arguments[ 0 ].input.onChange
      onChange('dirtyvalue')

      // Expect rerenders due to the change.
      expect(formRender.calls.length).toBe(2)
      expect(inputRender.calls.length).toBe(2)

      // Reinitialize the form
      const initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(initButton)

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              {
                name: 'deep.foo',
                type: 'Field'
              }
            ],
            initial: initialValues2,
            values: {
              deep: {
                foo: 'dirtyvalue'
              }
            }
          }
        }
      })

      // Expect the form not to rerender, since the value did not change.
      expect(formRender.calls.length).toBe(2)

      // should rerender input with the dirty value.
      expect(inputRender.calls.length).toBe(2)
      checkInputProps(inputRender.calls[ 1 ].arguments[ 0 ], 'dirtyvalue', true)
    })

    it('should not retain dirty fields if keepDirtyOnReinitialize is not set', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()
      const initialValues1 = {
        deep: {
          foo: 'bar'
        }
      }
      const initialValues2 = {
        deep: {
          foo: 'baz'
        }
      }

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true
      })(Form)

      class Container extends Component {
        constructor(props) {
          super(props)
          this.state = { initialValues: initialValues1 }
        }

        render() {
          return (
            <div>
              <Provider store={store}>
                <Decorated {...this.state}/>
              </Provider>
              <button onClick={() => this.setState({ initialValues: initialValues2 })}>Init</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(<Container/>)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ],
            initial: initialValues1,
            values: initialValues1
          }
        }
      })
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      const checkInputProps = (props, value, dirty) => {
        expect(props.meta.pristine).toBe(!dirty)
        expect(props.meta.dirty).toBe(dirty)
        expect(props.input.value).toBe(value)
      }
      checkInputProps(inputRender.calls[ 0 ].arguments[ 0 ], 'bar', false)

      // Change the input value.
      const onChange = inputRender.calls[ 0 ].arguments[ 0 ].input.onChange
      onChange('dirtyvalue')

      // Expect rerenders due to the change.
      expect(formRender.calls.length).toBe(2)
      expect(inputRender.calls.length).toBe(2)

      // Reinitialize the form
      const initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(initButton)

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              {
                name: 'deep.foo',
                type: 'Field'
              }
            ],
            initial: initialValues2,
            values: initialValues2
          }
        }
      })

      // Expect the form to rerender, since the value was replaced.
      expect(formRender.calls.length).toBe(3)

      // should rerender input with the pristine value.
      expect(inputRender.calls.length).toBe(3)
      checkInputProps(inputRender.calls[ 2 ].arguments[ 0 ], 'baz', false)
    })

    it('should make pristine any dirty field that has the new initial value, when keepDirtyOnReinitialize', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()
      const initialValues1 = {
        deep: {
          foo: 'bar'
        }
      }
      const initialValues2 = {
        deep: {
          foo: 'futurevalue'
        }
      }

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true,
        keepDirtyOnReinitialize: true
      })(Form)

      class Container extends Component {
        constructor(props) {
          super(props)
          this.state = { initialValues: initialValues1 }
        }

        render() {
          return (
            <div>
              <Provider store={store}>
                <Decorated {...this.state}/>
              </Provider>
              <button onClick={() => this.setState({ initialValues: initialValues2 })}>Init</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(<Container/>)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ],
            initial: initialValues1,
            values: initialValues1
          }
        }
      })
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      const checkInputProps = (props, value, dirty) => {
        expect(props.meta.pristine).toBe(!dirty)
        expect(props.meta.dirty).toBe(dirty)
        expect(props.input.value).toBe(value)
      }
      checkInputProps(inputRender.calls[ 0 ].arguments[ 0 ], 'bar', false)

      // Change the input value.
      const onChange = inputRender.calls[ 0 ].arguments[ 0 ].input.onChange
      onChange('futurevalue')

      // Expect rerenders due to the change.
      expect(formRender.calls.length).toBe(2)
      expect(inputRender.calls.length).toBe(2)

      // Reinitialize the form
      const initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(initButton)

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              {
                name: 'deep.foo',
                type: 'Field'
              }
            ],
            initial: initialValues2,
            values: initialValues2
          }
        }
      })

      // Expect the form to rerender only once more because the value did
      // not change.
      expect(formRender.calls.length).toBe(3)

      // should rerender input with the new value that is now pristine.
      expect(inputRender.calls.length).toBe(3)
      checkInputProps(inputRender.calls[ 2 ].arguments[ 0 ], 'futurevalue', false)
    })

    // Test related to #1436
    /*
     it('should allow initialization via action to set pristine', () => {
     const store = makeStore({})
     const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
     const formRender = createSpy()
     const initialValues1 = {
     deep: {
     foo: 'bar'
     }
     }
     const initialValues2 = {
     deep: {
     foo: 'baz'
     }
     }

     class Form extends Component {
     render() {
     formRender(this.props)
     return (
     <form>
     <Field name="deep.foo" component={inputRender} type="text"/>
     </form>
     )
     }
     }
     const Decorated = reduxForm({
     form: 'testForm',
     initialValues: initialValues1
     })(Form)

     TestUtils.renderIntoDocument(
     <Provider store={store}>
     <Decorated/>
     </Provider>
     )
     expect(store.getState()).toEqualMap({
     form: {
     testForm: {
     registeredFields: [ { name: 'deep.foo', type: 'Field' } ],
     initial: initialValues1,
     values: initialValues1
     }
     }
     })
     expect(formRender).toHaveBeenCalled()
     expect(formRender.calls.length).toBe(1)
     expect(formRender.calls[ 0 ].arguments[ 0 ].pristine).toBe(true)

     expect(inputRender).toHaveBeenCalled()
     expect(inputRender.calls.length).toBe(1)
     expect(inputRender.calls[ 0 ].arguments[ 0 ].meta.pristine).toBe(true)
     expect(inputRender.calls[ 0 ].arguments[ 0 ].input.value).toBe('bar')

     // check initialized state
     expect(store.getState()).toEqualMap({
     form: {
     testForm: {
     registeredFields: [
     {
     name: 'deep.foo',
     type: 'Field'
     }
     ],
     initial: initialValues1,
     values: initialValues1
     }
     }
     })

     // initialize with action
     store.dispatch(initialize('testForm', initialValues2))

     // check initialized state
     expect(store.getState()).toEqualMap({
     form: {
     testForm: {
     registeredFields: [
     {
     name: 'deep.foo',
     type: 'Field'
     }
     ],
     initial: initialValues2,
     values: initialValues2
     }
     }
     })

     // rerendered
     expect(formRender.calls.length).toBe(2)
     expect(formRender.calls[ 1 ].arguments[ 0 ].pristine).toBe(true)

     expect(inputRender).toHaveBeenCalled()
     expect(inputRender.calls.length).toBe(2)
     expect(inputRender.calls[ 1 ].arguments[ 0 ].meta.pristine).toBe(true)
     expect(inputRender.calls[ 1 ].arguments[ 0 ].input.value).toBe('baz')
     })
     */

    it('should destroy on unmount by default', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm'
      })(Form)

      class Container extends Component {
        constructor(props) {
          super(props)
          this.state = { showForm: true }
        }

        render() {
          const { showForm } = this.state
          return (
            <div>
              <Provider store={store}>
                <div>
                  {showForm && <Decorated {...this.state}/>}
                </div>
              </Provider>
              <button onClick={() => this.setState({ showForm: !showForm })}>Toggle</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(<Container/>)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ]
          }
        }
      }, 'Form data in Redux did not get destroyed')
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      expect(inputRender.calls[ 0 ].arguments[ 0 ].input.value).toBe('')

      // change field
      inputRender.calls[ 0 ].arguments[ 0 ].input.onChange('bob')

      // form rerenders because now dirty
      expect(formRender.calls.length).toBe(2)

      // input now has value
      expect(inputRender.calls.length).toBe(2)
      expect(inputRender.calls[ 1 ].arguments[ 0 ].input.value).toBe('bob')

      // check state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bob'
              }
            },
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ]
          }
        }
      })

      // unmount form
      const toggle = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(toggle)

      // check clean state
      expect(store.getState()).toEqualMap({
        form: {}
      })

      // form still not rendered again
      expect(formRender.calls.length).toBe(2)

      // toggle form back into existence
      TestUtils.Simulate.click(toggle)

      // form is back
      expect(formRender.calls.length).toBe(3)

      // input is back, but without value
      expect(inputRender.calls.length).toBe(3)
      expect(inputRender.calls[ 2 ].arguments[ 0 ].input.value).toBe('')
    })

    it('should not destroy on unmount if told not to', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        destroyOnUnmount: false
      })(Form)

      class Container extends Component {
        constructor(props) {
          super(props)
          this.state = { showForm: true }
        }

        render() {
          const { showForm } = this.state
          return (
            <div>
              <Provider store={store}>
                <div>
                  {showForm && <Decorated {...this.state}/>}
                </div>
              </Provider>
              <button onClick={() => this.setState({ showForm: !showForm })}>Toggle</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(<Container/>)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ]
          }
        }
      }, 'Form data in Redux did not get destroyed')
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      expect(inputRender.calls[ 0 ].arguments[ 0 ].input.value).toBe('')

      // change field
      inputRender.calls[ 0 ].arguments[ 0 ].input.onChange('bob')

      // form rerenders because now dirty
      expect(formRender.calls.length).toBe(2)

      // input now has value
      expect(inputRender.calls.length).toBe(2)
      expect(inputRender.calls[ 1 ].arguments[ 0 ].input.value).toBe('bob')

      // check state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bob'
              }
            },
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ]
          }
        }
      })

      // unmount form
      const toggle = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(toggle)


      // check state not destroyed
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bob'
              }
            }
          }
        }
      })

      // form still not rendered again
      expect(formRender.calls.length).toBe(2)

      // toggle form back into existence
      TestUtils.Simulate.click(toggle)

      // form is back
      expect(formRender.calls.length).toBe(3)

      // input is back, with its old value
      expect(inputRender.calls.length).toBe(3)
      expect(inputRender.calls[ 2 ].arguments[ 0 ].input.value).toBe('bob')
    })

    it('should keep a list of registered fields', () => {
      const store = makeStore({})
      const noopRender = () => <div/>

      class Form extends Component {
        constructor() {
          super()
          this.state = { showBar: false }
        }

        render() {
          const { showBar } = this.state
          return (
            <form>
              {!showBar && <Field name="foo" component="input" type="text"/>}
              {!showBar && <FieldArray name="fooArray" component={noopRender} type="text"/>}
              {showBar && <Field name="bar" component="input" type="text"/>}
              {showBar && <FieldArray name="barArray" component={noopRender} type="text"/>}
              <button onClick={() => this.setState({ showBar: true })}>Show Bar</button>
            </form>
          )
        }
      }
      const Decorated = reduxForm({ form: 'testForm' })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)
      expect(stub.fieldList).toEqual(fromJS([ 'foo', 'fooArray' ]))

      // switch fields
      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(stub.fieldList).toEqual(fromJS([ 'bar', 'barArray' ]))
    })

    it('should provide valid/invalid/values/dirty/pristine getters', () => {
      const store = makeStore({})
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()

      const Form = () => (
        <form>
          <Field name="bar" component={input} type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        validate: values => getIn(values, 'bar') ? {} : { bar: 'Required' }
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      // invalid because no value for 'bar' field
      expect(stub.dirty).toBe(false)
      expect(stub.pristine).toBe(true)
      expect(stub.valid).toBe(false)
      expect(stub.invalid).toBe(true)
      expect(stub.values).toEqualMap({})

      // set value for 'bar' field
      input.calls[ 0 ].arguments[ 0 ].input.onChange('foo')

      // valid because we have a value for 'bar' field
      expect(stub.dirty).toBe(true)
      expect(stub.pristine).toBe(false)
      expect(stub.valid).toBe(true)
      expect(stub.invalid).toBe(false)
      expect(stub.values).toEqualMap({ bar: 'foo' })
    })

    it('should mark all fields as touched on submit', () => {
      const store = makeStore({
        testForm: {}
      })
      const username = createSpy(props => <input {...props.input} type="text"/>).andCallThrough()
      const password = createSpy(props => <input {...props.input}
        type="password"/>).andCallThrough()

      const Form = () => (
        <form>
          <Field name="username" component={username} type="text"/>
          <Field name="password" component={password} type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit: () => ({ _error: 'Login Failed' })
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              { name: 'username', type: 'Field' },
              { name: 'password', type: 'Field' }
            ]
          }
        }
      })

      expect(username).toHaveBeenCalled()
      expect(username.calls[ 0 ].arguments[ 0 ].meta.touched).toBe(false)

      expect(password).toHaveBeenCalled()
      expect(password.calls[ 0 ].arguments[ 0 ].meta.touched).toBe(false)

      expect(stub.submit).toBeA('function')
      stub.submit()

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              { name: 'username', type: 'Field' },
              { name: 'password', type: 'Field' }
            ],
            anyTouched: true,
            fields: {
              username: {
                touched: true
              },
              password: {
                touched: true
              }
            },
            submitSucceeded: true
          }
        }
      })

      expect(username.calls.length).toBe(2)
      expect(username.calls[ 1 ].arguments[ 0 ].meta.touched).toBe(true)

      expect(password.calls.length).toBe(2)
      expect(password.calls[ 1 ].arguments[ 0 ].meta.touched).toBe(true)
    })

    it('should call onSubmitFail with errors if sync submit fails by throwing SubmissionError', () => {
      const store = makeStore({
        testForm: {}
      })
      const errors = { username: 'Required' }
      const onSubmitFail = createSpy()

      const Form = () => (
        <form>
          <Field name="username" component="input" type="text"/>
          <Field name="password" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit: () => {
          throw new SubmissionError(errors)
        },
        onSubmitFail
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(stub.submit).toBeA('function')

      expect(onSubmitFail).toNotHaveBeenCalled()

      const caught = stub.submit()

      expect(onSubmitFail)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(errors, store.dispatch)
      expect(caught).toBe(errors)
    })

    it('should call onSubmitFail with undefined if sync submit fails by throwing other error', () => {
      const store = makeStore({
        testForm: {}
      })
      const onSubmitFail = createSpy()

      const Form = () => (
        <form>
          <Field name="username" component="input" type="text"/>
          <Field name="password" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit: () => {
          throw new Error('Some other error')
        },
        onSubmitFail
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(stub.submit).toBeA('function')

      expect(onSubmitFail).toNotHaveBeenCalled()

      const caught = stub.submit()

      expect(onSubmitFail)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(undefined, store.dispatch)
      expect(caught).toNotExist()
    })

    it('should call onSubmitFail if async submit fails', () => {
      const store = makeStore({
        testForm: {}
      })
      const errors = { username: 'Required' }
      const onSubmitFail = createSpy()

      const Form = () => (
        <form>
          <Field name="username" component="input" type="text"/>
          <Field name="password" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit: () => Promise.reject(new SubmissionError(errors)),
        onSubmitFail
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(stub.submit).toBeA('function')

      expect(onSubmitFail).toNotHaveBeenCalled()

      return stub.submit()
        .then(caught => {
          expect(onSubmitFail)
            .toHaveBeenCalled()
            .toHaveBeenCalledWith(errors, store.dispatch)
          expect(caught).toBe(errors)
        })
    })

    it('should call onSubmitFail if sync validation prevents submit', () => {
      const store = makeStore({
        testForm: {}
      })
      const errors = { username: 'Required' }
      const onSubmit = createSpy()
      const onSubmitFail = createSpy()

      const Form = () => (
        <form>
          <Field name="username" component="input" type="text"/>
          <Field name="password" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit,
        onSubmitFail,
        validate: () => errors
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(stub.submit).toBeA('function')

      expect(onSubmitFail).toNotHaveBeenCalled()
      expect(onSubmit).toNotHaveBeenCalled()

      const result = stub.submit()
      expect(onSubmit).toNotHaveBeenCalled()
      expect(onSubmitFail)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(errors, store.dispatch)
      expect(result).toEqual(errors)
    })

    it('should call onSubmitFail if async validation prevents submit', () => {
      const store = makeStore({
        testForm: {}
      })
      const errors = { username: 'Required' }
      const onSubmit = createSpy()
      const onSubmitFail = createSpy()

      const Form = () => (
        <form>
          <Field name="username" component="input" type="text"/>
          <Field name="password" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: () => Promise.reject(errors),
        onSubmit,
        onSubmitFail
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(stub.submit).toBeA('function')

      expect(onSubmit).toNotHaveBeenCalled()
      expect(onSubmitFail).toNotHaveBeenCalled()

      return stub.submit()
        .catch(error => {
          expect(onSubmit).toNotHaveBeenCalled()
          expect(onSubmitFail)
            .toHaveBeenCalled()
            .toHaveBeenCalledWith(errors, store.dispatch)
          expect(error).toBe(errors)
        })
    })

    it('should call onSubmitSuccess if sync submit succeeds', () => {
      const store = makeStore({
        testForm: {}
      })
      const result = { message: 'Good job!' }
      const onSubmitSuccess = createSpy()

      const Form = () => (
        <form>
          <Field name="username" component="input" type="text"/>
          <Field name="password" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit: () => result,
        onSubmitSuccess
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(stub.submit).toBeA('function')

      expect(onSubmitSuccess).toNotHaveBeenCalled()

      const returned = stub.submit()

      expect(onSubmitSuccess)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(result, store.dispatch)
      expect(returned).toBe(result)
    })

    it('should call onSubmitSuccess if async submit succeeds', () => {
      const store = makeStore({
        testForm: {}
      })
      const result = { message: 'Good job!' }
      const onSubmitSuccess = createSpy()

      const Form = () => (
        <form>
          <Field name="username" component="input" type="text"/>
          <Field name="password" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit: () => Promise.resolve(result),
        onSubmitSuccess
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(stub.submit).toBeA('function')

      expect(onSubmitSuccess).toNotHaveBeenCalled()

      return stub.submit()
        .then(returned => {
          expect(onSubmitSuccess)
            .toHaveBeenCalled()
            .toHaveBeenCalledWith(result, store.dispatch)
          expect(returned).toBe(result)
        })
    })

    it('should return error thrown by sync onSubmit', () => {
      const store = makeStore({
        testForm: {}
      })
      const errors = { username: 'Required' }

      const Form = () => (
        <form>
          <Field name="username" component="input" type="text"/>
          <Field name="password" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit: () => {
          throw new SubmissionError(errors)
        }
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(stub.submit).toBeA('function')

      const caught = stub.submit()

      expect(caught).toBe(errors)
    })

    it('should submit when submit() called and onSubmit provided as config param', () => {
      const store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()

      const Form = () => (
        <form>
          <Field name="bar" component={input} type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit: values => {
          expect(values).toEqualMap({ bar: 'foo' })
        }
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(input).toHaveBeenCalled()
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('foo')

      expect(stub.submit).toBeA('function')
      stub.submit()
    })

    it('should submit when "submit" button is clicked and handleSubmit provided function', () => {
      const store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      })
      const submit = createSpy()

      const Form = ({ handleSubmit }) =>
        (
          <form onSubmit={handleSubmit(submit)}>
            <Field name="bar" component="textarea"/>
            <input type="submit" value="Submit"/>
          </form>
        )

      const Decorated = reduxForm({
        form: 'testForm'
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')

      expect(submit).toNotHaveBeenCalled()

      TestUtils.Simulate.submit(form)

      expect(submit).toHaveBeenCalled()
    })

    it('should be fine if form is not yet in Redux store', () => {
      const store = makeStore({
        anotherForm: {
          values: {
            bar: 'foo'
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()

      const Form = () =>
        (
          <form>
            <Field name="foo" component={input} type="text"/>
          </form>
        )

      const Decorated = reduxForm({
        form: 'testForm'
      })(Form)

      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      expect(input).toHaveBeenCalled()
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('')
    })

    it('should be fine if getFormState returns nothing', () => {
      const store = makeStore({})
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()

      const Form = () =>
        (
          <form>
            <Field name="foo" component={input} type="text"/>
          </form>
        )

      const Decorated = reduxForm({
        form: 'testForm',
        getFormState: () => undefined
      })(Form)

      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      expect(input).toHaveBeenCalled()
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('')
    })

    it('should throw an error when no onSubmit is specified', () => {
      const store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      })

      const Form = () => (
        <form>
          <Field name="bar" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm'
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)
      expect(() => stub.submit())
        .toThrow(/onSubmit function or pass onSubmit as a prop/)
    })

    it('should submit (with async validation) when submit() called', () => {
      const store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const asyncValidate = createSpy(() => Promise.resolve()).andCallThrough()

      const Form = () => (
        <form>
          <Field name="bar" component={input} type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        asyncValidate,
        onSubmit: values => {
          expect(values).toEqualMap({ bar: 'foo' })
        }
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(input).toHaveBeenCalled()
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('foo')

      expect(asyncValidate).toNotHaveBeenCalled()

      expect(stub.submit).toBeA('function')
      stub.submit()

      expect(asyncValidate).toHaveBeenCalled()
      expect(asyncValidate.calls[ 0 ].arguments[ 0 ]).toEqualMap({ bar: 'foo' })
    })

    it('should not call async validation more than once if submit is clicked fast when handleSubmit receives an event', () => {
      const store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const asyncValidate = createSpy(() =>
        new Promise(resolve => setTimeout(resolve, 100))).andCallThrough()
      const onSubmit = values => {
        expect(values).toEqualMap({ bar: 'foo' })
      }

      const Form = ({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field name="bar" component={input} type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        asyncValidate,
        onSubmit
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')

      expect(input).toHaveBeenCalled()
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('foo')

      expect(asyncValidate).toNotHaveBeenCalled()

      TestUtils.Simulate.submit(form)
      TestUtils.Simulate.submit(form)
      TestUtils.Simulate.submit(form)
      TestUtils.Simulate.submit(form)
      TestUtils.Simulate.submit(form)

      expect(asyncValidate).toHaveBeenCalled()
      expect(asyncValidate.calls.length).toBe(1)
      expect(asyncValidate.calls[ 0 ].arguments[ 0 ]).toEqualMap({ bar: 'foo' })
    })

    it('should return rejected promise when submit is rejected', () => {
      const store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      })

      const Form = () => (
        <form>
          <Field name="bar" component="input" type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        onSubmit: () => Promise.reject(new SubmissionError('Rejection'))
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)
      return stub.submit()
        .then(err => {
          expect(err).toBe('Rejection')
        })
    })

    it('should not call async validation more than once if submit is clicked fast when handleSubmit receives a function', () => {
      const store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const asyncValidate = createSpy(() =>
        new Promise(resolve => setTimeout(resolve, 100))).andCallThrough()
      const onSubmit = values => {
        expect(values).toEqualMap({ bar: 'foo' })
      }

      const Form = ({ handleSubmit }) => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field name="bar" component={input} type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        asyncValidate
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')

      expect(input).toHaveBeenCalled()
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('foo')

      expect(asyncValidate).toNotHaveBeenCalled()

      TestUtils.Simulate.submit(form)
      TestUtils.Simulate.submit(form)
      TestUtils.Simulate.submit(form)
      TestUtils.Simulate.submit(form)
      TestUtils.Simulate.submit(form)

      expect(asyncValidate).toHaveBeenCalled()
      expect(asyncValidate.calls.length).toBe(1)
      expect(asyncValidate.calls[ 0 ].arguments[ 0 ]).toEqualMap({ bar: 'foo' })
    })

    it('should reset when reset() called', () => {
      const store = makeStore({})
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()

      const Form = () => (
        <form>
          <Field name="bar" component={input} type="text"/>
        </form>
      )

      const Decorated = reduxForm({
        form: 'testForm',
        initialValues: { bar: 'initialBar' }
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(input).toHaveBeenCalled()

      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('initialBar')

      input.calls[ 0 ].arguments[ 0 ].input.onChange('newBar')

      expect(input.calls[ 1 ].arguments[ 0 ].input.value).toBe('newBar')

      expect(stub.reset).toBeA('function')
      stub.reset()

      expect(input.calls[ 2 ].arguments[ 0 ].input.value).toBe('initialBar')
    })

    it('should rerender form, but not fields, when non-redux-form props change', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({ form: 'testForm' })(Form)

      class Container extends Component {
        constructor(props) {
          super(props)
          this.state = {}
        }

        render() {
          return (
            <div>
              <Provider store={store}>
                <Decorated {...this.state}/>
              </Provider>
              <button onClick={() => this.setState({ someOtherProp: 42 })}>Init</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(<Container/>)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ]
          }
        }
      })
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)
      expect(formRender.calls[ 0 ].arguments[ 0 ].someOtherProp).toNotExist()

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)

      // initialize
      const initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(initButton)

      // rerender form on prop change
      expect(formRender.calls.length).toBe(2)
      expect(formRender.calls[ 1 ].arguments[ 0 ].someOtherProp)
        .toExist()
        .toBe(42)

      // no need to rerender input
      expect(inputRender.calls.length).toBe(1)
    })

    it('should provide error prop from sync validation', () => {
      const store = makeStore({})
      const formRender = createSpy()

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="foo" component="input" type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        validate: () => ({ _error: 'form wide sync error' })
      })(Form)

      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(2)
      expect(formRender.calls[ 1 ].arguments[ 0 ].error).toBe('form wide sync error')
    })

    it('should properly remove error prop from sync validation', () => {
      const store = makeStore({})
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="foo" component={input} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        validate: values => getIn(values, 'foo') ? {} : { _error: 'form wide sync error' }
      })(Form)

      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(2)
      expect(formRender.calls[ 1 ].arguments[ 0 ].error).toBe('form wide sync error')
      expect(formRender.calls[ 1 ].arguments[ 0 ].valid).toBe(false)
      expect(formRender.calls[ 1 ].arguments[ 0 ].invalid).toBe(true)

      input.calls[0].arguments[0].input.onChange('bar')

      expect(formRender.calls.length).toBe(4)
      expect(formRender.calls[ 3 ].arguments[ 0 ].error).toNotExist()
      expect(formRender.calls[ 3 ].arguments[ 0 ].valid).toBe(true)
      expect(formRender.calls[ 3 ].arguments[ 0 ].invalid).toBe(false)
    })

    it('should allow for sync errors to be objects', () => {
      const store = makeStore({})
      const formRender = createSpy()
      const renderInput = createSpy(props => <input {...props.input}/>).andCallThrough()
      const error = {
        complex: 'object',
        manyKeys: true
      }

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="foo" component={renderInput} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        validate: () => ({ foo: error })
      })(Form)

      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(2)
      expect(formRender.calls[ 1 ].arguments[ 0 ].valid).toBe(false)
      expect(formRender.calls[ 1 ].arguments[ 0 ].invalid).toBe(true)

      expect(renderInput).toHaveBeenCalled()
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[ 0 ].arguments[ 0 ].meta.error).toEqual(error)
    })

    it('should call async on blur of async blur field', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const formRender = createSpy()
      const asyncErrors = {
        deep: {
          foo: 'async error'
        }
      }
      const asyncValidate = createSpy().andReturn(Promise.reject(asyncErrors))

      class Form extends Component {
        render() {
          formRender(this.props)
          return (
            <form>
              <Field name="deep.foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        asyncValidate,
        asyncBlurFields: [ 'deep.foo' ]
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ]
          }
        }
      })
      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      expect(asyncValidate).toNotHaveBeenCalled()

      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      expect(inputRender.calls[ 0 ].arguments[ 0 ].meta.pristine).toBe(true)
      expect(inputRender.calls[ 0 ].arguments[ 0 ].input.value).toBe('')
      expect(inputRender.calls[ 0 ].arguments[ 0 ].meta.valid).toBe(true)
      expect(inputRender.calls[ 0 ].arguments[ 0 ].meta.error).toBe(undefined)

      const inputElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
      TestUtils.Simulate.change(inputElement, { target: { value: 'bar' } })

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bar'
              }
            },
            registeredFields: [ { name: 'deep.foo', type: 'Field' } ]
          }
        }
      })
      expect(formRender.calls.length).toBe(2) // rerendered because pristine -> dirty

      expect(asyncValidate).toNotHaveBeenCalled() // not yet

      expect(inputRender.calls.length).toBe(2)  // input rerendered
      expect(inputRender.calls[ 1 ].arguments[ 0 ].meta.pristine).toBe(false)
      expect(inputRender.calls[ 1 ].arguments[ 0 ].input.value).toBe('bar')
      expect(inputRender.calls[ 1 ].arguments[ 0 ].meta.valid).toBe(true)
      expect(inputRender.calls[ 1 ].arguments[ 0 ].meta.error).toBe(undefined)

      TestUtils.Simulate.blur(inputElement, { target: { value: 'bar' } })

      setTimeout(() => {
        expect(store.getState()).toEqualMap({
          form: {
            testForm: {
              anyTouched: true,
              values: {
                deep: {
                  foo: 'bar'
                }
              },
              fields: {
                deep: {
                  foo: {
                    touched: true
                  }
                }
              },
              registeredFields: [ { name: 'deep.foo', type: 'Field' } ],
              asyncErrors
            }
          }
        })
        // rerender form twice because of async validation start and again for valid -> invalid
        expect(formRender.calls.length).toBe(4)

        expect(asyncValidate).toHaveBeenCalled()
        expect(asyncValidate.calls[ 0 ].arguments[ 0 ]).toEqualMap({ deep: { foo: 'bar' } })

        // input rerendered twice, at start and end of async validation
        expect(inputRender.calls.length).toBe(4)
        expect(inputRender.calls[ 3 ].arguments[ 0 ].meta.pristine).toBe(false)
        expect(inputRender.calls[ 3 ].arguments[ 0 ].input.value).toBe('bar')
        expect(inputRender.calls[ 3 ].arguments[ 0 ].meta.valid).toBe(false)
        expect(inputRender.calls[ 3 ].arguments[ 0 ].meta.error).toBe('async error')
      })
    })

    it('should not call async validate if shouldAsyncValidate returns false', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const asyncValidate = createSpy().andReturn(Promise.reject({ foo: 'bad user!' }))
      const shouldAsyncValidate = createSpy().andReturn(false)

      const Form = () =>
        (
          <form>
            <Field name="foo" component={inputRender} type="text"/>
          </form>
        )

      const Decorated = reduxForm({
        form: 'testForm',
        asyncValidate,
        asyncBlurFields: [ 'foo' ],
        shouldAsyncValidate
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [ { name: 'foo', type: 'Field' } ]
          }
        }
      })

      expect(asyncValidate).toNotHaveBeenCalled()

      const inputElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
      TestUtils.Simulate.change(inputElement, { target: { value: 'bar' } })

      expect(shouldAsyncValidate).toNotHaveBeenCalled()

      TestUtils.Simulate.blur(inputElement, { target: { value: 'bar' } })

      expect(shouldAsyncValidate).toHaveBeenCalled()

      expect(asyncValidate).toNotHaveBeenCalled()
    })

    it('should expose wrapped instance', () => {
      const store = makeStore({})

      class Form extends Component {
        render() {
          return (
            <form>
              <Field name="foo" component="input" type="text"/>
            </form>
          )
        }
      }

      const Decorated = reduxForm({
        form: 'testForm'
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const wrapped = TestUtils.findRenderedComponentWithType(dom, Form)
      const decorated = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(decorated.wrappedInstance.props).toEqual(wrapped.props)
    })

    it('should return an empty list if there are no registered fields', () => {
      const store = makeStore({})

      class Form extends Component {
        render() {
          return (
            <form>
            </form>
          )
        }
      }

      const Decorated = reduxForm({
        form: 'testForm'
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      )

      const decorated = TestUtils.findRenderedComponentWithType(dom, Decorated)

      expect(decorated.refs.wrapped.getWrappedInstance().getFieldList()).toEqual([])
    })

    it('should set autofilled and unset it on change', () => {
      const store = makeStore({})

      const renderInput = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderForm = createSpy()
      const onSubmit = createSpy()
      class Form extends Component {
        render() {
          renderForm(this.props)
          return (
            <form onSubmit={this.props.handleSubmit}>
              <Field name="myField" component={renderInput}/>
            </form>
          )
        }
      }

      const Decorated = reduxForm({
        form: 'testForm'
      })(Form)

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated onSubmit={onSubmit}/>
        </Provider>
      )

      expect(renderForm).toHaveBeenCalled()
      expect(renderForm.calls.length).toBe(1)
      expect(renderForm.calls[0].arguments[0].autofill).toBeA('function')

      // check field
      expect(renderInput).toHaveBeenCalled()
      expect(renderInput.calls.length).toBe(1)
      expect(renderInput.calls[0].arguments[0].input.value).toBe('')
      expect(renderInput.calls[0].arguments[0].meta.autofilled).toBe(false)

      const form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')

      // test submit
      expect(onSubmit).toNotHaveBeenCalled()
      TestUtils.Simulate.submit(form)
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit.calls.length).toBe(1)
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({})
      expect(renderInput.calls.length).toBe(2)  // touched by submit

      // autofill field
      renderForm.calls[0].arguments[0].autofill('myField', 'autofilled value')

      // check field
      expect(renderInput).toHaveBeenCalled()
      expect(renderInput.calls.length).toBe(3)
      expect(renderInput.calls[2].arguments[0].input.value).toBe('autofilled value')
      expect(renderInput.calls[2].arguments[0].meta.autofilled).toBe(true)

      // test submitting autofilled value
      TestUtils.Simulate.submit(form)
      expect(onSubmit.calls.length).toBe(2)
      expect(onSubmit.calls[1].arguments[0]).toEqualMap({ myField: 'autofilled value' })

      // user edits field
      renderInput.calls[1].arguments[0].input.onChange('user value')

      // check field
      expect(renderInput).toHaveBeenCalled()
      expect(renderInput.calls.length).toBe(4)
      expect(renderInput.calls[3].arguments[0].input.value).toBe('user value')
      expect(renderInput.calls[3].arguments[0].meta.autofilled).toBe(false)

      // why not test submitting again?
      TestUtils.Simulate.submit(form)
      expect(onSubmit.calls.length).toBe(3)
      expect(onSubmit.calls[2].arguments[0]).toEqualMap({ myField: 'user value' })
    })

    it('should not reinitialize values on remount if destroyOnMount is false', () => {
      const store = makeStore({})
      const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
      const initialValues = {
        foo: 'fooInitial'
      }
      class Form extends Component {
        render() {
          return (
            <form>
              <Field name="foo" component={inputRender} type="text"/>
            </form>
          )
        }
      }
      const Decorated = reduxForm({
        form: 'testForm',
        destroyOnUnmount: false
      })(Form)
      class Container extends Component {
        constructor() {
          super()
          this.state = { showForm: true }
        }

        render() {
          const { showForm } = this.state
          return (
            <div>
              {showForm && <Decorated initialValues={initialValues}/>}
              <button onClick={() => this.setState({ showForm: !showForm })}>Toggle Form</button>
            </div>
          )
        }
      }

      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Container/>
        </Provider>
      )

      // initialized form state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: { foo: 'fooInitial' },
            values: { foo: 'fooInitial' },
            registeredFields: [ { name: 'foo', type: 'Field' } ]
          }
        }
      })

      // rendered with initial value
      expect(inputRender).toHaveBeenCalled()
      expect(inputRender.calls.length).toBe(1)
      expect(inputRender.calls[ 0 ].arguments[ 0 ].input.value).toBe('fooInitial')

      // change value
      inputRender.calls[ 0 ].arguments[ 0 ].input.onChange('fooChanged')

      // updated form state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: { foo: 'fooInitial' },
            values: { foo: 'fooChanged' },
            registeredFields: [ { name: 'foo', type: 'Field' } ]
          }
        }
      })

      // rendered with changed value
      expect(inputRender.calls.length).toBe(2)
      expect(inputRender.calls[ 1 ].arguments[ 0 ].input.value).toBe('fooChanged')

      // unmount form
      const toggle = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(toggle)

      // form state not destroyed (just fields unregistered)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: { foo: 'fooInitial' },
            values: { foo: 'fooChanged' }
          }
        }
      })

      // mount form
      TestUtils.Simulate.click(toggle)

      // form state not overwritten (fields re-registered)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: { foo: 'fooInitial' },
            values: { foo: 'fooChanged' },
            registeredFields: [ { name: 'foo', type: 'Field' } ]
          }
        }
      })

      // input rendered with changed value
      expect(inputRender.calls.length).toBe(3)
      expect(inputRender.calls[ 2 ].arguments[ 0 ].input.value).toBe('fooChanged')
    })
  })
}

describeReduxForm('reduxForm.plain', plain, plainCombineReducers, addExpectations(plainExpectations))
describeReduxForm('reduxForm.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations))
