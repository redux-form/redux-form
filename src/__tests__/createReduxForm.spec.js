/* eslint react/no-multi-comp:0*/
import expect from 'expect';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from '../reducer';
import createReduxForm from '../createReduxForm';

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

  const expectField = ({field, name, value, valid, dirty, error, touched, visited, readonly}) => {
    expect(field).toBeA('object');
    expect(field.name).toBe(name);
    expect(field.value).toEqual(value);
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
    expect(field.valid).toBe(valid);
    expect(field.invalid).toBe(!valid);
    expect(field.dirty).toBe(dirty);
    expect(field.pristine).toBe(!dirty);
    expect(field.error).toBe(error);
    expect(field.touched).toBe(touched);
    expect(field.visited).toBe(visited);
  };

  it('should render without error', () => {
    const store = makeStore();
    expect(() => {
      const Decorated = reduxForm({
        form: 'testForm',
        fields: ['foo', 'bar']
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
      fields: ['foo', 'bar']
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
      fields: ['foo', 'bar']
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
      fields: ['foo', 'bar']
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
      fields: ['foo', 'bar'],
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
      fields: ['foo', 'bar']
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
      fields: ['foo', 'bar'],
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
      fields: ['foo', 'bar']
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
      fields: ['foo', 'bar']
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
      fields: ['children[].name'],
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
      field: stub.props.fields.children[0].name,
      name: 'children[0].name',
      value: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.children[1].name,
      name: 'children[1].name',
      value: 'Jerry',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.children[0].name.onChange('Tim');

    expectField({
      field: stub.props.fields.children[0].name,
      name: 'children[0].name',
      value: 'Tim',
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });
    expectField({
      field: stub.props.fields.children[1].name,
      name: 'children[1].name',
      value: 'Jerry',
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
      fields: ['foo', 'bar'],
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
      fields: ['foo.bar'],
      validate: values => {
        const errors = {};
        if (values.foo.bar && values.foo.bar.length > 8) {
          errors.foo = {bar: 'Too long'};
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
      fields: ['foo[]', 'bar[].name'],
      validate: values => {
        const errors = {};
        if (values.foo && values.foo.length && values.foo[0] && values.foo[0].length > 8) {
          errors.foo = ['Too long'];
        }
        if (values.bar && values.bar.length && values.bar[0] && values.bar[0].name === 'Ralphie') {
          errors.bar = [{name: `You'll shoot your eye out, kid!`}];
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
      field: stub.props.fields.foo[0],
      name: 'foo[0]',
      value: 'fooBar',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false,
      readonly: false
    });

    expectField({
      field: stub.props.fields.bar[0].name,
      name: 'bar[0].name',
      value: '',
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

    stub.props.fields.foo[0].onChange('fooBarBaz');

    expectField({
      field: stub.props.fields.foo[0],
      name: 'foo[0]',
      value: 'fooBarBaz',
      valid: false,
      dirty: true,
      error: 'Too long',
      touched: false,
      visited: false,
      readonly: false
    });

    stub.props.fields.bar[0].name.onChange('Ralphie');

    expectField({
      field: stub.props.fields.bar[0].name,
      name: 'bar[0].name',
      value: 'Ralphie',
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
      foo: ['Too long'],
      bar: [{name: `You'll shoot your eye out, kid!`}]
    });
  });

  it('should call destroy on unmount', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: ['foo', 'bar']
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
    expect(before.form[form]).toBeA('object');
    expect(before.form[form].foo).toBeA('object');
    expect(before.form[form].bar).toBeA('object');

    ReactDOM.unmountComponentAtNode(div);

    const after = store.getState();
    expect(after.form).toBeA('object');
    expect(after.form[form]).toNotExist();
  });

  it('should NOT call destroy on unmount if destroyOnUnmount is disabled', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: ['foo', 'bar'],
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
    expect(before.form[form]).toBeA('object');
    expect(before.form[form].foo).toBeA('object');
    expect(before.form[form].bar).toBeA('object');

    ReactDOM.unmountComponentAtNode(div);

    const after = store.getState();
    expect(after.form).toBeA('object');
    expect(after.form[form]).toBeA('object');
    expect(after.form[form].foo).toBeA('object');
    expect(after.form[form].bar).toBeA('object');
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
      fields: ['foo', 'bar']
    })(FormWithStatics);

    expect(Decorated.someStatic1).toBe('cat');
    expect(Decorated.someStatic2).toBe(42);
  });

  it('should not provide mutators when readonly', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: ['foo', 'bar'],
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
      fields: ['children[].name'],
      initialValues: {
        children: [{name: 'Tom'}, {name: 'Jerry'}]
      }
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    expectField({
      field: stub.props.fields.children[0].name,
      name: 'children[0].name',
      value: 'Tom',
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });

    expectField({
      field: stub.props.fields.children[1].name,
      name: 'children[1].name',
      value: 'Jerry',
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
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated onSubmit={submit}/>
      </Provider>
    );
    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(button);
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
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated onSubmit={submit}/>
      </Provider>
    );
    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(button);
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
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated />
      </Provider>
    );
    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(button);
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
      fields: ['foo', 'bar'],
      readonly: true
    })(FormComponent);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated />
      </Provider>
    );
    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

    TestUtils.Simulate.submit(button);
  });

  it('should initialize a non-array field with an array value and let it read it back', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: ['children'],
      initialValues: {
        children: [1, 2]
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
      value: [1, 2],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });

  it('should initialize an array field without blowing away existing value', () => {
    const store = makeStore();
    const form = 'testForm';
    const Decorated = reduxForm({
      form,
      fields: ['children']
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);

    // set value
    stub.props.fields.children.onChange([1, 2]);
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [1, 2],
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // initialize new values
    stub.props.initializeForm({children: [3, 4]});
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [1, 2],
      valid: true,
      dirty: true,
      error: undefined,
      touched: false,
      visited: false
    });
    // check state
    expect(store.getState().form.testForm.children)
      .toEqual({
        initial: [3, 4],
        value: [1, 2]
      });
    // reset form to newly initialized values
    stub.props.resetForm();
    // check value
    expectField({
      field: stub.props.fields.children,
      name: 'children',
      value: [3, 4],
      valid: true,
      dirty: false,
      error: undefined,
      touched: false,
      visited: false
    });
  });
});
