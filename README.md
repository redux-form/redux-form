#redux-form
---
[![NPM Version](https://img.shields.io/npm/v/redux-form.svg?style=flat-square)](https://www.npmjs.com/package/redux-form) 
[![NPM Downloads](https://img.shields.io/npm/dm/redux-form.svg?style=flat-square)](https://www.npmjs.com/package/redux-form)
[![Build Status](https://img.shields.io/travis/erikras/redux-form/master.svg?style=flat-square)](https://travis-ci.org/erikras/redux-form)
[![devDependency Status](https://david-dm.org/erikras/redux-form/dev-status.svg)](https://david-dm.org/erikras/redux-form#info=devDependencies)
[![redux-form channel on slack](https://img.shields.io/badge/slack-redux--form%40reactiflux-blue.svg)](http://www.reactiflux.com)

`redux-form` works with [React Redux](https://github.com/gaearon/react-redux) to enable an html form in [React](https://github.com/facebook/react) to use [Redux](https://github.com/gaearon/redux) to store all of its state.

## Installation

```
npm install --save redux-form
```

## Benefits

Why would anyone want to do this, you ask? React a perfectly good way of keeping state in each component! The reasons are threefold.

#### Unidirectional Data Flow

For the same reason that React and Flux is superior to Angular's bidirectional data binding. Tracking down bugs is much simpler when the data all flows through one dispatcher.

#### Redux Dev Tools

When used in conjunction with [Redux Dev Tools](https://github.com/gaearon/redux-devtools), you can fast forward and rewind through your form data entry to better find bugs.

#### Stateless Components

By removing the state from your form components, you inherently make them easier to understand, test, and debug. The React philosophy is to always try to use `props` instead of `state` when possible.

## How it works

When you are adding your reducers to your redux store, add a new one with `createFormReducer(])`.

```javascript
import { createStore, combineReducers } from 'redux';
import { createFormReducer } from 'redux-form';
const reducers = {
  // ... your other reducers here ...
  createFormReducer('contactForm', ['name', 'address', 'phone'])
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```

`reduxForm()` creates a Higher Order Component that expects a `dispatch` prop and a slice of the Redux store where its data is stored as a `form` prop. These should be provided by [React Redux](https://github.com/gaearon/react-redux)'s `connect()` function.

Let's look at an example:

Then, on your form component, add the `@reduxForm('contactForm')` decorator.

```javascript
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import reduxForm from 'redux-form';
import contactValidation from './contactValidation';

class ContactForm extends Component {
  // you don't need all to define all these props,
  // only the ones you intend to use
  static propTypes = {
    data: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    touch: PropTypes.func.isRequired,
    touched: PropTypes.object.isRequired,
    touchAll: PropTypes.func.isRequired,
    untouch: PropTypes.func.isRequired,
    untouchAll: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired
  }
  
  render() {
    const {
      data: {name, address, phone},
      errors: {name: nameError, address: addressError, phone: phoneError},
      touched: {name: nameTouched, address: addressTouched, phone: phoneTouched},
      handleBlur,
      handleChange,
      handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" 
               value={name} 
               onChange={handleChange('name')} 
               onBlur={handleBlur('name')}/>
        {nameError && nameTouched ? <div>{nameError}</div>}
        
        <label>Address</label>
        <input type="text" 
               value={address} 
               onChange={handleChange('address')} 
               onBlur={handleBlur('address')}/>
        {addressError && addressTouched ? <div>{addressError}</div>}
        
        <label>Phone</label>
        <input type="text" 
               value={phone} 
               onChange={handleChange('phone')} 
               onBlur={handleBlur('phone')}/>
        {phoneError && phoneTouched ? <div>{phoneError}</div>}
        
        <button onClick={handleSubmit}>Submit</button>
      </form>
    );
  }
}

// apply reduxForm() and include synchronous validation
ContactForm = reduxForm('contactForm', contactValidation)(ContactForm);

// ------- HERE'S THE IMPORTANT BIT -------
function mapStateToProps(state) {
  return { form: state.contactForm };
}
// apply connect() to bind it to Redux state
ContactForm = connect(mapStateToProps)(ContactForm);

// export the wrapped component
export default ContactForm;
```

Notice that we're just using vanilla `<input>` elements there is no state in the `ContactForm` component. I have left handling `onSubmit` as an exercise for the reader. Hint: your data is in `this.props.data`.

#### Binding Action Creators

If your form component also needs other redux action creators - _and it probably does since you need to submit somehow_ - you cannot simply use the default `bindActionCreators()` from `redux`, because that will remove `dispatch` from the props the `connect()` passes along, and `reduxForm` needs `dispatch`. You will need to also include `dispatch` in your `mapDispatchToProps()` function. Like so:

```javascript
import {bindActionCreators} from `redux`;

...

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

ContactForm = connect(mapStateToProps, mapDispatchToProps)(ContactForm);
```

to:

```javascript
import {bindActionCreators} from `redux`;

...

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(actionCreators, dispatch),
    dispatch
  };
}

ContactForm = connect(mapStateToProps, mapDispatchToProps)(ContactForm);
```

### ES7 Decorator Sugar

Using [ES7 decorator proposal](https://github.com/wycats/javascript-decorators), the example above
could be written as:

```javascript
@connect(state => ({ form: state.contactForm }))
@reduxForm('contactForm', contactValidation)
export default class ContactForm extends Component {
```

Much nicer, don't you think?

You can enable it with [Babel stage 2](http://babeljs.io/docs/usage/experimental/).  
Note that decorators are experimental, and this syntax might change or be removed later.

## Synchronous Validation

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
ContactForm = reduxForm('contactForm', contactValidation)(ContactForm);
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
ContactForm = reduxForm('contactForm', contactValidation)
  .async(asyncValidation)(ContactForm);
```

Optionally, if you want asynchronous validation to be triggered when one or more of your form
fields is blurred, you may pass those fields to the `async()` function along with the asynchronous
validation function. Like so:
```javascript
ContactForm = reduxForm('contactForm', contactValidation)
  .async(asyncValidation, 'name', 'phone')(ContactForm);
```
With that call, the asynchronous validation will be called when either `name` or `phone` is blurred.
*Assuming that they have their `onBlur={handleBlur('name')}` properties properly set up.*

**NOTE!** If you _only_ want asynchronous validation, you may leave out the synchronous validation function.
And if you only want it to be run on submit, you may leave out the fields, as well.
```javascript
ContactForm = reduxForm('contactForm').async(asyncValidation)(ContactForm);
```

## API

Each form has a `sliceName`. That's the key in the Redux store tree where the data will be mounted.

### `createFormReducer(sliceName:string, fields:Array<string>, config:Object?)`

##### -`sliceName` : string

> the name of your form and the key to where your form's state will be mounted in the Redux store

##### - fields : Array&lt;string&gt;

> a list of all your fields in your form.

##### -`config`: Object [optional]

> some control over when to mark fields as "touched" in the form:

###### `config.touchOnBlur` : boolean [optional]

> marks fields to touched when the blur action is fired. defaults to `true`

###### `config.touchOnChange` : boolean [optional]

> marks fields to touched when the change action is fired. defaults to `false`

### `reduxForm(sliceName:string, validate:Function?)`

##### -`sliceName : string`

> the name of your form and the key to where your form's state will be mounted in the Redux store

##### -`validate : Function` [optional]

> your [synchronous validation function](#synchronous-validation). Defaults to `() => ({valid: true})`

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

##### -`initializeForm(data:Object) : Function`

> Initializes the form data to the given values. All `dirty` and `pristine` state will be determined by comparing the current data with these initialized values.

##### -`invalid : boolean`

> `true` if the form has validation errors. Opposite of `valid`.

##### -`pristine: boolean`

> `true` if the form data is the same as its initialized values. Opposite of `dirty`.

##### -`resetForm() : Function`

> Resets all the values in the form to the initialized state, making it pristine again.

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

## Submitting your form

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
        
        <ContactForm onSubmit={::this.handleSubmit}/>
      </div>
    );
  }
}

export default connect()(ContactPage);  // adds dispatch prop
```

## Responding to other actions

Part of the beauty of the flux architecture is that all the reducers (or "stores", in canonical Flux terminology) receive all the actions, and they can modify their data based on any of them. For example, say you have a login form, and when your login submission fails, you want to clear out the password field. Your login submission is part of another reducer/actions system, but your form can still respond.

Rather than just using the vanilla reducer function generated by `createFormReducer()`, you can augment it to do other things.

```javascript
import {createFormReducer} from 'redux-form';
import {AUTH_LOGIN_FAIL} from '../actions/actionTypes';
const loginFormReducer = createFormReducer('loginForm', ['email', 'password']);

export default function loginForm(state, action = {}) {
  switch (action.type) {
    case AUTH_LOGIN_FAIL:
      return {
        ...state,
        data: {
          ...state.data,
          password: ''
        }
      };
    default:
      return loginFormReducer(state, action);
  }
}
```

## Running Example

Check out the [react-redux-universal-hot-example project](https://github.com/erikras/react-redux-universal-hot-example) to see `redux-form` in action.

This is an extremely young library, so the API may change. Comments and feedback welcome.
