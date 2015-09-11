#redux-form
---
[![NPM Version](https://img.shields.io/npm/v/redux-form.svg?style=flat)](https://www.npmjs.com/package/redux-form) 
[![NPM Downloads](https://img.shields.io/npm/dm/redux-form.svg?style=flat)](https://www.npmjs.com/package/redux-form)
[![Build Status](https://img.shields.io/travis/erikras/redux-form/master.svg?style=flat)](https://travis-ci.org/erikras/redux-form)
[![devDependency Status](https://david-dm.org/erikras/redux-form/dev-status.svg)](https://david-dm.org/erikras/redux-form#info=devDependencies)
[![redux-form channel on slack](https://img.shields.io/badge/slack-redux--form%40reactiflux-blue.svg)](http://www.reactiflux.com)
[![PayPal donate button](http://img.shields.io/paypal/donate.png?color=yellowgreen)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3QQPTMLGV6GU2)

`redux-form` works with [React Redux](https://github.com/gaearon/react-redux) to enable an html form in
[React](https://github.com/facebook/react) to use [Redux](https://github.com/gaearon/redux) to store all of its state.

## Table of Contents

* [Installation](#installation)
* [Release Notes](https://github.com/erikras/redux-form/releases)
* [Benefits](#benefits) - Why use this library?
  * [Unidirectional Data Flow](#unidirectonal-data-flow)
  * [Redux Dev Tools](#redux-dev-tools)
  * [Stateless Components](#stateless-components)
* [Implementation Guide](#implementation-guide) <-------------- **Start here!**
  * [A Simple Form Component](#a-simple-form-component)
  * [ES7 Decorator Sugar](#es7-decorator-sugar) - :warning: Experimental! :warning:
  * [Synchronous Validation](#synchronous-validation) - Client Side
  * [Asynchronous Validation](#asynchronous-validation) - Server Side
  * [Submitting Your Form](#submitting-your-form)
  * [Responding to Other Actions](#responding-to-other-actions)
  * [Normalizing Form Data](#normalizing-form-data)
  * [Editing Multiple Records](#editing-multiple-records)
  * [Calculating `props` from Form Data](#calculating-props-from-form-data)
  * [Dynamic Forms](#dynamic-forms)
  * [Advanced Usage](#advanced-usage)
    * [Doing the `connect()`ing Yourself](#doing-the-connecting-yourself)
      * [Binding Action Creators](#binding-action-creators)
* [API](#api)
  * [`connectReduxForm(config)`](#connectreduxformconfigobject)
  * [`reduxForm(config)`](#reduxformconfigobject)
  * [`reducer`](#reducer)
  * [`reducer.plugin(Object<String, Function>)`](#reducerpluginobjectstring-function)
  * [`reducer.normalize(Object<String, Function>)`](#reducerpluginobjectstring-function)
  * [`props` passed into your decorated component](#props-passed-into-your-decorated-component) - props provided by 
  `redux-form`
  * [`props` you can pass into your decorated component](#props-you-can-pass-into-your-decorated-component) - extra
  functionality!
  * [Action Creators](#action-creators) - Advanced
* [Working Demo](#working-demo)

---

## Installation

```
npm install --save redux-form
```

## Release Notes

This project follows [SemVer](http://semver.org) and each release is posted on the 
[Release Notes](https://github.com/erikras/redux-form/releases) page.

## Benefits

Why would anyone want to do this, you ask? React a perfectly good way of keeping state in each component! The
reasons are threefold.

#### Unidirectional Data Flow

For the same reason that React and Flux is superior to Angular's bidirectional data binding. Tracking down bugs
is much simpler when the data all flows through one dispatcher.

#### Redux Dev Tools

When used in conjunction with [Redux Dev Tools](https://github.com/gaearon/redux-devtools), you can fast forward
and rewind through your form data entry to better find bugs.

#### Stateless Components

By removing the state from your form components, you inherently make them easier to understand, test, and debug.
The React philosophy is to always try to use `props` instead of `state` when possible.

## Implementation Guide

__STEP 1:__ The first thing that you have to do is to give the `redux-form` reducer to Redux. You will only have to do 
this
once, no matter how many form components your app uses.

```javascript
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
const reducers = {
  // ... your other reducers here ...
  form: formReducer           // <---- Mounted at 'form'. See note below.
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```

*NOTE* – If you are not [doing the `connect()`ing yourself](#doing-the-connecting-yourself) (and it is recommended that 
you do not, unless you have an advanced use case that requires it), _you **must** mount the reducer at `form`_.

__STEP 2:__ Wrap your form component with `connectReduxForm()`.  `connectReduxForm()` wraps your form component in a 
Higher Order Component that connects to the Redux store and provides functions, as props to your component, for your 
form elements to use for sending `onChange` and `onBlur` events, as well as a function to handle synchronous
validation `onSubmit`. Let's look at a simple example.

### A Simple Form Component

You will need to wrap your form component with `redux-form`'s `connectReduxForm()` function.

> ___IMPORTANT:___ _If you are using `redux-form` with `react-native`, you will need to 
[use `reduxForm()` instead of `connectReduxForm()`](#doing-the-connecting-yourself), at least until React 0.14
is released._

```javascript
import React, {Component, PropTypes} from 'react';
import {connectReduxForm} from 'redux-form';
import validateContact from './validateContact';

class ContactForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }
  
  render() {
    const { fields: {name, address, phone}, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" {...name}/>     // will pass value, onBlur and onChange
        {name.error && name.touched ? <div>{name.error}</div>}
        
        <label>Address</label>
        <input type="text" {...address}/>  // will pass value, onBlur and onChange
        {address.error && address.touched ? <div>{address.error}</div>}
        
        <label>Phone</label>
        <input type="text" {...phone}/>    // will pass value, onBlur and onChange
        {phone.error && phone.touched ? <div>{phone.error}</div>}
        
        <button onClick={handleSubmit}>Submit</button>
      </form>
    );
  }
}

// apply connectReduxForm() and include synchronous validation
ContactForm = connectReduxForm({
  form: 'contact',                      // the name of your form and the key to
                                        // where your form's state will be mounted
  fields: ['name', 'address', 'phone'], // a list of all your fields in your form
  validate: validateContact             // a synchronous validation function
})(ContactForm);

// export the wrapped component
export default ContactForm;
```

Notice that we're just using vanilla `<input>` elements there is no state in the `ContactForm` component.
`handleSubmit` will call the function passed into `ContactForm`'s [`onSubmit` prop](#onsubmit-function-optional), _if 
and only if_ the synchronous validation passes. See [Submitting Your Form](#submitting-your-form).

### ES7 Decorator Sugar

Using [ES7 decorator proposal](https://github.com/wycats/javascript-decorators), the example above
could be written as:

```javascript
@connectReduxForm({
  form: 'contact',
  fields: ['name', 'address', 'phone'],
  validate: validateContact
})
export default class ContactForm extends Component {
```

Much nicer, don't you think?

You can enable it with [Babel Stage 1](http://babeljs.io/docs/usage/experimental/). Note that decorators
are experimental, and this syntax might change or be removed later.

### Synchronous Validation

You may optionally supply a validation function, which is in the form `({}) => {}` and takes in all
your data and spits out error messages. Your error messages may be strings or arrays of strings (if your field data 
is complex). For example:

```javascript
function validateContact(data) {
  const errors = {};
  if(!data.name) {
    errors.name = 'Required';
  }
  if(data.address && data.address.length > 50) {
    errors.address = 'Must be fewer than 50 characters';
  }
  if(!data.phone) {
    errors.phone = 'Required';
  } else if(!/\d{3}-\d{3}-\d{4}/.test(data.phone)) {
    errors.phone = 'Phone must match the form "999-999-9999"'
  }
  return errors;
}
```
You get the idea.

### Asynchronous Validation

Async validation can be achieved by calling an additional function on the function returned by
`connectReduxForm()` and passing it an asynchronous function that returns a promise that will resolve
to validation errors of the format that the synchronous [validation function](#synchronous-validation)
generates. So this...

```javascript
// apply connectReduxForm() and include synchronous validation
ContactForm = connectReduxForm({
  form: 'contact',
  fields: ['name', 'address', 'phone'],
  validate: validateContact
})(ContactForm);
```
...changes to this:
```javascript
function validateContactAsync(data) {
  return new Promise((resolve, reject) => {
    const errors = {};
    // do async validation
    resolve(errors);
  });
}

// apply connectReduxForm() and include synchronous AND asynchronous validation
ContactForm = connectReduxForm({
  form: 'contact',
  fields: ['name', 'address', 'phone'],
  validate: validateContact,
  asyncValidate: validateContactAsync
})(ContactForm);
```

Optionally, if you want asynchronous validation to be triggered when one or more of your form
fields is blurred, you may pass those fields to the `async()` function along with the asynchronous
validation function. Like so:

```javascript
// will only run async validation when 'name' or 'phone' is blurred
ContactForm = connectReduxForm({
  form: 'contact',
  fields: ['name', 'address', 'phone'],
  validate: validateContact,
  asyncValidate: validateContactAsync,
  asyncBlurFields: ['name', 'phone']
})(ContactForm);
```
With that call, the asynchronous validation will be called when either `name` or `phone` is blurred.
*Assuming that they have their `onBlur={handleBlur('name')}` properties properly set up.*

**NOTE!** If you _only_ want asynchronous validation, you may leave out the synchronous validation function.
And if you only want it to be run on submit, you may leave out the async blur fields, as well.
```javascript
ContactForm = connectReduxForm({
  form: 'contact',
  fields: ['name', 'address', 'phone'],
  asyncValidate: validateContactAsync
})(ContactForm);
```

### Submitting Your Form

The recommended way to submit your form is to create your form component as [shown above](#how-it-works),
using the `handleSubmit` prop, and then pass an [`onSubmit` prop](#onsubmit-function-optional) to your form component.

```javascript
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';

class ContactPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }
  
  handleSubmit(data) {
    console.log('Submission received!', data);
    this.props.dispatch(initialize('contact', {})); // clear form
  }
  
  render() {
    return (
      <div>
        <h1>Contact Information</h1>
        
        <ContactForm onSubmit={this.handleSubmit.bind(this)}/>
      </div>
    );
  }
}

export default connect()(ContactPage);  // adds dispatch prop
```

Or, if you wish to do your submission directly from your decorated form component, you may pass a function
to `handleSubmit`. To abbreviate the example [shown above](#how-it-works):

```javascript
class ContactForm extends Component {
  static propTypes = {
    // ...
    handleSubmit: PropTypes.func.isRequired
  }
  
  saveForm(data) {
    // make server call to save the data
  }
  
  render() {
    const {
      // ...
      handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit(this.saveForm)}> // <--- pass saveForm
        // ...
      </form>
    );
  }
}
```

### Responding to Other Actions

Part of the beauty of the flux architecture is that all the reducers (or "stores", in canonical Flux terminology)
receive all the actions, and they can modify their data based on any of them. For example, say you have a login form,
and when your login submission fails, you want to clear out the password field. Your login submission is part of
another reducer/actions system, but your form can still respond.

Rather than just using the vanilla reducer from `redux-form`, you can augment it to do other things by calling 
the `plugin()` function.

```javascript
import {reducer as formReducer} from 'redux-form';
import {AUTH_LOGIN_FAIL} from '../actions/actionTypes';

const reducers = {
  // ... your other reducers here ...
  form: formReducer.plugin({
    login: (state, action) => { // <------ 'login' is name of form given to connectReduxForm()
      switch(action.type) {
        case AUTH_LOGIN_FAIL:
          return {
            ...state,
            password: {}        // <----- clear password field
          };
        default:
          return state;
      }
    }
  })
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```

### Normalizing Form Data

Let's say that you have a form field that only accepts uppercase letters and another one where you want the value to 
be formatted in the `999-999-9999` United States phone number format. `redux-form` gives you a way to normalize your
data on every action to the reducer by calling the `normalize()` function on the default reducer.

```javascript
import {reducer as formReducer} from 'redux-form';

const reducers = {
  // ... your other reducers here ...
  form: formReducer.normalize({
    contact: {                                           // <--- the form name
      licensePlate: (value, previousValue, allValues) => // <--- field normalizer
        value && value.toUpperCase(),
      phone: (value, previousValue, allValues) => {      // <--- field normalizer
        if (value) {
          const match = value.match(/(\d{3})-?(\d{3})-?(\d{4})/);
          if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
          }
        }
        return value;
      }
    }
  })
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```

### Editing Multiple Records

Editing multiple records on the same page is trivially easy with `redux-form`. All you have to do is to pass a
unique `formKey` and `initialValues` props into your form element. Let's say we want to edit many contacts on the
same page.

```javascript
import React, {Component, PropTypes} from 'react';
import ContactForm from './ContactForm';

export default class ContactsPage extends Component {
  static propTypes = {
    contacts: PropTypes.array.isRequired  // how you pass the data in is up to you
  }
  
  handleSubmit(id, data) {
    // send to server
  }
  
  render() {
    const {contacts} = this.props;
    return (
      <div>
        {contacts.map(function (contact) {
          return <ContactForm
                   key={contact.id}                  // required by react
                   formKey={String(contact.id)}      // required by redux-form
                   initialValues={contact}           // initialize form values
                   onSubmit={this.handleSubmit.bind(this, contact.id)}/>
        })}
      </div>
    );
  }
}
```

### Calculating `props` from Form Data

You may want to have some calculated props, perhaps using [`reselect`](https://github.com/faassen/reselect)
selectors based on the values of the data in your form. You might be tempted to do this in the `mapStateToProps`
given to `connect()`. __This will not work__. The reason is that the form contents in the Redux store are lazily 
initialized, so `state.form.contacts.data.name` will fail, because `state.form.contacts` will be `undefined` until the 
first form action is dispatched.

The recommended way to accomplish this is to use yet another Higher Order Component decorator, such as
[`map-props`](https://github.com/erikras/map-props), like so:
```javascript
import mapProps from 'map-props';
...
// FIRST map props
ContactForm = mapProps({
  hasName: props => !!props.name.value
  hasPhone: props => !!props.phone.value
})(ContactForm);

// THEN apply connectReduxForm() and include synchronous validation
ContactForm = connectReduxForm({
  form: 'contact',
  fields: ['name', 'address', 'phone'],
  validate: validateContact
})(ContactForm);
...
```
Or, in ES7 land...
```javascript
@connectReduxForm({
  form: 'contact',
  fields: ['name', 'address', 'phone'],
  validate: validateContact
})
@mapProps({
  hasName: props => !!props.name.value
  hasPhone: props => !!props.phone.value
})
export default class ContactForm extends Component {
```
---

### Dynamic Forms

What if you don't know the shape of your form, i.e. what fields are needed, until runtime, maybe based on some data
retrieved from the server? No problem! Because of the functional nature of React, Redux and `redux-form`, you can
define **_and decorate_** your form component at runtime.

```javascript
import React, {Component, PropTypes} from 'react';
import {connectReduxForm} from 'redux-form';

class DynamicForm extends Component {
  static propTypes = {
    formName: PropTypes.string.isRequired,
    fieldsNeeded: PropTypes.arrayOf(PropTypes.string).isRequired
  }
  
  render() {
    const {formName, fieldsNeeded} = this.props;
    
    // define form class
    class Form extends Component {
      static propTypes = {
        fields: PropTypes.object.isRequired
      }
  
      render() {
        const {fields} = this.props;  // passed in by redux-form
        return (
          <div>
            {Object.keys(fields).map(fieldName => <div key={fieldName}>
              <label>{fieldName}</label>
              <input type="text" {...fields[fieldName]}/>
            </div>)}
          </div>
        );
      }
    }
    
    // connect Form to Redux and decorate with redux-form
    Form = connectReduxForm({ form: formName, fields: fieldsNeeded })(Form);
    
    // render connected and decorated form
    return <Form/>;
  }
}
```

---

## Advanced Usage

#### Doing the `connect()`ing Yourself

If, for some reason, you cannot mount the `redux-form` reducer at `form` in Redux, you may mount it anywhere else and
do the `connect()` call yourself. Rather than wrap your form component with `redux-form`'s `connectReduxForm()`, you 
will need to wrap your form component *both* with 
[React Redux](https://github.com/gaearon/react-redux)'s `connect()` function *and* with `redux-form`'s
`reduxForm()` function.

```javascript
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import reduxForm from 'redux-form';
import validateContact from './validateContact';

class ContactForm extends Component {
  //...
}

// apply reduxForm() and include synchronous validation
// note: we're using reduxForm, not connectReduxForm
ContactForm = reduxForm({
  form: 'contact',
  fields: ['name', 'address', 'phone'],
  validate: validateContact
})(ContactForm);

// ------- HERE'S THE IMPORTANT BIT -------
function mapStateToProps(state, ownProps) {
  // this is React Redux API: https://github.com/rackt/react-redux
  // for example, you may use ownProps here to refer to the props passed from parent.
  return {
    form: state.placeWhereYouMountedFormReducer[ownProps.something]
  };
}

// apply connect() to bind it to Redux state
ContactForm = connect(mapStateToProps)(ContactForm);

// export the wrapped component
export default ContactForm;
```

As you can see, `connectReduxForm()` is a tiny wrapper over `reduxForm()` that applies `connect()` for you.

##### Binding Action Creators

When doing the `connect()`ing yourself, if your form component also needs other redux action creators - _and you will
if you are performing your server submit in your form component_ - you cannot simply use the default
`bindActionCreators()` from `redux`, because that will remove `dispatch` from the props the `connect()` passes 
along, and `reduxForm()` needs `dispatch`. You will need to also include `dispatch` in your `mapDispatchToProps()`
function. So change this...

```javascript
import {bindActionCreators} from `redux`;

...

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

ContactForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactForm);
```

...to...

```javascript
import {bindActionCreators} from `redux`;

...

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(actionCreators, dispatch),
    dispatch  // <----- passing dispatch, too
  };
}

ContactForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactForm);
```

---
## API

### `connectReduxForm(config:Object)`

#### -`config.form : string` [optional]

> the name of your form and the key to where your form's state will be mounted, under the `redux-form` reducer, in the 
Redux store. If you do not provide this, you must pass it in as a `formName` prop to your component.

#### -`config.fields : Array<string>`

> a list of all your fields in your form. This is used for marking all of the fields as `touched` on submit.

#### -`config.validate : Function` [optional]

> your [synchronous validation function](#synchronous-validation). Defaults to `() => ({})`

#### -`config.readonly : boolean` [optional]

> if `true`, the decorated component will not be passed any of the `handleX` or `onX` props that will allow it to
mutate the state. Useful for decorating another component that is not your form, but that needs to know about the
state of your form.

#### -`config.touchOnBlur : boolean` [optional]

> marks fields to touched when the blur action is fired. Defaults to `true`

#### -`config.touchOnChange : boolean` [optional]

> marks fields to touched when the change action is fired. Defaults to `false`

#### -`config.asyncValidate : Function` [optional]

> a function that takes all the form data and returns a Promise that will resolve to an object
of validation errors in the form `{ field1: <string>, field2: <string>, valid: <boolean> }` just like the
[synchronous validation function](#synchronous-validation). See 
[Aynchronous Validation](#asynchronous-validation) for more details.

#### -`config.asyncBlurFields : Array<String>` [optional]

> field names for which `handleBlur` should trigger a call to the `asyncValidate` function. Defaults to `[]`.

---
  
### `reduxForm(config:Object)`

> __[NOT RECOMMENDED]__ `reduxForm()` has the same API as 
  [`connectReduxForm()`](#connectreduxformformnamestring-fieldsarrayltstringgt-validatefunction-touchonblurboolean-touchonchangeboolean)
  except that ___you must [wrap the component in `connect()` yourself](#doing-the-connecting-yourself)___.
  
---
  
### `reducer`

> The form reducer. Should be given to mounted to your Redux state at `form`.

---
  
### `reducer.plugin(Object<String, Function>)`

> Returns a form reducer that will also pass each action through additional reducers specified. The parameter should 
be an object mapping from `formName` to a `(state, action) => nextState` reducer. **The `state` passed to each reducer 
will only be the slice that pertains to that form.** See [Responding to Other Actions](#responding-to-other-actions).

---
  
### `reducer.normalize(Object<String, Object<String, Function>>)`

> Returns a form reducer that will also pass each form value through the normalizing functions provided. The 
parameter is an object mapping from `formName` to an object mapping from `fieldName` to a normalizer function. The 
normalizer function is given three parameters and expected to return the normalized value of the field.
See [Normalizing Form Data](#normalizing-form-data).

##### -`value : string`

> The current value of the field

##### -`previousValue : string`

> The previous value of the field before the current action was dispatched

##### -`allValues : Object<string, string>`

> All the values of the current form

---
  
### `props` passed into your decorated component

The props passed into your decorated component by `redux-form` will be:

#### -`active : String`

> the name of the currently active (with focus) field

#### -`asyncValidate : Function`

> a function that may be called to initiate asynchronous validation if asynchronous validation is enabled

#### -`asyncValidating : boolean`

> `true` if the asynchronous validation function has been called but has not yet returned.

#### -`dirty : boolean`

> `true` if the form data has changed from its initialized values. Opposite of `pristine`.

#### -`fields : Object`

> The form data, in the form `{ field1: <Object>, field2: <Object> }`, where each field `Object` has the following 
properties:

##### ---`active : boolean`

> `true` if this field currently has focus. It will only work if you are passing `handleFocus` to your input element.

##### ---`checked : boolean?`

> An alias for `value` _only when `value` is a boolean_. Provided for convenience of destructuring the whole field
object into the props of a form element.

##### ---`dirty : boolean`

> `true` if the field value has changed from its initialized value. Opposite of `pristine`.

##### ---`error : String?`

> The error for this field if its value is not passing validation. Both synchronous and asynchronous validation 
errors will be reported here.

##### ---`handleBlur : Function`

> A function to call when the form field loses focus. It expects to receive the 
[React SyntheticEvent](http://facebook.github.io/react/docs/events.html) and is meant to be passed to the form
element's `onBlur` prop. _Alternatively: you may pass the value directly into `handleBlur` to set the value on in the
form._

##### ---`handleChange : Function`

> A function to call when the form field is changed. It expects to receive the 
[React SyntheticEvent](http://facebook.github.io/react/docs/events.html) and is meant to be passed to the form
element's `onChange` prop. _Alternatively: you may pass the value directly into `handleChange` to set the value on in
the form._

##### ---`handleFocus : Function`

> A function to call when the form field receives focus. It is meant to be passed to the form
element's `onFocus` prop.

##### ---`invalid : boolean`

> `true` if the field value fails validation (has a validation error). Opposite of `valid`.

##### ---`name : String`

> The name of the field. It will be the same as the key in the `fields` Object, but useful if bundling up a field to 
send down to a specialized input component.

##### ---`onBlur : Function`

> An alias for `handleBlur`. Provided for convenience of destructuring the whole field object into the props of a 
form element.

##### ---`onChange : Function`

> An alias for `handleChange`. Provided for convenience of destructuring the whole field object into the props of a 
form element.

##### ---`onFocus : Function`

> An alias for `handleFocus`. Provided for convenience of destructuring the whole field object into the props of a 
form element.

##### ---`pristine : boolean`

> `true` if the field value is the same as its initialized value. Opposite of `dirty`.

##### ---`touched : boolean`

> `true` if the field has been touched.

##### ---`valid : boolean`

> `true` if the field value passes validation (has no validation errors). Opposite of `invalid`.

##### ---`value: any`

> The value of this form field. It will be a boolean for checkboxes, and a string for all other input types.

##### ---`visited: boolean`

> `true` if this field has ever had focus. It will only work if you are passing `handleFocus` to your input element.

#### -`handleBlur(field:string, value:any?) : Function`

> Returns a `handleBlur` function for the field passed. `handleBlur('age')` returns `fields.age.handleBlur`. If you 
pass it both a field and a value, it will set that value in the form. If you give it just a field, it will return a 
function that will set the value when either given the value or an event from an input.

#### -`handleChange(field:string, value:any?) : Function`

> Returns a `handleChange` function for the field passed. `handleChange('age')` returns `fields.age.handleChange`. If
you pass it both a field and a value, it will set that value in the form. If you give it just a field, it will return a 
function that will set the value when either given the value or an event from an input.

#### -`handleFocus(field:string) : Function`

> Returns a `handleFocus` function for the field passed. `handleFocus('age')` returns `fields.age.handleFocus`, a
function to be passsed to the `onFocus` prop of your input component.

#### -`handleSubmit : Function`

> a function meant to be passed to `<form onSubmit={handleSubmit}>` or to `<button onClick={handleSubmit}>`.
It will run validation, both sync and async, and, if the form is valid, it will call `this.props.onSubmit(data)`
with the contents of the form data.

> Optionally, you may also pass your `onSubmit` function to `handleSubmit` which will take the place of the 
`onSubmit` prop. For example: `<form onSubmit={handleSubmit(this.save.bind(this))}>`

> If your `onSubmit` function returns a promise, the [`submitting`](#-submitting--boolean) property will be set to
`true` until the promise has been resolved or rejected. If it is rejected with an object matching
`{ field1: 'error', field2: 'error' }` then the submission errors will be added to each field (to the
[`error`](#---error--string) prop) just like async validation errors are.

#### -`initializeForm(data:Object) : Function`

> Initializes the form data to the given values. All `dirty` and `pristine` state will be determined by
comparing the current data with these initialized values.

#### -`invalid : boolean`

> `true` if the form has validation errors. Opposite of `valid`.

#### -`pristine: boolean`

> `true` if the form data is the same as its initialized values. Opposite of `dirty`.

#### -`resetForm() : Function`

> Resets all the values in the form to the initialized state, making it pristine again.

#### -`formKey : String`

> The same `formKey` prop that was passed in. See [Editing Multiple Records](#editing-multiple-records).

#### -`submitting : boolean`

> Whether or not your form is currently submitting. This prop will only work if you have passed an
`onSubmit` function that returns a promise. It will be true until the promise is resolved or rejected.

#### -`touch(...field:string) : Function`

> Marks the given fields as "touched" to show errors.

#### -`touchAll() : Function`

> Marks all fields as "touched" to show errors. should be called on form submission.

#### -`untouch(...field:string) : Function`

> Clears the "touched" flag for the given fields

#### -`untouchAll() : Function`

> Clears the "touched" flag for the all fields

#### -`valid : boolean`

> `true` if the form passes validation (has no validation errors). Opposite of `invalid`.

#### -`values : Object`

> All of your values in the form `{ field1: <string>, field2: <string> }`.

---

### `props` you can pass into your decorated component

The props that you can pass into decorated component by `redux-form` will be:

#### -`formKey : String` [optional]

> a unique key for the subform this component will be editing. See
[Editing Multiple Records](#editing-multiple-records).

#### -`formName : String` [optional]

> the name of your form and the key to where your form's state will be mounted, under the `redux-form` reducer, in the 
Redux store. Will overwrite any [`config.form`](#-configform--string-optional) value that was passed to 
[`connectReduxForm(config)`](#connectreduxformconfigobject).

#### -`initialValues : Object` [optional]

> the values with which to initialize your form in `componentWillMount`. Particularly useful when
[Editing Multiple Records](#editing-multiple-records), but can also be used with single-record forms.

#### -`onSubmit : Function` [optional]

> the function to call with the form data when the `handleSubmit` is fired from within the form component. If you
do not specify it as a prop here, you must pass it as a parameter to `handleSubmit` inside your form component.

> If your `onSubmit` function returns a promise, the [`submitting`](#-submitting--boolean) property will be set to
`true` until the promise has been resolved or rejected. If it is rejected with an object matching
`{ field1: 'error', field2: 'error' }` then the submission errors will be added to each field (to the
[`error`](#---error--string) prop) just like async validation errors are.

---

### Action Creators

`redux-form` exports all of its internal action creators, allowing you complete control to dispatch any action
you wish. However, **it is *highly* recommended that you use the actions passed as props to your component
for most of your needs.**

#### -`blur(form:String, field:String, value:String)`

> Saves the value and, if you have `touchOnBlur` enabled, marks the field as `touched`.

#### -`change(form:String, field:String, value:String)`

> Saves the value and, if you have `touchOnChange` enabled, marks the field as `touched`.

#### -`focus(form:String, field:String)`

> Marks the given field as `active` and `visited`.

#### -`initialize(form:String, data:Object)`

> Sets the initial values in the form with which future data values will be compared to calculate
`dirty` and `pristine`. The `data` parameter should only contain `String` values.

#### -`initializeWithKey(form:String, formKey, data:Object)`

> Used when editing multiple records with the same form component. See
[Editing Multiple Records](#editing-multiple-records).

#### -`reset(form:String)`

> Resets the values in the form back to the values past in with the most recent `initialize` action.

#### -`startAsyncValidation(form:String)`

> Flips the `asyncValidating` flag `true`.

#### -`startSubmit(form:String)`

> Flips the `submitting` flag `true`.

#### -`stopSubmit(form:String, errors:Object)`

> Flips the `submitting` flag `false` and populates `submitError` for each field.

#### -`stopAsyncValidation(form:String, errors:Object)`

> Flips the `asyncValidating` flag `false` and populates `asyncError` for each field.

#### -`touch(form:String, ...fields:String)`

> Marks all the fields passed in as `touched`.

#### -`untouch(form:String, ...fields:String)`

> Resets the 'touched' flag for all the fields passed in.

---
  
## Working Demo

Check out the 
[react-redux-universal-hot-example project](https://github.com/erikras/react-redux-universal-hot-example) to see 
`redux-form` in action.

This is an extremely young library, so the API may change. Comments and feedback welcome.
