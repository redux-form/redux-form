# Getting Started With `redux-form`

`redux-form` primarily consists of three things: 

1. A Redux reducer that listens to dispatched `redux-form` actions to maintain your form state in
Redux.
2. A React component decorator that wraps your entire form in a Higher Order Component (HOC) and 
provides functionality via props.
3. A `Field` component to connect your individual field inputs to the Redux store.

## Implementation Guide

### Step #1

The first thing that you have to do is to give the `redux-form` reducer to Redux. You will only
have to do this once, no matter how many form components your app uses.

```js
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

const reducers = {
  // ... your other reducers here ...
  form: formReducer     // <---- Mounted at 'form'
}
const reducer = combineReducers(reducers)
const store = createStore(reducer)
```

### Step #2

Decorate your form component with `reduxForm()`. This will provide your component with props that
provide information about form state and functions to submit your form.

Each input component must be placed inside the `component` prop of a `Field` component. The `Field`
component will pass props such as `value`, `onChange`, `onBlur`, etc. to the `React.DOM.input` 
component to populate its value and listen for changes.
  
```js
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class ContactForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <Field name="firstName" component="input" type="text"/>
        </div>
        <div>
          <label>Last Name</label>
          <Field name="lastName" component="input" type="text"/>
        </div>
        <div>
          <label>Email</label>
          <Field name="email" component="input" type="email"/>
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

// Decorate the form component
ContactForm = reduxForm({
  form: 'contact' // a unique name for this form
})(ContactForm);

export default ContactForm;
```

### You're done!

Well, almost. You will still need to:
 
* Do something with the data that has been submitted. It will be passed as JSON to your `onSubmit`
function.
* Potentially set the form values initially, with the `initialValues` prop.

If you're starting out with `redux-form`, a good place to continue learning about how to connect
up the inputs to `redux-form` would be the
[Simple Form Example](http://redux-form.com/6.0.0-rc.1/examples/simple).
