# `v5` → `v6` Migration Guide

`redux-form` has been _completely_ rewritten for `v6`, because of a fundamental design change.

## Inversion of Control

In `v5`, only the outer form component was connected to the Redux state, and the props for each 
field were passed in via the form component. The problem with this is that the _entire_ form 
component had to rerender _on every single keypress_ that changed a form value. This was fine for
small login forms, but lead to extremely slow performance on larger forms with dozens or hundreds
of fields.

**In `v6`, every single field is connected to the Redux store.** The outer form component is also
connected, but is connected in such a manner that does not require it to refresh every time a 
value changes.

Because of this inversion of control, **there is no incremental upgrade path**. I would love to 
provide new API and provide deprecation warnings on the old API, but there is just no path from 
here to there that allows for such a transition.

The `v6` `Field` API was designed, however, in such a way as to minimize the migration pains. 
This document will outline the minimum migration distance from `v5` to `v6`.

## Goodbye `fields`... Hello `Field`!

In `v5`, you were required to provide an array of `fields` names, and then a `fields` object prop 
was provided to your decorated component. The mechanism that generates the props (`value`,
`onChange`, `onBlur`, etc.) for your input from the string name of your field is the new `Field` 
component.

#### `v5`

```js
import React, { Component } from 'react'
import { reduxForm } from 'redux-form'

class MyForm extends Component {
  render() {

    const { fields: { username, password }, handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="username">Username</label>
          <div>
            <input type="text" {...username}/>
            {username.touched &&
             username.error &&
             <span className="error">{username.error}</span>}
          </div>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div>
            <input type="password" {...password}/>  // Duplicating same code as above
            {password.touched &&                    // except for "type" prop
             password.error &&
             <span className="error">{password.error}</span>}
          </div>
        </div>
        
        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default reduxForm({
  form: 'myForm',
  fields: [ 'username', 'password' ]
})(MyForm)
```

#### `v6`

```js
import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form' // imported Field

const renderInput = field =>   // Define stateless component to render input and errors
  <div>
    <input {...field.input}/>  // No type specified. That is specified below in <Field>
    {field.meta.touched &&
     field.meta.error &&
     <span className="error">{field.meta.error}</span>}
  </div>

class MyForm extends Component {
  render() {

    const { handleSubmit } = this.props       // No fields prop

    return (
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="username">Username</label>
          <Field
            name="username"                   // Specify field name
            component={renderInput}           // Specify render component above
            type="text"/>                     // "type" prop will get forwarded to <input>
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <Field
            name="username"                   // Specify field name
            component={renderInput}           // Reuse same render component
            type="password"/>                 // type prop will get forwarded to <input>
        </div>

        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default reduxForm({
  form: 'myForm'
                                              // no fields array given
})(MyForm)
```

In `v5` the field name strings were all bundled together as input and the field objects came out
bundled together as output (of `redux-form`), and now, in `v6`, the conversion from field name to 
field object is done one at a time at the location of each field.

## `handleSubmit` and `onSubmit`

The only thing that has changed about form submission is that your submit validation 
errors must now be wrapped in a `SubmissionError` object. This is to distinguish between 
validation errors and AJAX or server errors.
[See discussion on PR #602](https://github.com/erikras/redux-form/pull/602)

#### `v5`

```js
<MyForm onSubmit={values =>
  ajax.send(values) // however you send data to your server...
    .catch(error => {
      // how you pass server-side validation errors back is up to you
      if(error.validationErrors) {
        return Promise.reject(error.validationErrors)
      } else {
        // what you do about other communication errors is up to you
        reportServerError(error)
      }
    })
}/>
```

#### `v6`

```js
<MyForm onSubmit={values =>
  ajax.send(values)
    .catch(error => {
      if(error.validationErrors) {
        throw new SubmissionError(error.validationErrors) // <----- only difference
      } else {
        reportServerError(error)
      }
    })
}/>
```

## `mapStateToProps` and `mapDispatchToProps`

In `v5`, the `reduxForm()` decorator allowed these parameters to be given and it passed them 
along to `react-redux`'s `connect()` API.

`v6` no longer does this. You will need to separately decorate your form component with `connect()`
yourself if you need to access other values in the Redux store or bind action creators to 
`dispatch`.

## Sync Validation

Sync validation is exactly the same as in `v5`. The only small difference is that if you are 
using ImmutableJS, the `values` given to your sync validation function will be an an
`Immutable.Map`. The errors returned, however, should be a in a plain JS object, like always.

## Initialization with `initialValues`

Nothing has changed with this, apart from fixing some pesky bugs like 
[#514](https://github.com/erikras/redux-form/issues/514),
[#621](https://github.com/erikras/redux-form/issues/621),
[#628](https://github.com/erikras/redux-form/issues/628), and
[#756](https://github.com/erikras/redux-form/issues/756). In `v6`, each field will have its 
initial value on the very first render.

## Async Validation

No changes. Works exactly like `v5`.

## Deep Fields

There is no mystery to deep fields in `v6`. You simply use dot-syntax on your field name.

#### `v5`

```js
render() {
  const { 
    fields: {
      contact: {
        shipping: { street }
      }
    }
  } = this.props
  return (
    <div>
      <input type="text" {...street}/>
    </div>
  )  
}
```

#### `v6`

```js
render() {
  return (
    <div>
      <Field name="contact.shipping.street" component="input" type="text"/>
    </div>
  )
}
```

## Field Arrays

To get the field array object that was passed as a prop to the whole form in `v5`, you must use 
the `FieldArray` component, much like the `Field` component is used.

#### `v5`

```js
render() {
  const { fields: { awards } } = this.props;
  return (
    <div>
      <ul>
        {awards.map((award, index) => <li key={index}>
          <label htmlFor="award">Award #{index + 1}</label>
          <input type="text" {...award.input}/>
        </li>)}
      </ul>
      <button onClick={() => awards.addField()}>Add Award</button>
    </div>
  )
}
```

#### `v6`

```js
const renderAwards = ({ fields }) =>
  <div>
    <ul>
      {fields.map((name, index) => <li key={index}>
        <label htmlFor={name}>Award #{index + 1}</label>
        <Field name={name} type="text" component="input"/>
      </li>)}
    </ul>
    <button onClick={() => fields.push()}>Add Award</button>
  </div>
      
render() {
  return (
    <div>
      <FieldArray name="awards" component={renderAwards}/>
    </div>
  )
}
```

## Normalization

In `v6`, normalization has moved from the reducer to the field level.

#### `v5`

```js
const upper = value => value && value.toUpperCase()

const reducer = combineReducers({
  // other reducers
  form: form.normalize({
    myForm: {
      myUppercaseField: upper
    }
  })
});
```

#### `v6`

```js
const upper = value => value && value.toUpperCase()

...

<Field name="myUppercaseField" component="input" normalize={upper}/>
```

See the [Normalizing Example](http://redux-form.com/6.0.0-rc.4/examples/normalizing/) for 
more details.

## Listening to other actions

The `plugin()` API is identical to that of `v5`. However, the internal structure of the form 
state _has_ changed, so your plugin reducer that was modifying it will need to be updated. It 
more or less changed as follows:

#### `v5`

```js
{
  myField: {
    value: 'myValue',
    initial: 'myInitialValue',
    asyncError: 'myAsyncError',
    submitError: 'mySubmitError',
    touched: true,
    visited: true
  }
}
```

#### `v6`

```js
{
  values: {
    myField: 'myValue'
  },
  initial: {
    myField: 'myInitialValue'
  },
  asyncErrors: {
    myField: 'myAsyncError'
  },
  submitErrors: {
    myField: 'mySubmitError'
  },
  fields: {
    myField: {
      touched: true,
      visited: true
    }
  }
}
```