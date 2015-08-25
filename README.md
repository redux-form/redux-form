#redux-form
---
[![NPM Version](https://img.shields.io/npm/v/redux-form.svg?style=flat-square)](https://www.npmjs.com/package/redux-form) 
[![NPM Downloads](https://img.shields.io/npm/dm/redux-form.svg?style=flat-square)](https://www.npmjs.com/package/redux-form)
[![Build Status](https://img.shields.io/travis/erikras/redux-form/master.svg?style=flat-square)](https://travis-ci.org/erikras/redux-form)
[![devDependency Status](https://david-dm.org/erikras/redux-form/dev-status.svg)](https://david-dm.org/erikras/redux-form#info=devDependencies)
[![redux-form channel on slack](https://img.shields.io/badge/slack-redux--form%40reactiflux-blue.svg)](http://www.reactiflux.com)

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
  * [Binding Action Creators](#binding-action-creators)
  * [Synchronous Validation](#synchronous-validation) - Client Side
  * [Asynchronous Validation](#asynchronous-validation) - Server Side
  * [Submitting Your Form](#submitting-your-form)
  * [Responding to Other Actions](#responding-to-other-actions)
  * [Editing Multiple Records](#editing-multiple-records)
  * [Calculating `props` from Form Data](#calculating-props-from-form-data)
* [API](#api)
  * [`reduxForm(formName, fields, validate?, touchOnBlur?, touchOnChange?)`](#reduxformformnamestring-fieldsarrayltstringgt-validatefunction-touchonblurboolean-touchonchangeboolean)
  * [`reduxForm().async(asyncValidate, ...fields?)`](#reduxformasyncasyncvalidatefunction-fieldsstring)
  * [`props`](#props) - The props passed in to your form component by `redux-form`
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
  form: formReducer   // it is recommended that you use the key 'form'
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```

__STEP 2:__ Wrap your form component with `reduxForm()`.  `reduxForm()` creates a Higher Order Component that expects
a `dispatch` prop and a slice of the Redux store where all the `redux-form` data is stored as a `form` prop. These 
should be provided by [React Redux](https://github.com/gaearon/react-redux)'s `connect()` function.

### A Simple Form Component

You will need to wrap your form component *both* with 
[React Redux](https://github.com/gaearon/react-redux)'s `connect()` function *and* with `redux-form`'s
`reduxForm()` function.

```javascript
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import reduxForm from 'redux-form';
import contactValidation from './contactValidation';

class ContactForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }
  
  render() {
    const {
      data: {name, address, phone},
      errors, touched, handleBlur, handleChange, handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" 
               value={name} 
               onChange={handleChange('name')} 
               onBlur={handleBlur('name')}/>
        {errors.name && touched.name ? <div>{errors.name}</div>}
        
        <label>Address</label>
        <input type="text" 
               value={address} 
               onChange={handleChange('address')} 
               onBlur={handleBlur('address')}/>
        {errors.address && touched.address ? <div>{errors.address}</div>}
        
        <label>Phone</label>
        <input type="text" 
               value={phone} 
               onChange={handleChange('phone')} 
               onBlur={handleBlur('phone')}/>
        {errors.phone && touched.phone ? <div>{errors.phone}</div>}
        
        <button onClick={handleSubmit}>Submit</button>
      </form>
    );
  }
}

// apply reduxForm() and include synchronous validation
ContactForm = reduxForm('contact', ['name', 'address', 'phone'], contactValidation)(ContactForm);

// ------- HERE'S THE IMPORTANT BIT -------
function mapStateToProps(state) {
  return { form: state.form };  // if you mounted the reducer at 'form' in Step 1
}
// apply connect() to bind it to Redux state
ContactForm = connect(mapStateToProps)(ContactForm);

// export the wrapped component
export default ContactForm;
```

Notice that we're just using vanilla `<input>` elements there is no state in the `ContactForm` component.
`handleSubmit` will call the function passed into `ContactForm`'s `onSubmit` prop, _if and only
if_ the synchronous validation passes. See [Submitting Your Form](#submitting-your-form).

### ES7 Decorator Sugar

Using [ES7 decorator proposal](https://github.com/wycats/javascript-decorators), the example above
could be written as:

```javascript
@connect(state => ({ form: state.form }))
@reduxForm('contact', ['name', 'address', 'phone'], contactValidation)
export default class ContactForm extends Component {
```

Much nicer, don't you think?

You can enable it with [Babel Stage 1](http://babeljs.io/docs/usage/experimental/). Note that decorators
are experimental, and this syntax might change or be removed later.

### Binding Action Creators

If your form component also needs other redux action creators - _and you will if you are performaing your server 
submit in your form component_ - you cannot simply use the default `bindActionCreators()` from `redux`, because that 
will remove `dispatch` from the props the `connect()` passes along, and `reduxForm` needs `dispatch`. You will need to also
include `dispatch` in your `mapDispatchToProps()` function. So change this...

```javascript
import {bindActionCreators} from `redux`;
...
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
ContactForm = connect(mapStateToProps, mapDispatchToProps)(ContactForm);
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
ContactForm = connect(mapStateToProps, mapDispatchToProps)(ContactForm);
```

### Synchronous Validation

You may optionally supply a validation function, which is in the form `({}) => {}` and takes in all
your data and spits out error messages as well as a `valid` flag. For example:

```javascript
function contactValidation(data) {
  const errors = { valid: true };
  if(!data.name) {
    errors.name = 'Required';
    errors.valid = false;
  }
  if(data.address && data.address.length > 50) {
    errors.address = 'Must be fewer than 50 characters';
    errors.valid = false;
  }
  if(!data.phone) {
    errors.phone = 'Required';
    errors.valid = false;
  } else if(!/\d{3}-\d{3}-\d{4}/.test(data.phone)) {
    errors.phone = 'Phone must match the form "999-999-9999"'
    errors.valid = false;
  }
  return errors;
}
```
You get the idea.

__You must return a boolean `valid` flag in the result.__

### Asynchronous Validation

Async validation can be achieved by calling an additional function on the function returned by
`reduxForm()` and passing it an asynchronous function that returns a promise that will resolve
to validation errors of the format that the synchronous [validation function](#synchronous-validation)
generates. So this...

```javascript
// apply reduxForm() and include synchronous validation
ContactForm = reduxForm('contact', ['name', 'address', 'phone'], contactValidation)(ContactForm);
```
...changes to this:
```javascript
function asyncValidation(data) {
  return new Promise((resolve, reject) => {
    const errors = {valid: true};
    // do async validation
    resolve(errors);
  });
}

// apply reduxForm() and include synchronous AND asynchronous validation
ContactForm = reduxForm('contact', ['name', 'address', 'phone'], contactValidation)
  .async(asyncValidation)(ContactForm);
```

Optionally, if you want asynchronous validation to be triggered when one or more of your form
fields is blurred, you may pass those fields to the `async()` function along with the asynchronous
validation function. Like so:

```javascript
ContactForm = reduxForm('contact', ['name', 'address', 'phone'], contactValidation)
  .async(asyncValidation, 'name', 'phone')(ContactForm);
```
With that call, the asynchronous validation will be called when either `name` or `phone` is blurred.
*Assuming that they have their `onBlur={handleBlur('name')}` properties properly set up.*

**NOTE!** If you _only_ want asynchronous validation, you may leave out the synchronous validation function.
And if you only want it to be run on submit, you may leave out the fields, as well.
```javascript
ContactForm = reduxForm('contact', ['name', 'address', 'phone']).async(asyncValidation)(ContactForm);
```

### Submitting Your Form

The recommended way to submit your form is to create your form component as [shown above](#how-it-works),
using the `handleSubmit` prop, and then pass an `onSubmit` prop to your form component.

```javascript
import React, {Component, PropTypes} from 'redux-form';
import {connect} from 'redux';
import {initialize} from 'redux-form';

class ContactPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }
  
  handleSubmit(data) {
    console.log('Submission received!', data);
    this.props.dispatch(initialize('contactForm', {})); // clear form
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
const loginFormReducer = createFormReducer('loginForm', ['email', 'password']);

const reducers = {
  // ... your other reducers here ...
  form: formReducer.plugin({
    login: (state, action) => { // <------ 'login' is name of form given to reduxForm()
      switch(action.type) {
        case AUTH_LOGIN_FAIL:
          return {
            ...state,
            data: {
              ...state.data,
              password: ''     // <----- clear password field
            },
            touched: {
              ...state.touched,
              password: false // <------ also set password to 'untouched'
            }
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

### Editing Multiple Records

Editing multiple records on the same page is trivially easy with `redux-form`. All you have to do is to pass a
unique `formKey` prop into your form element, and initialize the data with `initializeWithKey()`
instead of `initialize()`. Let's say we want to edit many contacts on the same page.

```javascript
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {initializeWithKey} from 'redux-form';
import {bindActionCreators} from 'redux';
import ContactForm from './ContactForm';

class ContactsPage extends Component {
  static propTypes = {
    contacts: PropTypes.array.isRequired,
    initializeWithKey: PropTypes.func.isRequired
  }
  
  componentWillMount() {
    const {contacts, initializeWithKey} = this.props;
    contacts.forEach(function (contact) {
      initializeWithKey('contact', String(contact.id), contact);
    });
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
                   onSubmit={this.handleSubmit.bind(this, contact.id)}/>
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { contacts: state.contacts.data };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ initializeWithKey }, dispatch),
}

// apply connect() to bind it to Redux state
ContactsPage = connect(mapStateToProps, mapDispatchToProps)(ContactsPage);

// export the wrapped component
export default ContactPage;
```

### Calculating `props` from Form Data

You may want to have some calculated props, perhaps using [`reselect`](https://github.com/faassen/reselect)
selectors based on the values of the data in your form. You might be tempted to do this in the `mapStateToProps`
given to `connect()`. __This will not work__. The reason is that the form contents in the Redux store are lazily 
initialized, so `state.form.contacts.data.name` will fail, because `state.form.contacts` will be null.

The recommended way to accomplish this is to use yet another Higher Order Component decorator, such as
[`map-props`](https://github.com/erikras/map-props), like so:
```javascript
import mapProps from 'map-props';
...
// FIRST map props
ContactForm = mapProps({
  hasName: props => !!props.data.name
  hasPhone: props => !!props.data.phone
})(ContactForm);

// THEN apply reduxForm() and include synchronous validation
ContactForm = reduxForm('contact', ['name', 'address', 'phone'], contactValidation)(ContactForm);
...
```
Or, in ES7 land...
```javascript
@connect(state => ({ form: state.form }))
@reduxForm('contact', ['name', 'address', 'phone'], contactValidation)
@mapProps({
  hasName: props => !!props.data.name
  hasPhone: props => !!props.data.phone
})
export default class ContactForm extends Component {
```
---
## API

### `reduxForm(formName:string, fields:Array&lt;string&gt;, validate:Function?, touchOnBlur:boolean?, touchOnChange:boolean?)`

##### -`formName : string`

> the name of your form and the key to where your form's state will be mounted, under the `redux-form` reducer, in the 
Redux store

##### - fields : Array&lt;string&gt;

> a list of all your fields in your form. This is used for marking all of the fields as `touched` on submit.

##### -`validate : Function` [optional]

> your [synchronous validation function](#synchronous-validation). Defaults to `() => ({valid: true})`

#### `touchOnBlur` : boolean [optional]

> marks fields to touched when the blur action is fired. Defaults to `true`

#### `touchOnChange` : boolean [optional]

> marks fields to touched when the change action is fired. Defaults to `false`

### `reduxForm().async(asyncValidate:Function, ...fields:String?)`

##### -`asyncValidate : Function`

> a function that takes all the form data and returns a Promise that will resolve to an object
of validation errors in the form `{ field1: <string>, field2: <string>, valid: <boolean> }` just like the
[synchronous validation function](#synchronous-validation). See 
[Aynchronous Validation](#asynchronous-validation) for more details.

###### -`...fields : String` [optional]

> field names for which `handleBlur` should trigger a call to the `asyncValidate` function

### props

The props passed into your decorated component will be:

##### -`asyncValidate : Function`

> a function that may be called to initiate asynchronous validation if asynchronous validation is enabled

##### -`asyncValidating : boolean`

> `true` if the asynchronous validation function has been called but has not yet returned.

##### -`data : Object`

> The form data, in the form `{ field1: <string>, field2: <string> }`

##### -`dirty : boolean`

> `true` if the form data has changed from its initialized values. Opposite of `pristine`.

##### -`errors : Object`

> All the errors, in the form `{ field1: <string>, field2: <string> }`

##### -`handleBlur(field:string) : Function`

> Returns a `handleBlur` function for the field passed.

##### -`handleChange(field:string) : Function`

> Returns a `handleChange` function for the field passed.

##### -`handleSubmit : Function`

> a function meant to be passed to `<form onSubmit={handleSubmit}>` or to `<button onClick={handleSubmit}>`.
It will run validation, both sync and async, and, if the form is valid, it will call `this.props.onSubmit(data)`
with the contents of the form data.

> Optionally, you may also pass your `onSubmit` function to `handleSubmit` which will take the place of the 
`onSubmit` prop. For example: `<form onSubmit={handleSubmit(this.save.bind(this))}>`

##### -`initializeForm(data:Object) : Function`

> Initializes the form data to the given values. All `dirty` and `pristine` state will be determined by
comparing the current data with these initialized values.

##### -`invalid : boolean`

> `true` if the form has validation errors. Opposite of `valid`.

##### -`pristine: boolean`

> `true` if the form data is the same as its initialized values. Opposite of `dirty`.

##### -`resetForm() : Function`

> Resets all the values in the form to the initialized state, making it pristine again.

##### -`formKey : String`

> The same `formKey` prop that was passed in. See [Editing Multiple Records](#editing-multiple-records).

##### -`submitting : boolean`

> Whether or not your form is currently submitting. This prop will only work if you have passed an
`onSubmit` function that returns a promise. It will be true until the promise is resolved or rejected.

##### -`touch(...field:string) : Function`

> Marks the given fields as "touched" to show errors.

##### -`touched : Object`

> the touched flags for each field, in the form `{ field1: <boolean>, field2: <boolean> }`

##### -`touchAll() : Function`

> Marks all fields as "touched" to show errors. should be called on form submission.

##### -`untouch(...field:string) : Function`

> Clears the "touched" flag for the given fields

##### -`untouchAll() : Function`

> Clears the "touched" flag for the all fields

##### -`valid : boolean`

> `true` if the form passes validation (has no validation errors). Opposite of `invalid`.

### Action Creators

`redux-form` exports all of its internal action creators, allowing you complete control to dispatch any action
you wish. However, **it is *highly* recommended that you use the actions passed as props to your component
for most of your needs.**

##### -`blur(form:String, field:String, value:String)`

> Saves the value and, if you have `touchOnBlur` enabled, marks the field as `touched`.

##### -`change(form:String, field:String, value:String)`

> Saves the value and, if you have `touchOnChange` enabled, marks the field as `touched`.

##### -`initialize(form:String, data:Object)`

> Sets the initial values in the form with which future data values will be compared to calculate
`dirty` and `pristine`. The `data` parameter should only contain `String` values.

##### -`initializeWithKey(form:String, formKey, data:Object)`

> Used when editing multiple records with the same form component. See
[Editing Multiple Records](#editing-multiple-records).

##### -`reset(form:String)`

> Resets the values in the form back to the values past in with the most recent `initialize` action.

##### -`startAsyncValidation(form:String)`

> Flips the `asyncValidating` flag `true`.

##### -`stopAsyncValidation(form:String, errors:Object)`

> Flips the `asyncValidating` flag `false` and populates `asyncErrors`.

##### -`touch(form:String, ...fields:String)`

> Marks all the fields passed in as `touched`.

##### -`untouch(form:String, ...fields:String)`

> Resets the 'touched' flag for all the fields passed in.

## Working Demo

Check out the 
[react-redux-universal-hot-example project](https://github.com/erikras/react-redux-universal-hot-example) to see 
`redux-form` in action.

This is an extremely young library, so the API may change. Comments and feedback welcome.
