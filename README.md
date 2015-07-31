#redux-form


`@reduxForm` is an ES7 decorator to for enabling a form in [React](https://github.com/facebook/react) to use [Redux](https://github.com/gaearon/redux) to store all of 
its state.

## Installation

```
npm install --save redux-form
```

## Benefits

Why would anyone want to do this, you ask? React a perfectly good way of keeping state in each component! The reasons are twofold.

#### Hot Reloading

When used in conjunction with [React Hot Loader](https://github.com/gaearon/react-hot-loader), you can modify your components, rebuild your app and immediately see your changes ***without losing your form data***. This may seem trivial, but the minutes of refilling out forms in a development environment really add up.

#### Stateless Components

By removing the state from your form components, you inherently make them easier to understand, test, and debug. The React philosophy is to always try to use `props` instead of `state` when possible.

## How it works

When you are adding your reducers to your redux store, add a new one with `createFormReducer(])`.

```javascript
import { createStore, combineReducers } from 'redux';
import { createFormReducer } from 'redux-form';
const reducers = {
  // ... your other reducers here ...
  createFormReducer('contacts', ['name', 'address', 'phone'], contactValidation)
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```

Then, on your form component, add the `@reduxForm('contacts')` decorator.

```javascript
import React, {Component, PropTypes} from 'react';
import reduxForm from 'redux-form';

@reduxForm('contacts')
export default class ContactForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  }
  
  render() {
    const {
      data: {name, address, phone},
      errors: {name: nameError, address: addressError, phone: phoneError},
      handleChange
    } = this.props;
    return (
      <form>
        <label>Name</label>
        <input type="text" value={name} onChange={handleChange('name')}/>
        {nameError ? <div>{nameError}</div>}
        
        <label>Address</label>
        <input type="text" value={address} onChange={handleChange('address')}/>
        {addressError ? <div>{addressError}</div>}
        
        <label>Phone</label>
        <input type="text" value={phone} onChange={handleChange('phone')}/>
        {phoneError ? <div>{phoneError}</div>}
      </form>
    );
  }
}
```

Notice that we're just using vanilla `<input>` elements there is no state in the `ContactForm` component. I have left handling `onSubmit` as an excercise for the reader. Hint: your data is in `this.props.data`.

## Validation

You will need to supply your own validation function, which is in the form `({}) => {}` and takes in all your data and spits out error messages. For example:

```javascript
function contactValidation(data) {
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

## API

Each form has a `sliceName`. That's the key in the Redux store tree where the data will be mounted.

### createFormReducer(sliceName:string, fields:Array&lt;string&gt;, validate:Function)

##### -`sliceName` : string

> the name of your form and the key to where your form's state will be mounted in the Redux store

##### - fields : Array&lt;string&gt;

> a list of all your fields in your form.

##### - validation : Function

> your [validation function](#validation)

### @reduxForm(sliceName:string)

##### -`sliceName` : string

> the name of your form and the key to where your form's state will be mounted in the Redux store

## Running Example

Check out the [react-redux-universal-hot-example project](https://github.com/erikras/react-redux-universal-hot-example) to see `redux-form` in action.

This is an extremely young library, so the API may change. Comments and feedback welcome.
