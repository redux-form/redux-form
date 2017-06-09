/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { createSpy } from 'expect'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-dom/test-utils'
import createReduxForm from '../createReduxForm'
import createReducer from '../createReducer'
import createField from '../createField'
import Form from '../Form'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'
import SubmissionError from '../SubmissionError'
import {
  change,
  clearSubmit,
  setSubmitFailed,
  setSubmitSucceeded,
  submit,
  touch,
  updateSyncErrors
} from '../actions'

const propsAtNthRender = (componentSpy, callNumber) =>
  componentSpy.calls[callNumber].arguments[0]

const describeForm = (name, structure, combineReducers, expect) => {
  const reduxForm = createReduxForm(structure)
  const Field = createField(structure)
  const reducer = createReducer(structure)
  const { fromJS, getIn } = structure
  const makeStore = (initial = {}, logger) => {
    const reducers = { form: reducer }
    if (logger) {
      reducers.logger = logger
    }
    return createStore(combineReducers(reducers), fromJS({ form: initial }))
  }

  describe(name, () => {
    it('should throw an error if not in ReduxForm', () => {
      expect(() => {
        TestUtils.renderIntoDocument(
          <div>
            <Form onSubmit={() => {}} />
          </div>
        )
      }).toThrow(/must be inside a component decorated with reduxForm/)
    })

    it('should output a <form> element with all props mapped', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 42
          }
        }
      })
      const onSubmit = createSpy()
      class TestForm extends Component {
        render() {
          return (
            <Form
              onSubmit={onSubmit}
              action="/save"
              method="post"
              target="_blank"
            >
              <Field name="foo" component="input" />
            </Form>
          )
        }
      }
      const DecoratedTestForm = reduxForm({ form: 'testForm' })(TestForm)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <DecoratedTestForm />
        </Provider>
      )

      expect(onSubmit).toNotHaveBeenCalled()

      const tag = TestUtils.findRenderedDOMComponentWithTag(dom, 'form')

      // 🤢 This line is DISGUSTING!! Is there a better way to get the props on the <form> ??
      const props = tag[Object.keys(tag)[0]]._currentElement.props

      expect(props.onSubmit).toBe(onSubmit)
      expect(props.action).toBe('/save')
      expect(props.method).toBe('post')
      expect(props.target).toBe('_blank')
    })

    it('should call the onSubmit given to <Form> when instance API submit() is called', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 42
          }
        }
      })
      const onSubmit = createSpy().andReturn(7)
      class TestForm extends Component {
        render() {
          return (
            <Form onSubmit={this.props.handleSubmit(onSubmit)}>
              <Field name="foo" component="input" />
            </Form>
          )
        }
      }
      const DecoratedTestForm = reduxForm({ form: 'testForm' })(TestForm)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <DecoratedTestForm />
        </Provider>
      )

      const decoratedForm = TestUtils.findRenderedComponentWithType(
        dom,
        DecoratedTestForm
      )

      expect(onSubmit).toNotHaveBeenCalled()

      const result = decoratedForm.submit()
      expect(result).toBe(7)

      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit.calls.length).toBe(1)
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({ foo: 42 })
      expect(onSubmit.calls[0].arguments[1]).toBeA('function')
      expect(onSubmit.calls[0].arguments[2].values).toEqualMap({ foo: 42 })
    })

    it('should call the onSubmit given to <Form> when SUBMIT action is dispatched', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 42
          }
        }
      })
      const onSubmit = createSpy()
      class TestForm extends Component {
        render() {
          return (
            <Form onSubmit={this.props.handleSubmit(onSubmit)}>
              <Field name="foo" component="input" />
            </Form>
          )
        }
      }
      const DecoratedTestForm = reduxForm({ form: 'testForm' })(TestForm)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <DecoratedTestForm />
        </Provider>
      )

      expect(onSubmit).toNotHaveBeenCalled()

      store.dispatch(submit('testForm'))

      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit.calls.length).toBe(1)
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({ foo: 42 })
      expect(onSubmit.calls[0].arguments[1]).toBeA('function')
      expect(onSubmit.calls[0].arguments[2].values).toEqualMap({ foo: 42 })
    })

    it('should properly handle submission errors', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 42
          }
        }
      })
      const onSubmit = createSpy().andThrow(
        new SubmissionError({ _error: 'Invalid' })
      )
      const formRender = createSpy()
      class TestForm extends Component {
        render() {
          formRender(this.props)
          return (
            <Form onSubmit={this.props.handleSubmit(onSubmit)}>
              <Field name="foo" component="input" />
            </Form>
          )
        }
      }
      const DecoratedTestForm = reduxForm({ form: 'testForm' })(TestForm)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <DecoratedTestForm />
        </Provider>
      )

      expect(formRender).toHaveBeenCalled()
      expect(formRender.calls.length).toBe(1)

      const decoratedForm = TestUtils.findRenderedComponentWithType(
        dom,
        DecoratedTestForm
      )

      expect(onSubmit).toNotHaveBeenCalled()

      decoratedForm.submit()

      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit.calls.length).toBe(1)
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({ foo: 42 })
      expect(onSubmit.calls[0].arguments[1]).toBeA('function')
      expect(onSubmit.calls[0].arguments[2].values).toEqualMap({ foo: 42 })

      expect(formRender.calls.length).toBe(3)
      expect(formRender.calls[2].arguments[0].error).toBe('Invalid')
    })

    it('should NOT submit a form with sync validation errors', () => {
      const logger = createSpy((state = {}) => state).andCallThrough()
      const store = makeStore({}, logger)
      const inputRender = createSpy(props =>
        <input {...props.input} />
      ).andCallThrough()
      const onSubmit = createSpy()
      const formRender = createSpy()
      const validate = values => {
        const errors = {}
        if (!getIn(values, 'foo')) {
          errors.foo = 'Required'
        }
        return errors
      }
      class TestForm extends Component {
        render() {
          formRender(this.props)
          return (
            <Form onSubmit={this.props.handleSubmit(onSubmit)}>
              <Field name="foo" component={inputRender} />
            </Form>
          )
        }
      }
      const DecoratedTestForm = reduxForm({
        form: 'testForm',
        validate
      })(TestForm)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <DecoratedTestForm />
        </Provider>
      )

      let callIndex = logger.calls.length

      // form renders before sync validation and then again with invalid flag
      expect(formRender.calls.length).toBe(2)
      expect(propsAtNthRender(formRender, 0).invalid).toBe(false)
      expect(propsAtNthRender(formRender, 1).invalid).toBe(true)
      expect(propsAtNthRender(formRender, 1).submitFailed).toBe(false)

      // try to submit invalid form via dispatching submit action
      store.dispatch(submit('testForm'))

      // check that submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(submit('testForm'))

      // check that clear submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(
        clearSubmit('testForm')
      )

      // check that touch action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(
        touch('testForm', 'foo')
      )

      // check that setSubmitFailed action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(
        setSubmitFailed('testForm', 'foo')
      )

      // form rerendered twice, once with submit trigger, and then after submit failure
      expect(formRender.calls.length).toBe(4)
      expect(propsAtNthRender(formRender, 3).invalid).toBe(true)
      expect(propsAtNthRender(formRender, 3).submitFailed).toBe(true)

      // update input
      inputRender.calls[0].arguments[0].input.onChange('hello')

      // check that change action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(
        change('testForm', 'foo', 'hello', false, false)
      )

      // check that updateSyncErrors action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(
        updateSyncErrors('testForm', {})
      )

      // rerendered once to flip dirty flag, and again to flip invalid flag
      expect(formRender.calls.length).toBe(6)
      expect(propsAtNthRender(formRender, 3).dirty).toBe(false)
      expect(propsAtNthRender(formRender, 4).dirty).toBe(true)
      expect(propsAtNthRender(formRender, 4).invalid).toBe(true)
      expect(propsAtNthRender(formRender, 5).invalid).toBe(false)
      expect(propsAtNthRender(formRender, 5).submitFailed).toBe(true)

      // dispatch submit action on now valid form
      store.dispatch(submit('testForm'))

      // check that submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(submit('testForm'))

      // check that clear submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(
        clearSubmit('testForm')
      )

      // check that touch action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(
        touch('testForm', 'foo')
      )

      // check that submit succeeded action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(
        setSubmitSucceeded('testForm')
      )

      // check no additional actions dispatched
      expect(logger.calls.length).toBe(callIndex)

      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit.calls.length).toBe(1)
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({ foo: 'hello' })
      expect(onSubmit.calls[0].arguments[1]).toBeA('function')
      expect(onSubmit.calls[0].arguments[2].values).toEqualMap({ foo: 'hello' })
    })
  })
}

describeForm(
  'Form.plain',
  plain,
  plainCombineReducers,
  addExpectations(plainExpectations)
)
describeForm(
  'Form.immutable',
  immutable,
  immutableCombineReducers,
  addExpectations(immutableExpectations)
)
