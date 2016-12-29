# Selectors

[`View source on GitHub`](https://github.com/erikras/redux-form/tree/master/src/selectors)

`redux-form` provides a set of useful Redux state
[**selectors**](http://redux.js.org/docs/recipes/ComputingDerivedData.html) that may be used in
any part of your application to query the state of any of your forms.

All of the selectors listed below have the same usage pattern: they all take the name of the
form, and create a selector for whatever form state the selector is for.

```js
import {
  getFormValues,
  getFormSyncErrors,
  getFormAsyncErrors,
  getFormSubmitErrors,
  isDirty,
  isPristine,
  isValid,
  isInvalid,
  isSubmitting,
  hasSubmitSucceeded,
  hasSubmitFailed
} from 'redux-form'

MyComponent = connect(
  state => ({
    values: getFormValues('myForm')(state),
    syncErrors: getFormSyncErrors('myForm')(state),
    asyncErrors: getFormAsyncErrors('myForm')(state),
    submitErrors: getFormSubmitErrors('myForm')(state),
    dirty: isDirty('myForm')(state),
    pristine: isPristine('myForm')(state),
    valid: isValid('myForm')(state),
    invalid: isInvalid('myForm')(state),
    submitting: isSubmitting('myForm')(state),
    submitSucceeded: hasSubmitSucceeded('myForm')(state),
    submitFailed: hasSubmitFailed('myForm')(state)
  })
)(MyComponent)
```

## List of Selectors

### `getFormValues(formName:String)` returns `(state) => formValues:Object`

> Gets the form values. Shocking, right?

### `getFormSyncErrors(formName:String)` returns `(state) => formSyncErrors:Object`

> Returns the form synchronous validation errors.

### `getFormAsyncErrors(formName:String)` returns `(state) => formAsyncErrors:Object`

> Returns the form asynchronous validation errors.

### `getFormSubmitErrors(formName:String)` returns `(state) => formSubmitErrors:Object`

> Returns the form submit validation errors.

### `isDirty(formName:String)` returns `(state) => dirty:boolean`

> Returns `true` if the form is dirty, i.e. the values have been altered from the original
`initialValues` provided. The opposite of `isPristine`.

### `isPristine(formName:String)` returns `(state) => pristine:boolean`

> Returns `true` if the form is pristine, i.e. the values have NOT been altered from the original
`initialValues` provided. The opposite of `isDirty`.

### `isValid(formName:String)` returns `(state) => valid:boolean`

> Returns `true` if the form is valid, i.e. has no sync, async, or submission errors. The opposite
of `isInvalid`.

### `isInvalid(formName:String)` returns `(state) => invalid:boolean`

> Returns `true` if the form is invalid, i.e. has sync, async, or submission errors. The opposite
of `isValid`.

### `isSubmitting(formName:String)` returns `(state) => submitting:boolean`

> Returns `true` if the form is submitting.

### `hasSubmitSucceeded(formName:String)` returns `(state) => submitSucceeded:boolean`

> Returns `true` if the form has previously been successfully submitted.

### `hasSubmitFailed(formName:String)` returns `(state) => submitFailed:boolean`

> Returns `true` if the form has previously failed to submit.
