---
id: usage-guide
title: Usage Guide
sidebar_label: Usage Guide
---

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
[`getFormState` config](https://redux-form.com/8.2.2/docs/api/ReduxForm.md/#-getformstate-function-optional-)
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
the [docs](https://redux-form.com/8.2.2/docs/api/Field.md/#usage) to find out
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
[examples](https://redux-form.com/8.2.2/examples/). The common next steps could
also be:

- setting the
  [initial form values](https://redux-form.com/8.2.2/examples/initializeFromState/),
- implementing the
  [validation](https://redux-form.com/8.2.2/examples/syncValidation/),
- creating dynamic forms with
  [arrays of fields](https://redux-form.com/8.2.2/examples/fieldArrays/).
