/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-dom/test-utils'
import createReduxForm from '../createReduxForm'
import createReducer from '../createReducer'
import createField from '../createField'
import createFields from '../createFields'
import createFieldArray from '../createFieldArray'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/__tests__/expectations'

const describeFormSection = (name, structure, combineReducers, setup) => {
  const reduxForm = createReduxForm(structure)
  const Field = createField(structure)
  const Fields = createFields(structure)
  const FieldArray = createFieldArray(structure)
  const reducer = createReducer(structure)
  const { fromJS } = structure
  const makeStore = initial =>
    createStore(combineReducers({ form: reducer }), fromJS({ form: initial }))

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should throw an error if not in ReduxForm', () => {
      expect(() => {
        TestUtils.renderIntoDocument(
          <div>
            <FormSection name="foo" />
          </div>
        )
      }).toThrow(/must be inside a component decorated with reduxForm/)
    })

    it('should not wrap in unnecessary div', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: '42'
            }
          }
        }
      })
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <Field name="bar" component="input" />
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const divTags = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'div')

      expect(divTags.length).toEqual(0)
    })

    it('should pass along unused props to div', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: '42'
            }
          }
        }
      })
      class Form extends Component {
        render() {
          return (
            <FormSection
              name="foo"
              component="section"
              className="form-section"
              style={{ fontWeight: 'bold' }}
            >
              <Field name="bar" component="input" />
              <Field name="baz" component="input" />
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const section = TestUtils.findRenderedDOMComponentWithTag(dom, 'section')

      // 🤢 Is there a better way to get the props on the <section> ??
      const props = section[Object.keys(section)[1]]

      expect(props.name).toBeFalsy()
      expect(props.component).toBeFalsy()
      expect(props.className).toBe('form-section')
      expect(props.style).toBeTruthy()
      expect(props.style.fontWeight).toBe('bold')
    })

    it('should update Field values at the right depth', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: '42'
            }
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <Field name="bar" component={input} />
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

      // input displaying string value
      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].input.value).toBe('42')

      // update value
      input.mock.calls[0][0].input.onChange('15')

      // input displaying updated string value
      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].input.value).toBe('15')

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: '15'
              }
            },
            registeredFields: {
              'foo.bar': { name: 'foo.bar', type: 'Field', count: 1 }
            }
          }
        }
      })
    })

    it('should update Fields values at the right depth', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: '42',
              baz: '100'
            }
          }
        }
      })
      const input = jest.fn(props => <input {...props.bar.input} />)

      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <Fields names={['bar', 'baz']} component={input} />
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

      // input displaying string value
      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].bar.input.value).toBe('42')
      expect(input.mock.calls[0][0].baz.input.value).toBe('100')

      // update value
      input.mock.calls[0][0].bar.input.onChange('15')

      // input displaying updated string value
      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].bar.input.value).toBe('15')

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: '15',
                baz: '100'
              }
            },
            registeredFields: {
              'foo.bar': { name: 'foo.bar', type: 'Field', count: 1 },
              'foo.baz': { name: 'foo.baz', type: 'Field', count: 1 }
            }
          }
        }
      })
    })

    it('should update FieldArray values at the right depth', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: ['dog', 'cat']
            }
          }
        }
      })

      const renderField = jest.fn(props => <input {...props.input} />)
      const renderFieldArray = jest.fn(({ fields }) => (
        <div>
          {fields.map(field => (
            <Field name={field} component={renderField} key={field} />
          ))}
          <button className="add" onClick={() => fields.push('fish')}>
            Add Dog
          </button>
          <button className="remove" onClick={() => fields.pop()}>
            Remove Dog
          </button>
        </div>
      ))

      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <FieldArray name="bar" component={renderFieldArray} />
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      const addButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'add')
      const removeButton = TestUtils.findRenderedDOMComponentWithClass(
        dom,
        'remove'
      )
      TestUtils.Simulate.click(addButton)

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: ['dog', 'cat', 'fish']
              }
            },
            registeredFields: {
              'foo.bar': { name: 'foo.bar', type: 'FieldArray', count: 1 },
              'foo.bar[0]': { name: 'foo.bar[0]', type: 'Field', count: 1 },
              'foo.bar[1]': { name: 'foo.bar[1]', type: 'Field', count: 1 },
              'foo.bar[2]': { name: 'foo.bar[2]', type: 'Field', count: 1 }
            }
          }
        }
      })

      TestUtils.Simulate.click(removeButton)

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: ['dog', 'cat']
              }
            },
            registeredFields: {
              'foo.bar': { name: 'foo.bar', type: 'FieldArray', count: 1 },
              'foo.bar[0]': { name: 'foo.bar[0]', type: 'Field', count: 1 },
              'foo.bar[1]': { name: 'foo.bar[1]', type: 'Field', count: 1 }
            }
          }
        }
      })
    })

    it('should concatenate prefixes when nested', () => {
      const store = makeStore({
        testForm: {
          values: {
            deep: {
              foo: {
                bar: '42'
              }
            }
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)

      class Form extends Component {
        render() {
          return (
            <FormSection name="deep">
              <FormSection name="foo">
                <Field name="bar" component={input} />
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

      // input gets the correct name and value
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].input.value).toBe('42')
      expect(input.mock.calls[0][0].input.name).toBe('deep.foo.bar')
    })
  })
}

describeFormSection('FormSection.plain', plain, plainCombineReducers, () =>
  expect.extend(plainExpectations)
)
describeFormSection(
  'FormSection.immutable',
  immutable,
  immutableCombineReducers,
  () => expect.extend(immutableExpectations)
)
