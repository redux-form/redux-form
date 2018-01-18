# `reduxForm(config:Object)`

[`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/reduxForm.js)

Creates a decorator with which you use `redux-form` to connect your form
component to Redux. It takes a `config` parameter which lets you configure your
form.

## Importing

```javascript
var reduxForm = require('redux-form').reduxForm // ES5
```

```javascript
import { reduxForm } from 'redux-form' // ES6
```

## Config Properties

**IMPORTANT: All of these configuration options may be passed into `reduxForm()`
at "design time" or passed in as props to your component at runtime.**

### Required

#### `form : String` [required]

> the name of your form and the key to where your form's state will be mounted
> under the `redux-form` reducer

### Optional

#### -`asyncBlurFields : Array<String>` [optional]

> field names for which `onBlur` should trigger a call to the `asyncValidate`
> function. Defaults to triggering the async validation when any field is
> blurred. If you wish to disable the blur validation, but still provide an
> `asyncValidate` function, you may pass `[]` to this property, resulting in the
> async validation only being run before submission.

> See
> [Asynchronous Blur Validation Example](https://redux-form.com/7.2.1/examples/asyncValidation/)
> for more details.

#### `asyncValidate : (values:Object, dispatch:Function, props:Object, blurredField:String) => Promise<undefined, errors:Object>` [optional]

> a function that takes all the form values, the `dispatch` function, the
> `props` given to your component and the current blurred field, and returns a
> Promise that will resolve if the validation is passed, or will reject with an
> object of validation errors in the form `{ field1: <String>, field2: <String> }`.

> See
> [Asynchronous Blur Validation Example](https://redux-form.com/7.2.1/examples/asyncValidation/)
> for more details.

#### `destroyOnUnmount : boolean` [optional]

> Whether or not to automatically destroy your form's state in the Redux store
> when your component is unmounted. Defaults to `true`.

#### `enableReinitialize : boolean` [optional]

> When set to `true`, the form will reinitialize every time the `initialValues`
> prop changes. Defaults to `false`. If the `keepDirtyOnReinitialize` option is
> also set, the form will retain the value of dirty fields when reinitializing.

#### `forceUnregisterOnUnmount : boolean` [optional]

> Whether or not to force unregistration of fields -- use in conjunction with
> `destroyOnUnmount`. Useful for wizard-type forms where you want to destroy
> fields as they unmount, but not the form's state. Defaults to `false`, as
> forms are normally unregistered on unmount.

#### `getFormState : Function` [optional]

> A function that takes the entire Redux state and returns the state slice which
> corresponds to where the `redux-form` reducer was mounted. This functionality
> is rarely needed, and defaults to assuming that the reducer is mounted under
> the `form` key.

#### `immutableProps : Array<String>` [optional]

> Prop names that only require strict-equals, not deep equals, to determine
> `shouldComponentUpdate`. Useful for performance and compatibility with 3rd
> party immutable libraries. Defaults to `[]`.

#### `initialValues : Object<String, String>` [optional]

> The values with which to initialize your form in `componentWillMount()`. The
> values should be in the form `{ field1: 'value1', field2: 'value2' }`.

#### `keepDirtyOnReinitialize : boolean` [optional]

> When set to `true` and `enableReinitialize` is also set, the form will retain
> the value of dirty fields and update every registered field which is still
> pristine when reinitializing. When this option is not set (the default),
> reinitializing the form replaces all field values. This option is useful in
> situations where the form has live updates or continues to be editable after
> form submission; it prevents reinitialization from overwriting user changes.
> Defaults to `false`.

#### `updateUnregisteredFields : boolean` [optional]

> Used in combination with `keepDirty(OnReinitialize)`. Will update every
> initialValue which is still pristine. Normally only registered Fields will be
> updated. In most cases, this option should be set to `true` to work as
> expected and avoid edge cases. It defaults to `false` because of non-breaking
> backwards compatibility.

#### `onChange : Function` [optional]

> A callback function that will be called with all the form values any time any
> of the form values change.

> `onChange` will be called with the following parameters:

> ##### `values : Object`

> The changed field values in the form of `{ field1: 'value1', field2: 'value2' }`.

> ##### `dispatch : Function`

> The Redux `dispatch` function.

> ##### `props : Object`

> The props passed into your decorated component.

> ##### `previousValues : Object`

> The previous field values in the form of `{ field1: 'value1', field2: 'value2' }`.

#### `onSubmit : Function` [optional]

> The function to call with the form data when the `handleSubmit()` is fired
> from within the form component. If you do not specify it as a prop here, you
> must pass it as a parameter to `handleSubmit()` inside your form component.

> If your `onSubmit` function returns a promise, the `submitting` property will
> be set to `true` until the promise has been resolved or rejected. If it is
> rejected with a `redux-form` `SubmissionError` containing errors in the form
> `{ field1: 'error', field2: 'error' }` then the submission errors will be
> added to each field (to the `error` prop) just like async validation errors
> are. If there is an error that is not specific to any field, but applicable to
> the entire form, you may pass that as if it were the error for a field called
> `_error`, and it will be given as the `error` prop.

> `onSubmit` will be called with the following parameters:

> ##### `values : Object`

> The field values in the form of `{ field1: 'value1', field2: 'value2' }`.

> ##### `dispatch : Function`

> The Redux `dispatch` function.

> ##### `props : Object`

> The props passed into your decorated component.

#### `onSubmitFail : Function` [optional]

> A callback function that will be called when a submission fails for whatever
> reason. It will be called with the following parameters:

> ##### `errors : Object`

> The errors that caused the submission to fail.

> ##### `dispatch : Function`

> The Redux `dispatch` function.

##### `submitError : Error`

> The error object that caused the submission to fail. If `errors` is set this
> will be most likely a `SubmissionError`, otherwise it can be any error or
> null.

> ##### `props : Object`

> The props passed into your decorated component.

#### `onSubmitSuccess : Function` [optional]

> A callback function that will be called when a submission succeeds. It will be
> called with the following parameters:

> ##### `result : Object`

> Any result that `onSubmit` has returned

> ##### `dispatch : Function`

> The Redux `dispatch` function.

> ##### `props : Object`

> The props passed into your decorated component.

#### `propNamespace : String` [optional]

> If specified, all the props normally passed into your decorated component
> directly will be passed under the key specified. Useful if using other
> decorator libraries on the same component to avoid prop namespace collisions.

#### `pure : boolean` [optional]

> If true, implements `shouldComponentUpdate` and compares _only the
> Redux-connected props_ that are needed to manage the form state, preventing
> unnecessary updates, assuming that the component is a “pure” component and
> does not rely on any input or state other than its props and the selected
> Redux store’s state. Defaults to `true`.

> Similar to the `pure` parameter in
> [`react-redux`'s `connect()` API](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)

#### `shouldAsyncValidate(params) : boolean` [optional]

> An optional function you may provide to have full control over when async
> validation happens. Your `shouldAsyncValidate()` function will be given an
> object with the following values:

> ##### `asyncErrors : Object` [optional]

> Any existing asynchronous validation errors

> ##### `initialized : boolean` [required]

> `true` if the form has ever been initialized with initial values

> ##### `trigger : String` [required]

> The reason to possibly run async validation. It will either be: `'blur'` or
> `'submit'`, depending on whether an async blur field had triggered the async
> validation or if submitting the form has triggered it, respectively.

> ##### `blurredField : string` [optional]

> The name of the field that has triggered the async validation. May be
> `undefined`.

> ##### `pristine : boolean` [required]

> `true` if the form is pristine, `false` if it is dirty

> ##### `syncValidationPasses : boolean` [required]

> `true` if synchronous validation is passing, `false` if it is failing.

> The default behavior is:

```js
if (!syncValidationPasses) {
  return false
}
switch (trigger) {
  case 'blur':
    // blurring
    return true
  case 'submit':
    // submitting, so only async validate if form is dirty or was never initialized
    // conversely, DON'T async validate if the form is pristine just as it was
    // initialized
    return !pristine || !initialized
  default:
    return false
}
```

#### `shouldError(params) : boolean` [optional]

> An optional function you may provide to have full control over when sync
> validation happens. Your `shouldError()` function will be given an object with
> the following values:

> ##### `values : Object`

> The values in the form of `{ field1: 'value1', field2: 'value2' }`.

> ##### `nextProps : Object`

> The next props.

> ##### `props : Object`

> The current props.

> ##### `initialRender : boolean`

> `true` if the form is being initially rendered.

> ##### `structure : Object`

> The structure object being used internally for values. You may wish to use
> `deepEqual` from the structure.

#### ~~`shouldValidate(params) : boolean`~~ [optional] **DEPRECATED**

> ** DEPRECATED: Use `shouldError()` and `shouldWarn()`. Will be removed in
> v8.**

> An optional function you may provide to have full control over when sync
> validation happens. Your `shouldValidate()` function will be given an object
> with the following values:

> ##### `values : Object`

> The values in the form of `{ field1: 'value1', field2: 'value2' }`.

> ##### `nextProps : Object`

> The next props.

> ##### `props : Object`

> The current props.

> ##### `initialRender : boolean`

> `true` if the form is being initially rendered.

> ##### `structure : Object`

> The structure object being used internally for values. You may wish to use
> `deepEqual` from the structure.

#### `shouldWarn(params) : boolean` [optional]

> An optional function you may provide to have full control over when sync
> validation happens. Your `shouldWarn()` function will be given an object with
> the following values:

> ##### `values : Object`

> The values in the form of `{ field1: 'value1', field2: 'value2' }`.

> ##### `nextProps : Object`

> The next props.

> ##### `props : Object`

> The current props.

> ##### `initialRender : boolean`

> `true` if the form is being initially rendered.

> ##### `structure : Object`

> The structure object being used internally for values. You may wish to use
> `deepEqual` from the structure.

#### `touchOnBlur : boolean` [optional]

> marks fields as `touched` when the blur action is fired. Defaults to `true`.

#### `touchOnChange : boolean` [optional]

> marks fields as `touched` when the change action is fired. Defaults to
> `false`.

#### `persistentSubmitErrors : boolean` [optional]

> do not remove submit errors when the change action is fired. Defaults to
> `false`.

#### `validate : (values:Object, props:Object) => errors:Object` [optional]

> a synchronous validation function that takes the form values and props passed
> into your component. If validation passes, it should return `{}`. If
> validation fails, it should return the validation errors in the form `{ field1: <String>, field2: <String> }`. Defaults to `(values, props) => ({})`.

> See
> [Synchronous Validation Example](https://redux-form.com/7.2.1/examples/syncValidation/)
> for more details.

#### `warn : (values:Object, props:Object) => warnings:Object` [optional]

> a synchronous warning function that takes the form values and props passed
> into your component. Warnings work the same as validations, but do not mark a
> form as invalid. If the warning check passes, it should return `{}`. If the
> check fails, it should return the warnings in the form `{ field1: <String>, field2: <String> }`. Defaults to `(values, props) => ({})`.

## Instance API

The following are methods or properties that you can access on an instance of
your decorated form component.

#### `dirty : boolean`

`true` when the current form values are different from the `initialValues`,
`false` otherwise.

#### `fieldList : Array`

An array of strings representing all the fields in the form. Mainly useful for
testing.

#### `invalid : boolean`

`true` when the form is invalid (has validation errors), `false` otherwise.

#### `pristine : boolean`

`true` when the current form values are the same as the `initialValues`, `false`
otherwise.

#### `reset() : void`

Resets the form to the `initialValues`. It will be `pristine` after reset.

#### `submit() : Promise`

Submits the form. [You'd never have guessed that, right?] Returns a promise that
will be resolved when the form is submitted successfully, or rejected if the
submission fails.

#### `valid : boolean`

`true` when the form is valid (has no validation errors), `false` otherwise.

#### `values : Object`

The current values of all the fields in the form.

#### `wrappedInstance : ReactElement`

A reference to the instance of the component you decorated with `reduxForm()`.
Mainly useful for testing.
