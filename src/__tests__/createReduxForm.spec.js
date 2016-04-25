/* eslint react/no-multi-comp:0 */
import expect, {createSpy} from 'expect';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from '../reducer';
import createReduxForm from '../createReduxForm';

const createRestorableSpy = (fn) => {
  return createSpy(fn, function restore() {
    this.calls = [];
  });
};

describe('createReduxForm', () => {
  const reduxForm = createReduxForm(false, React, connect);
  const makeStore = () => createStore(combineReducers({
    form: reducer
  }));

  it('should return a decorator function', () => {
    expect(reduxForm).toBeA('function');
  });

  class Form extends Component {
    render() {
      return <div />;
    }
  }

  const expectField = ({field, name, value, initial, valid, dirty, error, touched, visited, readonly}) => {
    expect(field).toBeA('object');
    expect(field.name).toBe(name);
    expect(field.value).toEqual(value === undefined ? '' : value);
    if (readonly) {
      expect(field.onBlur).toNotExist();
      expect(field.onChange).toNotExist();
      expect(field.onDragStart).toNotExist();
      expect(field.onDrop).toNotExist();
      expect(field.onFocus).toNotExist();
      expect(field.onUpdate).toNotExist();
    } else {
      expect(field.onBlur).toBeA('function');
      expect(field.onChange).toBeA('function');
      expect(field.onDragStart).toBeA('function');
      expect(field.onDrop).toBeA('function');
      expect(field.onFocus).toBeA('function');
      expect(field.onUpdate).toBeA('function');
    }
    expect(field.initialValue).toEqual(initial);
    expect(field.valid).toBe(valid);
    expect(field.invalid).toBe(!valid);
    expect(field.dirty).toBe(dirty);
    expect(field.pristine).toBe(!dirty);
    expect(field.error).toEqual(error);
    expect(field.touched).toBe(touched);
    expect(field.visited).toBe(visited);
  };

  it('should render without error', () => {
    const store = makeStore();
    expect(() => {
      const Decorated = reduxForm({
        form: 'testForm',
        fields: [ 'foo', 'bar' ]
      })(Form);
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      );
    }).toNotThrow();
  });

  it('should pass fields as props', () => {
    const store = makeStore();
    const Decorated = reduxForm({
      form: 'testForm',
      fields: [ 'foo', 'bar' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);
    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should initialize field values', () => {
    const store = makeStore();
    const Decorated = reduxForm({
      form: 'testForm',
      fields: [ 'foo', 'bar' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated initialValues={{foo: 'fooValue', bar: 'barValue'}}/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);
    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: 'fooValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: 'barValue',
      initial: 'barValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and touch field on blur', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('fooValue');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: undefined,
      valid: true,
      dirty: true,
      error: undefined,
      touched: true,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and NOT touch field on blur if touchOnBlur is disabled', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      touchOnBlur: false
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('fooValue');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: undefined,
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and NOT touch field on change', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onChange('fooValue');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: undefined,
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set value and touch field on change if touchOnChange is enabled', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      touchOnChange: true
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onChange('fooValue');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: undefined,
      valid: true,
      dirty: true,
      error: undefined,
      touched: true,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set visited field on focus', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.active).toBe(undefined);

    stub.props.fields.foo.onFocus();

    expect(stub.props.active).toBe('foo');

    expect(stub.props.fields).toBeA('object');
    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: true,
      readonly: false
    });
    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set dirty when field changes', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated initialValues={{foo: 'fooValue', bar: 'barValue'}}/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: 'fooValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.foo.onChange('fooValue!');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue!',
      initial: 'fooValue',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should set dirty when and array field changes', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'children[].name' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated initialValues={{children: [{name: 'Tom'}, {name: 'Jerry'}]}}/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);
    expect(stub.props.fields.children).toBeA('array');
    expect(stub.props.fields.children.length).toBe(2);

    expectField({
      field: stub.props.fields.children[ 0 ].name,
      name: 'children[0].name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.children[ 1 ].name,
      name: 'children[1].name',
      value: 'Jerry',
      initial: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.children[ 0 ].name.onChange('Tim');

    expectField({
      field: stub.props.fields.children[ 0 ].name,
      name: 'children[0].name',
      value: 'Tim',
      initial: 'Tom',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.children[ 1 ].name,
      name: 'children[1].name',
      value: 'Jerry',
      initial: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
  });

  it('should trigger sync error on change that invalidates value', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      validate: values => {
        const errors = {};
        if (values.foo && values.foo.length > 8) {
          errors.foo = 'Too long';
        }
        if (!values.bar) {
          errors.bar = 'Required';
        }
        return errors;
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated initialValues={{foo: 'fooValue', bar: 'barValue'}}/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue',
      initial: 'fooValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: 'barValue',
      initial: 'barValue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expect(stub.props.valid).toBe(true);
    expect(stub.props.invalid).toBe(false);
    expect(stub.props.errors).toEqual({});

    stub.props.fields.foo.onChange('fooValue!');

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: 'fooValue!',
      initial: 'fooValue',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.bar.onChange('');

    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: '',
      initial: 'barValue',
      valid: false,
      dirty: true,
      error: 'Required',
      touched: false,
      visited: false,
      readonly: false
    });

    expect(stub.props.valid).toBe(false);
    expect(stub.props.invalid).toBe(true);
    expect(stub.props.errors).toEqual({
      foo: 'Too long',
      bar: 'Required'
    });
  });

  it('should trigger sync error on change that invalidates nested value', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo.bar' ],
      validate: values => {
        const errors = {};
        if (values.foo.bar && values.foo.bar.length > 8) {
          errors.foo = { bar: 'Too long' };
        }
        return errors;
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated initialValues={{foo: {bar: 'fooBar'}}}/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo.bar,
      name: 'foo.bar',
      value: 'fooBar',
      initial: 'fooBar',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expect(stub.props.valid).toBe(true);
    expect(stub.props.invalid).toBe(false);
    expect(stub.props.errors).toEqual({});

    stub.props.fields.foo.bar.onChange('fooBarBaz');

    expectField({
      field: stub.props.fields.foo.bar,
      name: 'foo.bar',
      value: 'fooBarBaz',
      initial: 'fooBar',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    expect(stub.props.valid).toBe(false);
    expect(stub.props.invalid).toBe(true);
    expect(stub.props.errors).toEqual({
      foo: {
        bar: 'Too long'
      }
    });
  });

  it('should trigger sync error on change that invalidates array value', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo[]', 'bar[].name' ],
      validate: values => {
        const errors = {};
        if (values.foo && values.foo.length && values.foo[ 0 ] && values.foo[ 0 ].length > 8) {
          errors.foo = [ 'Too long' ];
        }
        if (values.bar && values.bar.length && values.bar[ 0 ] && values.bar[ 0 ].name === 'Ralphie') {
          errors.bar = [ { name: `You'll shoot your eye out, kid!` } ];
        }
        return errors;
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated initialValues={{foo: ['fooBar'], bar: [{name: ''}]}}/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo[ 0 ],
      name: 'foo[0]',
      value: 'fooBar',
      initial: 'fooBar',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    expectField({
      field: stub.props.fields.bar[ 0 ].name,
      name: 'bar[0].name',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expect(stub.props.valid).toBe(true);
    expect(stub.props.invalid).toBe(false);
    expect(stub.props.errors).toEqual({});

    stub.props.fields.foo[ 0 ].onChange('fooBarBaz');

    expectField({
      field: stub.props.fields.foo[ 0 ],
      name: 'foo[0]',
      value: 'fooBarBaz',
      initial: 'fooBar',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.bar[ 0 ].name.onChange('Ralphie');

    expectField({
      field: stub.props.fields.bar[ 0 ].name,
      name: 'bar[0].name',
      value: 'Ralphie',
      initial: '',
      valid: false,
      dirty: true,
      error: `You'll shoot your eye out, kid!`,
      touched: false,
      visited: false,
      readonly: false
    });

    expect(stub.props.valid).toBe(false);
    expect(stub.props.invalid).toBe(true);
    expect(stub.props.errors).toEqual({
      foo: [ 'Too long' ],
      bar: [ { name: `You'll shoot your eye out, kid!` } ]
    });
  });

  it('should call destroy on unmount', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ]
    })(Form);

    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Decorated initialValues={{foo: 'fooValue', bar: 'barValue'}}/>
      </Provider>,
      div
    );
    const before = store.getState();
    expect(before.form).toBeA('object');
    expect(before.form[ form ]).toBeA('object');
    expect(before.form[ form ].foo).toBeA('object');
    expect(before.form[ form ].bar).toBeA('object');

    ReactDOM.unmountComponentAtNode(div);

    const after = store.getState();
    expect(after.form).toBeA('object');
    expect(after.form[ form ]).toNotExist();
  });

  it('should NOT call destroy on unmount if destroyOnUnmount is disabled', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      destroyOnUnmount: false
    })(Form);

    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Decorated initialValues={{foo: 'fooValue', bar: 'barValue'}}/>
      </Provider>,
      div
    );
    const before = store.getState();
    expect(before.form).toBeA('object');
    expect(before.form[ form ]).toBeA('object');
    expect(before.form[ form ].foo).toBeA('object');
    expect(before.form[ form ].bar).toBeA('object');

    ReactDOM.unmountComponentAtNode(div);

    const after = store.getState();
    expect(after.form).toBeA('object');
    expect(after.form[ form ]).toBeA('object');
    expect(after.form[ form ].foo).toBeA('object');
    expect(after.form[ form ].bar).toBeA('object');
  });

  it('should hoist statics', () => {
    class FormWithStatics extends Component {
      render() {
        return <div/>;
      }
    }
    FormWithStatics.someStatic1 = 'cat';
    FormWithStatics.someStatic2 = 42;

    const Decorated = reduxForm({
      form: 'testForm',
      fields: [ 'foo', 'bar' ]
    })(FormWithStatics);

    expect(Decorated.someStatic1).toBe('cat');
    expect(Decorated.someStatic2).toBe(42);
  });

  it('should not provide mutators when readonly', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      readonly: true
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.foo,
      name: 'foo',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: true
    });

    expectField({
      field: stub.props.fields.bar,
      name: 'bar',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: true
    });
  });

  it('should initialize an array field', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'children[].name' ],
      initialValues: {
        children: [ { name: 'Tom' }, { name: 'Jerry' } ]
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.children[ 0 ].name,
      name: 'children[0].name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });

    expectField({
      field: stub.props.fields.children[ 1 ].name,
      name: 'children[1].name',
      value: 'Jerry',
      initial: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should call onSubmit prop', (done) => {
    const submit = (values) => {
      expect(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      done();
    };

    class FormComponent extends Component {
      render() {
        return (
          <form onSubmit={this.props.handleSubmit}/>
        );
      }
    }
    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      readonly: true
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated onSubmit={submit}/>
      </Provider>
    );
    const formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);
  });

  it('should call async onSubmit prop', (done) => {
    const submit = (values) => {
      expect(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 100);
      }).then(done);
    };

    class FormComponent extends Component {
      render() {
        return (
          <form onSubmit={this.props.handleSubmit}/>
        );
      }
    }
    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      readonly: true
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated onSubmit={submit}/>
      </Provider>
    );
    const formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);
  });

  it('should NOT call async validation if form is pristine and initialized', () => {
    const store = makeStore();
    const form = 'testForm';
    const errorValue = { foo: 'no bears allowed' };
    const asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      asyncValidate,
      asyncBlurFields: [ 'foo' ],
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('dog');
    expect(asyncValidate).toNotHaveBeenCalled();
  });

  it('should call async validation if form is dirty and initialized', () => {
    const store = makeStore();
    const form = 'testForm';
    const errorValue = { foo: 'no bears allowed' };
    const asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      asyncValidate,
      asyncBlurFields: [ 'foo' ],
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('bear');
    expect(asyncValidate).toHaveBeenCalled();
  });

  it('should call async validation if form is pristine and NOT initialized', () => {
    const store = makeStore();
    const form = 'testForm';
    const errorValue = { foo: 'no bears allowed' };
    const asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      asyncValidate,
      asyncBlurFields: [ 'foo' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur();
    expect(asyncValidate).toHaveBeenCalled();
  });

  it('should call async validation on submit even if pristine and initialized', () => {
    const submit = createSpy();
    class FormComponent extends Component {
      render() {
        return (
          <form onSubmit={this.props.handleSubmit(submit)}/>
        );
      }
    }
    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    const store = makeStore();
    const form = 'testForm';
    const errorValue = { foo: 'no dogs allowed' };
    const asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      asyncValidate,
      asyncBlurFields: [ 'foo' ],
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);

    expect(asyncValidate).toHaveBeenCalled();
    expect(submit).toNotHaveBeenCalled();
  });

  it('should call async validation if form is pristine and initialized but alwaysAsyncValidate is true', () => {
    const store = makeStore();
    const form = 'testForm';
    const errorValue = { foo: 'no bears allowed' };
    const asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      asyncValidate,
      asyncBlurFields: [ 'foo' ],
      alwaysAsyncValidate: true,
      initialValues: {
        foo: 'dog',
        bar: 'cat'
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    stub.props.fields.foo.onBlur('dog');
    expect(asyncValidate).toHaveBeenCalled();
  });

  it('should call submit function passed to handleSubmit', (done) => {
    const submit = (values) => {
      expect(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      done();
    };

    class FormComponent extends Component {
      render() {
        return (
          <form onSubmit={this.props.handleSubmit(submit)}/>
        );
      }
    }

    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      readonly: true
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated />
      </Provider>
    );
    const formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);
  });

  it('should call submit function passed to async handleSubmit', (done) => {
    const submit = (values) => {
      expect(values).toEqual({
        foo: undefined,
        bar: undefined
      });
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 100);
      }).then(done);
    };

    class FormComponent extends Component {
      render() {
        return (
          <form onSubmit={this.props.handleSubmit(submit)}/>
        );
      }
    }

    FormComponent.propTypes = {
      handleSubmit: PropTypes.func.isRequired
    };

    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'foo', 'bar' ],
      readonly: true
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated />
      </Provider>
    );
    const formElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(formElement);
  });

  it('should initialize a non-array field with an array value and let it read it back', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'children' ],
      initialValues: {
        children: [ 1, 2 ]
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [ 1, 2 ],
      initial: [ 1, 2 ],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should initialize an array field with an array value', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'colors[]' ],
      initialValues: {
        colors: [ 'red', 'blue' ]
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.colors).toBeA('array');
    expect(stub.props.fields.colors.length).toBe(2);
    expectField({
      field: stub.props.fields.colors[ 0 ],
      name: 'colors[0]',
      value: 'red',
      initial: 'red',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.colors[ 1 ],
      name: 'colors[1]',
      value: 'blue',
      initial: 'blue',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should initialize a deep array field with values', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'users[].name', 'users[].age' ],
      initialValues: {
        users: [
          {
            name: 'Bob',
            age: 27
          }
        ]
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.users).toBeA('array');
    expect(stub.props.fields.users.length).toBe(1);
    expect(stub.props.fields.users[ 0 ]).toBeA('object');
    expectField({
      field: stub.props.fields.users[ 0 ].name,
      name: 'users[0].name',
      value: 'Bob',
      initial: 'Bob',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.users[ 0 ].age,
      name: 'users[0].age',
      value: 27,
      initial: 27,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should add array values with defaults', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'users[].name', 'users[].age' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.users).toBeA('array');
    expect(stub.props.fields.users.length).toBe(0);
    expect(stub.props.fields.users.addField).toBeA('function');

    const before = stub.props.fields.users;

    // add field
    stub.props.fields.users.addField({ name: 'Bob', age: 27 });

    // check field
    expect(stub.props.fields.users.length).toBe(1);
    expect(stub.props.fields.users[ 0 ]).toBeA('object');
    expectField({
      field: stub.props.fields.users[ 0 ].name,
      name: 'users[0].name',
      value: 'Bob',
      initial: 'Bob',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.users[ 0 ].age,
      name: 'users[0].age',
      value: 27,
      initial: 27,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    const after = stub.props.fields.users;
    expect(after).toNotBe(before);  // should be a new instance

    // check state
    expect(store.getState().form.testForm.users).toBeA('array');
    expect(store.getState().form.testForm.users.length).toBe(1);
    expect(store.getState().form.testForm.users[ 0 ].name)
      .toEqual({
        initial: 'Bob',
        value: 'Bob'
      });
    expect(store.getState().form.testForm.users[ 0 ].age)
      .toEqual({
        initial: 27,
        value: 27
      });
  });

  // Test to demonstrate bug: https://github.com/erikras/redux-form/issues/630
  it('should add array values when root is not an array', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [
        'acknowledgements.items[].number',
        'acknowledgements.items[].name',
        'acknowledgements.show'
      ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.acknowledgements).toBeA('object');
    expect(stub.props.fields.acknowledgements.items).toBeA('array');
    expect(stub.props.fields.acknowledgements.items.length).toBe(0);
    expect(stub.props.fields.acknowledgements.items.addField).toBeA('function');

    // add field
    stub.props.fields.acknowledgements.items.addField({
      number: 1,
      name: 'foo'
    });

    // check field
    expect(stub.props.fields.acknowledgements.items.length).toBe(1);
    expect(stub.props.fields.acknowledgements.items[ 0 ]).toBeA('object');
    expectField({
      field: stub.props.fields.acknowledgements.items[ 0 ].number,
      name: 'acknowledgements.items[0].number',
      value: 1,
      initial: 1,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.acknowledgements.items[ 0 ].name,
      name: 'acknowledgements.items[0].name',
      value: 'foo',
      initial: 'foo',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  // Test to demonstrate bug: https://github.com/erikras/redux-form/issues/468
  it('should add array values with DEEP defaults', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [
        'proposals[].arrival',
        'proposals[].departure',
        'proposals[].note',
        'proposals[].rooms[].name',
        'proposals[].rooms[].adults',
        'proposals[].rooms[].children'
      ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expect(stub.props.fields.proposals).toBeA('array');
    expect(stub.props.fields.proposals.length).toBe(0);
    expect(stub.props.fields.proposals.addField).toBeA('function');

    // add field
    const today = new Date();
    stub.props.fields.proposals.addField({
      arrival: today,
      departure: today,
      note: '',
      rooms: [ {
        name: 'Room 1',
        adults: 2,
        children: 0
      } ]
    });

    stub.props.fields.proposals[ 0 ].rooms.addField({
      name: 'Room 2',
      adults: 0,
      children: 2
    });

    // check field
    expect(stub.props.fields.proposals.length).toBe(1);
    expect(stub.props.fields.proposals[ 0 ]).toBeA('object');
    expectField({
      field: stub.props.fields.proposals[ 0 ].arrival,
      name: 'proposals[0].arrival',
      value: today,
      initial: today,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[ 0 ].departure,
      name: 'proposals[0].departure',
      value: today,
      initial: today,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[ 0 ].note,
      name: 'proposals[0].note',
      value: '',
      initial: '',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[ 0 ].rooms[ 0 ].name,
      name: 'proposals[0].rooms[0].name',
      value: 'Room 1',
      initial: 'Room 1',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[ 0 ].rooms[ 0 ].adults,
      name: 'proposals[0].rooms[0].adults',
      value: 2,
      initial: 2,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[ 0 ].rooms[ 0 ].children,
      name: 'proposals[0].rooms[0].children',
      value: 0,
      initial: 0,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[ 0 ].rooms[ 1 ].name,
      name: 'proposals[0].rooms[1].name',
      value: 'Room 2',
      initial: 'Room 2',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[ 0 ].rooms[ 1 ].adults,
      name: 'proposals[0].rooms[1].adults',
      value: 0,
      initial: 0,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    expectField({
      field: stub.props.fields.proposals[ 0 ].rooms[ 1 ].children,
      name: 'proposals[0].rooms[1].children',
      value: 2,
      initial: 2,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  // Test to demonstrate https://github.com/erikras/redux-form/issues/612
  //it('should work with a root-level array field', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['tags[]']
  //  })(Form);
  //  const dom = TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated/>
  //    </Provider>
  //  );
  //  const stub = TestUtils.findRenderedComponentWithType(dom, Form);
  //
  //  expect(stub.props.fields.tags).toBeA('array');
  //  expect(stub.props.fields.tags.length).toBe(0);
  //  expect(stub.props.fields.tags.addField).toBeA('function');
  //
  //  // add field
  //  stub.props.fields.proposals.addField('foo');
  //
  //  // check field
  //  expect(stub.props.fields.tags.length).toBe(1);
  //  expect(stub.props.fields.tags[0]).toBeA('object');
  //  expectField({
  //    field: stub.props.fields.tags[0],
  //    name: 'tags[0]',
  //    value: 'foo',
  //    initial: 'foo',
  //    valid: true,
  //    dirty: false,
  //    error: undefined,
  //    touched: false,
  //    visited: false
  //  });
  //});

  it('should initialize an array field, blowing away existing value', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'children' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // set value
    stub.props.fields.children.onChange([ 1, 2 ]);
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [ 1, 2 ],
      initial: undefined,
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // initialize new values
    stub.props.initializeForm({ children: [ 3, 4 ] });
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [ 3, 4 ],
      initial: [ 3, 4 ],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.children)
      .toEqual({
        initial: [ 3, 4 ],
        value: [ 3, 4 ]
      });
    // reset form to newly initialized values
    stub.props.resetForm();
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [ 3, 4 ],
      initial: [ 3, 4 ],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should only initialize on mount once', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'name' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated initialValues={{name: 'Bob'}}/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Bob',
      initial: 'Bob',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.name)
      .toEqual({
        initial: 'Bob',
        value: 'Bob'
      });
    // set value
    stub.props.fields.name.onChange('Dan');
    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Dan',
      initial: 'Bob',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.name)
      .toEqual({
        initial: 'Bob',
        value: 'Dan'
      });

    // should NOT dispatch INITIALIZE this time
    const dom2 = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated initialValues={{name: 'Bob'}}/>
      </Provider>
    );
    const stub2 = TestUtils.findRenderedComponentWithType(dom2, Form);
    // check that value is unchanged
    expectField({
      field: stub2.props.fields.name,
      name: 'name',
      value: 'Dan',
      initial: 'Bob',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.name)
      .toEqual({
        initial: 'Bob',
        value: 'Dan'
      });

    // manually initialize new values
    stub2.props.initializeForm({ name: 'Tom' });
    // check value
    expectField({
      field: stub2.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.name)
      .toEqual({
        initial: 'Tom',
        value: 'Tom'
      });
  });

  it('should allow initialization from action', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'name' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: undefined,
      initial: undefined,
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    // manually initialize new values
    stub.props.initializeForm({ name: 'Tom' });
    // check state
    expect(store.getState().form.testForm.name)
      .toEqual({
        initial: 'Tom',
        value: 'Tom'
      });
    // check value
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should allow deep sync validation error values', () => {
    const store = makeStore();
    const form = 'testForm';
    const deepError = {
      some: 'object with',
      deep: 'values'
    };
    const Decorated = reduxForm({
      form,
      fields: [ 'name' ],
      validate: () => ({ name: deepError })
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: undefined,
      initial: undefined,
      valid: false,
      dirty: false,
      error: deepError,
      touched: false,
      visited: false
    });
  });

  it('should allow deep async validation error values', () => {
    const store = makeStore();
    const form = 'testForm';
    const deepError = {
      some: 'object with',
      deep: 'values'
    };
    const Decorated = reduxForm({
      form,
      fields: [ 'name' ],
      initialValues: { name: 'Tom' },
      asyncValidate: () => Promise.reject({ name: deepError })
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // check field before validation
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });

    // form must be dirty for asyncValidate()
    stub.props.fields.name.onChange('Moe');

    return stub.props.asyncValidate()
      .then(() => {
        expect(true).toBe(false); // should not be in success block
      }, () => {
        // check state
        expect(store.getState().form.testForm.name)
          .toEqual({
            initial: 'Tom',
            value: 'Moe',
            asyncError: deepError
          });
        // check field
        expectField({
          field: stub.props.fields.name,
          name: 'name',
          value: 'Moe',
          initial: 'Tom',
          valid: false,
          dirty: true,
          error: deepError,
          touched: false,
          visited: false
        });
      });
  });

  it('should allow deep submit validation error values', () => {
    const store = makeStore();
    const form = 'testForm';
    const deepError = {
      some: 'object with',
      deep: 'values'
    };
    const Decorated = reduxForm({
      form,
      fields: [ 'name' ],
      initialValues: { name: 'Tom' },
      onSubmit: () => Promise.reject({ name: deepError })
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // check before validation
    expectField({
      field: stub.props.fields.name,
      name: 'name',
      value: 'Tom',
      initial: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
    return stub.props.handleSubmit()
      .then(() => {
        // check state
        expect(store.getState().form.testForm.name)
          .toEqual({
            initial: 'Tom',
            value: 'Tom',
            submitError: deepError,
            touched: true
          });
        // check field
        expectField({
          field: stub.props.fields.name,
          name: 'name',
          value: 'Tom',
          initial: 'Tom',
          valid: false,
          dirty: false,
          error: deepError,
          touched: true,
          visited: false
        });
      });
  });

  it('should only mutate the field that changed', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'larry', 'moe', 'curly' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    const larry = stub.props.fields.larry;
    const moe = stub.props.fields.moe;
    const curly = stub.props.fields.curly;

    moe.onChange('BONK!');

    expect(stub.props.fields.larry).toBe(larry);
    expect(stub.props.fields.moe).toNotBe(moe);
    expect(stub.props.fields.curly).toBe(curly);
  });

  it('should only change the deep field that changed', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'address.street', 'address.postalCode' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    const address = stub.props.fields.address;
    const street = stub.props.fields.address.street;
    const postalCode = stub.props.fields.address.postalCode;

    postalCode.onChange('90210');

    expect(stub.props.fields.address).toNotBe(address);
    expect(stub.props.fields.address.street).toBe(street);
    expect(stub.props.fields.address.postalCode).toNotBe(postalCode);
  });

  it('should change field tree up to array that changed', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: [ 'contact.shipping.phones[]', 'contact.billing.phones[]' ]
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    let contact = stub.props.fields.contact;
    let shipping = stub.props.fields.contact.shipping;
    let shippingPhones = stub.props.fields.contact.shipping.phones;
    const billing = stub.props.fields.contact.billing;
    const billingPhones = stub.props.fields.contact.billing.phones;

    shippingPhones.addField();

    expect(stub.props.fields.contact.shipping.phones).toNotBe(shippingPhones);
    expect(stub.props.fields.contact.shipping).toNotBe(shipping);
    expect(stub.props.fields.contact).toNotBe(contact);
    expect(stub.props.fields.contact.billing).toBe(billing);
    expect(stub.props.fields.contact.billing.phones).toBe(billingPhones);

    contact = stub.props.fields.contact;
    shipping = stub.props.fields.contact.shipping;
    shippingPhones = stub.props.fields.contact.shipping.phones;
    const shippingPhones0 = stub.props.fields.contact.shipping.phones[ 0 ];

    shippingPhones[ 0 ].onChange('555-1234');

    expect(stub.props.fields.contact.shipping.phones[ 0 ]).toNotBe(shippingPhones0);
    expect(stub.props.fields.contact.shipping.phones).toNotBe(shippingPhones);
    expect(stub.props.fields.contact.shipping).toNotBe(shipping);
    expect(stub.props.fields.contact).toNotBe(contact);
    expect(stub.props.fields.contact.billing).toBe(billing);
    expect(stub.props.fields.contact.billing.phones).toBe(billingPhones);
  });

  it('should not blow away existing values when initialValues changes', () => {
    const store = makeStore();
    const form = 'testForm';

    const Decorated = reduxForm({
      form,
      fields: [ 'firstName', 'lastName' ]
    })(Form);

    class StatefulContainer extends Component {
      constructor(props) {
        super(props);

        this.starrMe = this.starrMe.bind(this);
        this.state = {
          beatle: { firstName: 'John', lastName: 'Lennon' }
        };
      }

      starrMe() {
        this.setState({
          beatle: { firstName: 'Ringo', lastName: 'Starr' }
        });
      }

      render() {
        return (
          <div>
            <Decorated initialValues={this.state.beatle}/>
            <button onClick={this.starrMe}>Ringo Me!</button>
          </div>
        );
      }
    }

    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <StatefulContainer/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // initialized to John Lennon, pristine
    expect(stub.props.fields.firstName.value).toBe('John');
    expect(stub.props.fields.firstName.pristine).toBe(true);
    expect(stub.props.fields.lastName.value).toBe('Lennon');
    expect(stub.props.fields.lastName.pristine).toBe(true);

    // users changes to George Harrison
    stub.props.fields.firstName.onChange('George');
    stub.props.fields.lastName.onChange('Harrison');

    // values are now George Harrison
    expect(stub.props.fields.firstName.value).toBe('George');
    expect(stub.props.fields.firstName.pristine).toBe(false);
    expect(stub.props.fields.lastName.value).toBe('Harrison');
    expect(stub.props.fields.lastName.pristine).toBe(false);

    // change initialValues to Ringo Starr
    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
    TestUtils.Simulate.click(button);

    // values are STILL George Harrison
    expect(stub.props.fields.firstName.value).toBe('George');
    expect(stub.props.fields.firstName.pristine).toBe(false);
    expect(stub.props.fields.lastName.value).toBe('Harrison');
    expect(stub.props.fields.lastName.pristine).toBe(false);

    // but, if we reset form
    stub.props.resetForm();

    // values now go back to Ringo Starr, pristine
    expect(stub.props.fields.firstName.value).toBe('Ringo');
    expect(stub.props.fields.firstName.pristine).toBe(true);
    expect(stub.props.fields.lastName.value).toBe('Starr');
    expect(stub.props.fields.lastName.pristine).toBe(true);
  });

  it('should provide a submit() method to submit the form', () => {
    const store = makeStore();
    const form = 'testForm';
    const initialValues = { firstName: 'Bobby', lastName: 'Tables', age: 12 };
    const onSubmit = createSpy().andReturn(Promise.resolve());
    const Decorated = reduxForm({
      form,
      fields: [ 'firstName', 'lastName', 'age' ],
      initialValues,
      onSubmit
    })(Form);

    class Container extends Component {
      constructor(props) {
        super(props);
        this.submitFromParent = this.submitFromParent.bind(this);
      }

      submitFromParent() {
        this.refs.myForm.submit();
      }

      render() {
        return (
          <div>
            <Decorated ref="myForm"/>
            <button type="button" onClick={this.submitFromParent}>Submit From Parent</button>
          </div>
        );
      }
    }

    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Container/>
      </Provider>
    );

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');

    expect(onSubmit).toNotHaveBeenCalled();

    TestUtils.Simulate.click(button);

    expect(onSubmit)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(initialValues, store.dispatch);
  });

  it('submitting from parent should fail if sync validation errors', () => {
    const store = makeStore();
    const form = 'testForm';
    const initialValues = { firstName: 'Bobby', lastName: 'Tables', age: 12 };
    const onSubmit = createSpy().andReturn(Promise.resolve());
    const onSubmitFail = createSpy();
    const validate = createSpy().andReturn({ firstName: 'Go to your room, Bobby.' });
    const Decorated = reduxForm({
      form,
      fields: [ 'firstName', 'lastName', 'age' ],
      initialValues,
      onSubmit,
      onSubmitFail,
      validate
    })(Form);

    class Container extends Component {
      constructor(props) {
        super(props);
        this.submitFromParent = this.submitFromParent.bind(this);
      }

      submitFromParent() {
        this.refs.myForm.submit();
      }

      render() {
        return (
          <div>
            <Decorated ref="myForm"/>
            <button type="button" onClick={this.submitFromParent}>Submit From Parent</button>
          </div>
        );
      }
    }

    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Container/>
      </Provider>
    );

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');

    expect(onSubmit).toNotHaveBeenCalled();
    expect(onSubmitFail).toNotHaveBeenCalled();

    TestUtils.Simulate.click(button);

    expect(validate).toHaveBeenCalled();
    expect(onSubmit).toNotHaveBeenCalled();
    expect(onSubmitFail).toHaveBeenCalled();
  });

  it('should only rerender the form that changed', () => {
    const store = makeStore();
    const fooRender = createRestorableSpy().andReturn(<div/>);
    const barRender = createRestorableSpy().andReturn(<div/>);

    class FooForm extends Component {
      render() {
        return fooRender();
      }
    }

    class BarForm extends Component {
      render() {
        return barRender();
      }
    }

    const DecoratedFooForm = reduxForm({
      form: 'foo',
      fields: [ 'name' ]
    })(FooForm);
    const DecoratedBarForm = reduxForm({
      form: 'bar',
      fields: [ 'name' ]
    })(BarForm);

    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <div>
          <DecoratedFooForm/>
          <DecoratedBarForm/>
        </div>
      </Provider>
    );
    const fooStub = TestUtils.findRenderedComponentWithType(dom, FooForm);

    // first render
    expect(fooRender).toHaveBeenCalled();
    expect(barRender).toHaveBeenCalled();

    // restore spies
    fooRender.restore();
    barRender.restore();

    // change field on foo
    fooStub.props.fields.name.onChange('Tom');

    // second render: only foo form
    expect(fooRender).toHaveBeenCalled();
    expect(barRender).toNotHaveBeenCalled();
  });

  it('should only rerender the field components that change', () => {
    const store = makeStore();
    let fooRenders = 0;
    let barRenders = 0;

    class FooInput extends Component {
      shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
      }

      render() {
        fooRenders++;
        const {field} = this.props;
        return <input type="text" {...field}/>;
      }
    }
    FooInput.propTypes = {
      field: PropTypes.object.isRequired
    };

    class BarInput extends Component {
      shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
      }

      render() {
        barRenders++;
        const {field} = this.props;
        return <input type="password" {...field}/>;
      }
    }
    BarInput.propTypes = {
      field: PropTypes.object.isRequired
    };

    class FieldTestForm extends Component {
      render() {
        const {fields: {foo, bar}} = this.props;
        return (<div>
          <FooInput field={foo}/>
          <BarInput field={bar}/>
        </div>);
      }
    }
    FieldTestForm.propTypes = {
      fields: PropTypes.object.isRequired
    };

    const DecoratedForm = reduxForm({
      form: 'fieldTest',
      fields: [ 'foo', 'bar' ]
    })(FieldTestForm);

    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <DecoratedForm/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, FieldTestForm);

    // first render
    expect(fooRenders).toBe(1);
    expect(barRenders).toBe(1);

    // change field foo
    stub.props.fields.foo.onChange('Tom');

    // second render, only foo should rerender
    expect(fooRenders).toBe(2);
    expect(barRenders).toBe(1);

    // change field bar
    stub.props.fields.bar.onChange('Jerry');

    // third render, only bar should rerender
    expect(fooRenders).toBe(2);
    expect(barRenders).toBe(2);
  });

  // Test to show bug https://github.com/erikras/redux-form/issues/550
  // ---
  // It's caused by the fact that we're no longer using the same field instance
  // throughout the lifetime of the component. Since the fields are immutable now,
  // the field.value given to createOnDragStart() no longer refers to the current
  // value.
  // ---
  //it('should drag the current value', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['name']
  //  })(Form);
  //  const dom = TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated/>
  //    </Provider>
  //  );
  //  const stub = TestUtils.findRenderedComponentWithType(dom, Form);
  //
  //  stub.props.fields.name.onChange('FOO');
  //  const setData = createSpy();
  //  stub.props.fields.name.onDragStart({dataTransfer: {setData}});
  //
  //  expect(setData)
  //    .toHaveBeenCalled()
  //    .toHaveBeenCalledWith('value', 'FOO');
  //});

  // Test to show bug https://github.com/erikras/redux-form/issues/629
  // ---
  // It's caused by the fact that RESET is just copying values from initial to value,
  // but what it needs to do is blow away the whole state tree and re-initialize it
  // with the initial values.
  // ---
  //it('resetting the form should reset array fields', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['kennel', 'dogs[].name', 'dogs[].breed']
  //  })(Form);
  //  const dom = TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated initialValues={{
  //        kennel: 'Bob\'s Dog House',
  //        dogs: [
  //          {name: 'Fido', breed: 'Pit Bull'},
  //          {name: 'Snoopy', breed: 'Beagle'},
  //          {name: 'Scooby Doo', breed: 'Great Dane'}
  //        ]
  //      }}/>
  //    </Provider>
  //  );
  //  const stub = TestUtils.findRenderedComponentWithType(dom, Form);
  //
  //  expect(stub.props.fields.dogs.length).toBe(3);
  //
  //  stub.props.fields.dogs.addField({name: 'Lassie', breed: 'Collie'});
  //
  //  expect(stub.props.fields.dogs.length).toBe(4);
  //
  //  stub.props.resetForm();
  //
  //  expect(stub.props.fields.dogs.length).toBe(3);
  //});

  // Test to show bug https://github.com/erikras/redux-form/issues/621
  // ---
  // It's caused by the fact that we are letting the initialValues prop override
  // the data from the store for the initialValue and defaultValue props, but NOT for
  // value. So the value prop does not get populated until the second render.
  // ---
  //it('initial values should be present on first render', () => {
  //  const store = makeStore();
  //  const form = 'testForm';
  //  class InitialValuesTestForm extends Component {
  //    render() {
  //      const {fields: {name}} = this.props;
  //      expect(name.initialValue).toBe('Bob');
  //      expect(name.defaultValue).toBe('Bob');
  //      expect(name.value).toBe('Bob');
  //      return (<div>
  //        <input {...name}/>
  //      </div>);
  //    }
  //  }
  //  const Decorated = reduxForm({
  //    form,
  //    fields: ['name']
  //  })(InitialValuesTestForm);
  //  TestUtils.renderIntoDocument(
  //    <Provider store={store}>
  //      <Decorated initialValues={{name: 'Bob'}}/>
  //    </Provider>
  //  );
  //});
  it('should change nested fields', () => {
    let lastPrevBarValue; // eslint-disable-line
    let lastNextBarValue; // eslint-disable-line

    class FormComponent extends Component {
      componentWillReceiveProps(nextProps) {
        /*
         console.info(
         this.props.fields.foo.bar.value,
         nextProps.fields.foo.bar.value,
         this.props.fields.foo === nextProps.fields.foo,
         this.props.fields.foo.bar === nextProps.fields.foo.bar,
         this.props.fields.foo.bar.value === nextProps.fields.foo.bar.value);

         Prints out:

         previous previous false true true
         next next false true true
         */
        lastPrevBarValue = this.props.fields.foo.bar.value;
        lastNextBarValue = nextProps.fields.foo.bar.value;
      }

      render() {
        return <div />;
      }
    }

    FormComponent.propTypes = {
      fields: PropTypes.object.isRequired
    };

    const store = makeStore();
    const Decorated = reduxForm({
      form: 'testForm',
      fields: [ 'foo.bar' ]
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated initialValues={{
          foo: {
            bar: 'previous'
          }
        }}/>
      </Provider>
    );

    const stub = TestUtils.findRenderedComponentWithType(dom, FormComponent);

    const previousFields = stub.props.fields;
    const previousFoo = previousFields.foo;
    const previousFooBar = previousFields.foo.bar;
    const previousFooBarValue = previousFields.foo.bar.value;

    expect(previousFooBarValue).toBe('previous');

    stub.props.fields.foo.bar.onChange('next');

    const nextFields = stub.props.fields;
    const nextFoo = nextFields.foo;
    const nextFooBar = nextFields.foo.bar;
    const nextFooBarValue = nextFields.foo.bar.value;

    expect(nextFooBarValue)
      .toBe('next')
      .toNotBe(previousFooBarValue);
    expect(nextFooBar).toNotBe(previousFooBar);
    expect(nextFoo).toNotBe(previousFoo);

    // FAILS
    //expect(lastPrevBarValue).toNotEqual(lastNextBarValue);
  });
});
