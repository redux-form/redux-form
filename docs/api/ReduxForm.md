# `reduxForm(config:Object)`

Creates a decorator with which you use `redux-form` to connect your form component to Redux.
It takes a `config` parameter which lets you configure your form.

## Importing

```javascript
var reduxForm = require('redux-form').reduxForm;  // ES5
```
```javascript
import { reduxForm } from 'redux-form';  // ES6
```

## Config Properties

**IMPORTANT: All of these configuration options may be passed into `reduxForm()` at "design time"
or passed in as props to your component at runtime.**

### Required

#### `form : String` [required]

> the name of your form and the key to where your form's state will be mounted under the
`redux-form` reducer

### Optional

#### -`asyncBlurFields : Array<String>` [optional]

> field names for which `onBlur` should trigger a call to the `asyncValidate` function.
Defaults to `[]`.

> See [Asynchronous Blur Validation Example](http://redux-form.com/6.0.0-rc.4/examples/asyncValidation/)
for more details.

#### `asyncValidate : (values:Object, dispatch:Function, props:Object) => Promise<undefined, errors:Object>` [optional]

> a function that takes all the form values, the `dispatch` function, and the `props` given
to your component, and 
returns a Promise that will resolve if the validation is passed, or will reject with an
object of validation errors
in the form `{ field1: <String>, field2: <String> }`.

> See [Asynchronous Blur Validation Example](http://redux-form.com/6.0.0-rc.4/examples/asyncValidation/)
for more details.

#### `destroyOnUnmount : boolean` [optional]

> Whether or not to automatically destroy your form's state in the Redux store when your
component is unmounted. Defaults to `true`.

#### `enableReinitialize : boolean` [optional]

> When set to `true`, the form will reinitialize every time the `initialValues` prop changes.
Defaults to `false`.

#### `getFormState : Function` [optional]

> A function that takes the entire Redux state and returns the state slice which corresponds to 
where the `redux-form` reducer was mounted. This functionality is rarely needed, and defaults to
assuming that the reducer is mounted under the `form` key.

#### `initialValues : Object<String, String>` [optional]

> The values with which to initialize your form in `componentWillMount()`.
The values should be in the form `{ field1: 'value1', field2: 'value2' }`.

#### `onSubmit : Function` [optional]

> The function to call with the form data when the `handleSubmit()` is fired from within the
form component. If you do not specify it as a prop here, you must pass it as a parameter to
`handleSubmit()` inside your form component.

> If your `onSubmit` function returns a promise, the `submitting` property will be set to
`true` until the promise has been resolved or rejected. If it is rejected with a
`redux-form` `SubmissionError` containing errors in the form
`{ field1: 'error', field2: 'error' }` then the submission errors will be added to each field
(to the `error` prop) just like async validation errors are. If there is an error that is not
specific to any field, but applicable to the entire form, you may pass that as if it were the
error for a field
called `_error`, and it will be given as the `error` prop.

#### `onSubmitFail : Function` [optional]

> A callback function that will be called when a submission fails for whatever reason. It will be
called with the following parameters:

> ##### `errors : Object`

> The errors that caused the submission to fail.

> ##### `dispatch : Function`

> The Redux `dispatch` function.

#### `onSubmitSuccess : Function` [optional]

> A callback function that will be called when a submission succeeds.  It will be called with the
following parameters:
                                                                      
> ##### `result : Object`

> Any result that `onSubmit` has returned

> ##### `dispatch : Function`

> The Redux `dispatch` function.

#### `propNamespace : String` [optional]

> If specified, all the props normally passed into your decorated component directly will be passed
under the key specified. Useful if using other decorator libraries on the same component to avoid
prop namespace collisions.

#### `shouldAsyncValidate(params) : boolean` [optional]

> An optional function you may provide to have full control over when async validation happens.
Your `shouldAsyncValidate()` function will be given an object with the following values:

> ##### `asyncErrors : Object` [optional]

> Any existing asynchronous validation errors

> ##### `initialized : boolean` [required]

> `true` if the form has ever been initialized with initial values

> ##### `trigger : String` [required]

> The reason to possibly run async validation. It will either be: `'blur'` or `'submit'`, 
depending on whether an async blur field had triggered the async validation or if submitting the 
form has triggered it, respectively.

> ##### `blurredField : string` [optional]

> The name of the field that has triggered the async validation. May be `undefined`.

> ##### `pristine : boolean` [required]

> `true` if the form is pristine, `false` if it is dirty

> ##### `syncValidationPasses : boolean` [required]

> `true` if synchronous validation is passing, `false` if it is failing.

> The default behavior is:

> ```js
  if(!syncValidationPasses) {
    return false
  }
  switch(trigger) {
    case 'blur':
      // blurring
      return true
    case 'submit':
      // submitting, so only async validate if form is dirty or was never initialized
      // conversely, DON'T async validate if the form is pristine just as it was initialized
      return !pristine || !initialized
    default:
      return false
  }
```

#### `touchOnBlur : boolean` [optional]

> marks fields as `touched` when the blur action is fired. Defaults to `true`.

#### `touchOnChange : boolean` [optional]

> marks fields as `touched` when the change action is fired. Defaults to `false`.

#### `validate : (values:Object, props:Object) => errors:Object` [optional]

> a synchronous validation function that takes the form values and props passed into your component.
If validation passes, it should return `{}`. If validation fails, it should return the validation errors in the
form `{ field1: <String>, field2: <String> }`. Defaults to `(values, props) => ({})`.

> See [Synchronous Validation Example](http://redux-form.com/6.0.0-rc.4/examples/syncValidation/)
for more details.

## Instance API

The following are methods or properties that you can access on an instance of your decorated form
component.

#### `dirty : boolean`

`true` when the current form values are different from the `initialValues`, `false` otherwise.

#### `invalid : boolean`

`true` when the form is invalid (has validation errors), `false` otherwise.

#### `pristine : boolean`

`true` when the current form values are the same as the `initialValues`, `false` otherwise.

#### `registeredFields : Array`

An array of objects with fields `name` and `type` for each field representing all the fields in the form. Mainly useful for testing.

#### `reset() : void`

Resets the form to the `initialValues`. It will be `pristine` after reset.

#### `submit() : Promise`

Submits the form. [You'd never have guessed that, right?] Returns a promise that will be resolved 
when the form is submitted successfully, or rejected if the submission fails.

#### `valid : boolean`

`true` when the form is valid (has no validation errors), `false` otherwise.

#### `values : Object`

The current values of all the fields in the form.

#### `wrappedInstance : ReactElement`

A reference to the instance of the component you decorated with `reduxForm()`. Mainly useful for 
testing.

