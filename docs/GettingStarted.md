# Getting Started With `redux-form`

`redux-form` primarily consists of two things: a Redux reducer and a React component decorator.

The reducer listens to dispatched actions from the component to maintain your state in Redux.

The `reduxForm()` decorator decorates a component to enable it as a form. This will 
create two nested Higher Order Components (HOCs) that will wrap your component: `ReduxFormConnector`
connects to Redux and `ReduxForm` handles all the dispatching and provides information to your component.

## Implementation Guide

### Step #1

The first thing that you have to do is to give the `redux-form` reducer to Redux. You will only have to do 
this once, no matter how many form components your app uses.

```js
import {createStore, combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
const reducers = {
  // ... your other reducers here ...
  form: formReducer     // <---- Mounted at 'form'. See note below.
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```

If you're okay with mounting `redux-form` at `form`, skip to __Step #2__.

__NOTE:__ The default mount point for `redux-form` is at `form`. The only good reason to mount it somewhere else is 
if you already have a reducer mounted at `form` that you cannot move. Since Redux is still so young, it seems 
unlikely that you have a legacy Redux application that has fixed reducer mount points, but if you absolutely must 
move it, `redux-form` will let you do that. See the 
[Alternate Redux Mount Point Example](http://redux-form.com/4.2.0/#/examples/alternate-mount-point) for details.

### Step #2

Decorate your form component with `reduxForm()`. This will provide your component with `props` allowing you to attach
your inputs to `redux-form`.
  
```js
import React, {Component} from 'react';
import {reduxForm} from 'redux-form';

class ContactForm extends Component {
  render() {
    const {fields: {firstName, lastName, email}, handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input type="text" placeholder="First Name" {...firstName}/>
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" placeholder="Last Name" {...lastName}/>
        </div>
        <div>
          <label>Email</label>
          <input type="email" placeholder="Email" {...email}/>
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

ContactForm = reduxForm({ // <----- THIS IS THE IMPORTANT PART!
  form: 'contact',                           // a unique name for this form
  fields: ['firstName', 'lastName', 'email'] // all the fields in your form
})(ContactForm);

export default ContactForm;
```

That's it! There is no Step #3!

If you're starting out with `redux-form`, a good place to continue learning about how to connect up the
inputs to `redux-form` would be the [Simple Form Example](http://redux-form.com/4.2.0/#/examples/simple).
