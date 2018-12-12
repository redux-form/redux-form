# Getting Started With `redux-form`

The basic implementation of `redux-form` is simple. However, to make the most of
it, it's recommended to have basic knowledge on:

- [Redux](http://redux.js.org/) state container,
- [React](https://facebook.github.io/react/) and
  [Higher-Order Components (HOCs)](https://facebook.github.io/react/docs/higher-order-components.html).

## Overview

To connect your React form components to your Redux store you'll need the following
pieces from the `redux-form` package:

- Redux Reducer: `formReducer`,
- React HOC `reduxForm()` and `<Field/>` component.

It's important to understand their responsibilities:

|               | type        | responsibility                                                                                                                                                   |
| ------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formReducer` | _reducer_   | function that tells how to update the Redux store based on changes coming from the application; those changes are described by Redux actions                     |
| `reduxForm()` | _HOC_       | function that takes configuration object and returns a new function; use it to wrap your `form` component and bind user interaction to dispatch of Redux actions |
| `<Field/>`    | _component_ | component that lives inside your wrapped `form` component; use it to connect the input components to the `redux-form` logic                                      |

## Data flow

The diagram below represents the simplified data flow. Note that in most cases
you don't need to worry about the
[action creators](http://redux-form.com/8.0.4/docs/api/ActionCreators.md/) for
yourself, as they're already bound to dispatch for certain actions.

<div style="text-align: center;">
  <img src="https://github.com/erikras/redux-form/raw/master/docs/reduxFormDiagram.png" width="500" style="max-width: 100%;"/>
</div>

Let's go through a simple example. We have a form component wrapped with
`reduxForm()`. There is one text input inside, wrapped with `<Field/>`. The data
flows like this:

1.  User clicks on the input,
2.  "Focus action" is dispatched,
3.  `formReducer` updates the corresponding state slice,
4.  The state is then passed back to the input.

Same goes for any other interaction like filling the input, changing its state
or submitting the form.

With `redux-form` comes a lot more: hooks for validation and formatting
handlers, various properties and action creators. This guide describes the basic
usage – feel free to dig deeper.

## Basic Usage Guide

### Step 1 of 4: Form reducer

The store should know how to handle actions coming from the form components. To
enable this, we need to pass the `formReducer` to your store. It serves for
**all of your form components**, so you only have to pass it once.

```js
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass formReducer under 'form' key,
  // for custom keys look up the docs for 'getFormState'
  form: formReducer
})

const store = createStore(rootReducer)
```

Now your store knows how to handle actions coming from the form components.

**NOTE:** The key used to pass the `redux-form` reducer should be named
**`form`**. If you need a custom key for some reason see
[`getFormState` config](http://redux-form.com/8.0.4/docs/api/ReduxForm.md/#-getformstate-function-optional-)
for more details.

### Step 2 of 4: Form component

To make your form component communicate with the store, we need to wrap it with
`reduxForm()`. It will provide the props about the form state and function to
handle the submit process.

```js
import React from 'react'
import { Field, reduxForm } from 'redux-form'

let ContactForm = props => {
  const { handleSubmit } = props
  return <form onSubmit={handleSubmit}>{/* form body*/}</form>
}

ContactForm = reduxForm({
  // a unique name for the form
  form: 'contact'
})(ContactForm)

export default ContactForm
```

Once we have the form component ready, it's time to add some inputs.

**NOTE**: If the `()()` syntax seems confusing, you can always break it down
into two steps:

```js
// ...

// create new, "configured" function
createReduxForm = reduxForm({ form: 'contact' })

// evaluate it for ContactForm component
ContactForm = createReduxForm(ContactForm)

export default ContactForm
```

### Step 3 of 4: Form `<Field/>` Components

The `<Field/>` component connects each input to the store. The basic usage goes
as follows:

```js
<Field name="inputName" component="input" type="text" />
```

It creates an HTML `<input/>` element of type `text`. It also passes additional
props such as `value`, `onChange`, `onBlur`, etc. Those are used to track and
maintain the input state under the hood.

**NOTE**: `<Field/>` component is much more powerful. Apart from basic input
types, it can take a class or a stateless component. When you're ready, go to
the [docs](http://redux-form.com/8.0.4/docs/api/Field.md/#usage) to find out
more.

Let's finish up our contact form:

```js
import React from 'react'
import { Field, reduxForm } from 'redux-form'

let ContactForm = props => {
  const { handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
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
  // a unique name for the form
  form: 'contact'
})(ContactForm)

export default ContactForm
```

From now on, the store should be populated based on actions coming from your
form component. We can now handle the submission.

### Step 4 of 4: Reacting to submit

The submitted data is passed as JSON object to your `onSubmit` function. Let's
`console.log` it out:

```js
import React from 'react'
import ContactForm from './ContactForm'

class ContactPage extends React.Component {
  submit = values => {
    // print the form values to the console
    console.log(values)
  }
  render() {
    return <ContactForm onSubmit={this.submit} />
  }
}
```

You can now take it from here. We recommend to check out the
[examples](http://redux-form.com/8.0.4/examples/). The common next steps could
also be:

- setting the
  [initial form values](http://redux-form.com/8.0.4/examples/initializeFromState/),
- implementing the
  [validation](http://redux-form.com/8.0.4/examples/syncValidation/),
- creating dynamic forms with
  [arrays of fields](http://redux-form.com/8.0.4/examples/fieldArrays/).
