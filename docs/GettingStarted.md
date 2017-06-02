# Getting Started With `redux-form`

The basic implementation of `redux-form` is simple. However, to make the most of it, it's recommended to have basic knowledge on:
* [Redux](http://redux.js.org/) state container,
* [React](https://facebook.github.io/react/) and [Higher Order Components (HOCs)](https://facebook.github.io/react/docs/higher-order-components.html).

## Overview

To connect your React form components to your Redux store you'll need following pieces:

* Redux Reducer: `formReducer`,
* React HOCs: `reduxForm()` and `<Field/>`.

It's important to understand their responsibilities. Take a look at the table below:

|               | type      | responsibility |
|---------------|-----------|----------------|
| `formReducer` | *reducer* | function that tells how to update the Redux store based on changes coming from the application; those changes are described by Redux actions | 
| `reduxForm()` | *HOC*     | function that takes configuration object and returns a new function; use it to wrap your `form` component and bind user interaction to dispatching of Redux actions | 
| `<Field/>`    | *HOC*     | component that lives inside your wrapped `form` component; use it to connect the input components to the `redux-form` logic |

## Data flow

Take a look at the simplified diagram below. Note that in most cases you don't need to worry about the [action creators](http://redux-form.com/6.7.0/docs/api/ActionCreators.md/) for yourself, as they're already bound to dispatch for certain actions.

<div style="text-align: center;">
  <img src="https://cloud.githubusercontent.com/assets/5114422/26726540/c2f60e8c-47a3-11e7-8dd4-13ebd00d656a.png" width="500" style="max-width: 100%;"/>
</div>

The flow is pretty simple. Let's go through a simple example:
* User clicks on the text input wrapped with `<Field/>` component,
* Form component wrapped with `reduxForm()` dispatches an action,
* `formReducer` updates the corresponding state slice,
* the state slice is then passed back to the input component.

With `redux-form` comes a lot more functionalities like validation and formatting handlers, various properties and action creators. This guide describes the basic usage – feel free to dig deeper.

## Basic Usage Guide

### Step 1 of 4: Form reducer

Your store should know how to handle actions coming from the wrapped form components. To enable this, we add a `formReducer` reducer to your store. It serves for **all your form components**, so you only have to pass it once.

```js
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  // ...your other reducers here
  form: formReducer // passing formReducer under 'form' key, see the note below
})

const store = createStore(rootReducer)
```

**NOTE:** The key used to pass the `redux-form` reducer should be named* **`form`**. If you need a custom key for some reason see [`getFormState` config](http://redux-form.com/6.7.0/docs/api/ReduxForm.md/#-getformstate-function-optional-) for more details.

Now your store knows how to handle actions coming from the form components.

### Step 2 of 4: Form component

To make your form component interact with the store, we need to wrap it with `reduxForm()` HOC. This provides your component with information about form state and function to submit your form.

```js
import React from 'react';
import { Field, reduxForm } from 'redux-form';

const ContactForm = props => {
	const { handleSubmit } = props
	return (
		<form onSubmit={ handleSubmit }>
			{ /* form body*/ }
		</form>
	)
}

ContactForm = reduxForm({
  form: 'contact' // a unique name for this form
})(ContactForm)

export default ContactForm;
```

If the `()()` syntax confuses you, we can break it down into two steps:

```js
// ...

// Create new, "configured" function
createReduxForm = reduxForm({ form: 'contact' }) // a unique name for this form

// Evaluate it for ContactForm component
ContactForm = createReduxForm( ContactForm )

export default ContactForm;
```

### Step 3 of 4: Form `<Field/>` Components

Each input component must be placed inside the `component` prop of a `Field` component. The `Field`
component will pass props such as `value`, `onChange`, `onBlur`, etc. to the `React.DOM.input` 
component to populate its value and listen for changes.
  
```js
import React from 'react';
import { Field, reduxForm } from 'redux-form';

const ContactForm = props => {
	const { handleSubmit } = props
	return (
		<form onSubmit={ handleSubmit }>
			<div>
				<label htmlFor="firstName">First Name</label>
				<Field name="firstName" component="input" type="text" />
			</div>
			<div>
				<label htmlFor="lastName">Last Name</label>
				<Field name="lastName" component="input" type="text" />
			</div>
			<div>
				<label htmlFor="email">Email</label>
				<Field name="email" component="input" type="email" />
			</div>
			<button type="submit">Submit</button>
		</form>
	)
}

ContactForm = reduxForm({
  form: 'contact' // a unique name for this form
})(ContactForm)

export default ContactForm;
```

### Step 4 of 4: Reacting to submit
 
* Do something with the data that has been submitted. It will be passed as JSON to your `onSubmit`
function.

```js
import React from 'react'
import ContactForm from './ContactForm'

class ContactPage extends React.Component {
  submit = (values) => {
    // Do something with the form values
    console.log(values)
  }
  render() {
    return (
      <ContactForm onSubmit={this.submit} />
    )
  }
}
```
* Potentially set the form values initially, with the `initialValues` prop.

If you're starting out with `redux-form`, a good place to continue learning about how to connect
up the inputs to `redux-form` would be the [Simple Form Example](https://redux-form.com/6.7.0/examples/simple).
