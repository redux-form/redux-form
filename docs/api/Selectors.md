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
  isDirty,
  isPristine,
  isValid,
  isInvalid
} from 'redux-form'

MyComponent = connect(
  state => ({
    values: getFormValues('myForm')(state),
    dirty: isDirty('myForm')(state),
    pristine: isPristine('myForm')(state),
    valid: isValid('myForm')(state),
    invalid: isInvalid('myForm')(state)
  })
)(MyComponent)
```

## List of Selectors

### `getFormValues(formName:String)` returns `(state) => formValues:Object`

> Gets the form values. Shocking, right?

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
