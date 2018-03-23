# Selectors

[`View source on GitHub`](https://github.com/erikras/redux-form/tree/master/src/selectors)

`redux-form` provides a set of useful Redux state
[**selectors**](http://redux.js.org/docs/recipes/ComputingDerivedData.html) that may be used in
any part of your application to query the state of any of your forms.

All of the selectors listed below have the same usage pattern: they all (apart from
getFormNames) take the name of the form, and create a selector for whatever form state
the selector is for.

They also all take an undocumented final parameter `getFormState()` that is
used to select the mount point of the `redux-form` reducer from the root Redux reducer (it
defaults to `state => state.form`, assuming that you have mounted the `redux-form` reducer under
`form`.

```js
import {
  getFormValues,
  getFormInitialValues,
  getFormSyncErrors,
  getFormMeta,
  getFormAsyncErrors,
  getFormSyncWarnings,
  getFormSubmitErrors,
  getFormError,
  getFormNames,
  isDirty,
  isPristine,
  isValid,
  isInvalid,
  isSubmitting,
  hasSubmitSucceeded,
  hasSubmitFailed
} from 'redux-form'

MyComponent = connect(state => ({
  values: getFormValues('myForm')(state),
  initialValues: getFormInitialValues('myForm')(state),
  formSyncErrors: getFormSyncErrors('myForm')(state),
  fields: getFormMeta('myForm')(state),
  formAsyncErrors: getFormAsyncErrors('myForm')(state),
  syncWarnings: getFormSyncWarnings('myForm')(state),
  submitErrors: getFormSubmitErrors('myForm')(state),
  formError: getFormError()(state),
  names: getFormNames()(state),
  dirty: isDirty('myForm')(state),
  pristine: isPristine('myForm')(state),
  valid: isValid('myForm')(state),
  invalid: isInvalid('myForm')(state),
  submitting: isSubmitting('myForm')(state),
  submitSucceeded: hasSubmitSucceeded('myForm')(state),
  submitFailed: hasSubmitFailed('myForm')(state)
}))(MyComponent)
```

## List of Selectors

### `getFormValues(formName:String)` returns `(state) => formValues:Object`

> Gets the form values. Shocking, right?

### `getFormInitialValues(formName:String)` returns `(state) => formInitialValues:Object`

> Gets the form's initial values.

### `getFormError(formName:String)` returns `(state) => formError:any`

> Returns the form-wide error, the one set with the special `_error` property.

### `getFormSyncErrors(formName:String)` returns `(state) => formSyncErrors:Object`

> Returns the form synchronous validation errors.

### `getFormMeta(formName:String)` returns `(state) => formMeta:Object`

> Returns the form's fields meta data, namely `touched` and `visited`.

### `getFormAsyncErrors(formName:String)` returns `(state) => formAsyncErrors:Object`

> Returns the form asynchronous validation errors.

### `getFormSyncWarnings(formName:String)` returns `(state) => formSyncWarnings:Object`

> Returns the form synchronous warnings.

### `getFormSubmitErrors(formName:String)` returns `(state) => formSubmitErrors:Object`

> Returns the form submit validation errors.

### `getFormNames()` returns `(state) => formNames:Array`

> Gets the names of all the forms currently managed by Redux-Form.

> The reason that this is a function that returns a function is twofold:

> 1.  symmetry with the other selectors
> 2.  to allow for the `getFormState` parameter described at the top of this page.

> If you are using ImmutableJS, it will return a `List`.

### `isDirty(formName:String)` returns `(state, ...fields:String[]) => dirty:boolean`

> Returns `true` if the form is dirty, i.e. the values have been altered from the original
> `initialValues` provided. The opposite of `isPristine`.

### `isPristine(formName:String)` returns `(state, ...fields:String[]) => pristine:boolean`

> Returns `true` if the form is pristine, i.e. the values have NOT been altered from the original
> `initialValues` provided. The opposite of `isDirty`.

### `isValid(formName:String)` returns `(state) => valid:boolean`

> Returns `true` if the form is valid, i.e. has no sync, async, or submission errors. The opposite
> of `isInvalid`.

### `isInvalid(formName:String)` returns `(state) => invalid:boolean`

> Returns `true` if the form is invalid, i.e. has sync, async, or submission errors. The opposite
> of `isValid`.

### `isSubmitting(formName:String)` returns `(state) => submitting:boolean`

> Returns `true` if the form is submitting.

### `hasSubmitSucceeded(formName:String)` returns `(state) => submitSucceeded:boolean`

> Returns `true` if the form has previously been successfully submitted.

### `hasSubmitFailed(formName:String)` returns `(state) => submitFailed:boolean`

> Returns `true` if the form has previously failed to submit.
