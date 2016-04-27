# `reduxForm(config:Object, mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)`

Creates a decorator with which you use `redux-form` to connect your form component to Redux. It takes a `config`
parameter and then optionally `mapStateToProps`, `mapDispatchToProps`, `mergeProps` and `options` parameters which
[correspond exactly to the parameters taken by `react-redux`'s `connect()`
function](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options),
allowing you to connect your form component to other state in Redux.

The keys in the `config` parameter are as follows.

```javascript
var reduxForm = require('redux-form').reduxForm;  // ES5
```
```javascript
import {reduxForm} from 'redux-form';  // ES6
```

## Config Properties

**IMPORTANT: All of these configuration options may be passed into `reduxForm()` at "design time" or passed in as
props to your component at runtime.**

### Required

#### `fields : Array<String>` [required]

> a list of all your fields in your form. You may change these dynamically at runtime.

#### `form : String` [required]

> the name of your form and the key to where your form's state will be mounted under the `redux-form` reducer

### Optional

#### -`alwaysAsyncValidate : boolean` [optional]

> By default, async blur validation is only triggered if synchronous validation passes, and the form is dirty or was
never initialized (or if submitting). Sometimes it may be desirable to trigger asynchronous validation even in these
cases, for example if all validation is performed asynchronously and you want to display validation messages if a
user does not change a field, but does touch and blur it. Setting alwaysAsyncValidate to `true` will always run
asynchronous validation on blur, even if the form is pristine or sync validation fails.


#### -`asyncBlurFields : Array<String>` [optional]

> field names for which `onBlur` should trigger a call to the `asyncValidate` function. Defaults to `[]`.

> See [Asynchronous Blur Validation Example](../../examples/asynchronous-blur-validation) for more
details.

#### `asyncValidate : (values:Object, dispatch:Function, props:Object) => Promise<undefined, errors:Object>` [optional]

> a function that takes all the form values, the `dispatch` function, and the `props` given to your component, and
returns a Promise that will resolve if the validation is passed, or will reject with an object of validation errors
in the form `{ field1: <String>, field2: <String> }`.

> See [Asynchronous Blur Validation Example](../../examples/asynchronous-blur-validation) for more
details.

#### `destroyOnUnmount : boolean` [optional]

> Whether or not to automatically destroy your form's state in the Redux store when your component is unmounted.
Defaults to `true`.

#### `formKey : String` [optional]

> The key for your sub-form.

> See [Multirecord Example](../../examples/multirecord) for more details.

#### `getFormState : Function` [optional]

> A function that takes the entire Redux state and the `reduxMountPoint` (which defaults to `"form"`). It defaults to:
`(state, reduxMountPoint) => state[reduxMountPoint]`. The only reason you should provide this is if you are keeping
your Redux state as something other than plain javascript objects, e.g. an
[`Immutable.Map`](https://github.com/facebook/immutable-js).

#### `initialValues : Object<String, String>` [optional]

> The values with which to initialize your form in `componentWillMount()`. Particularly useful when
[Editing Multiple Records](../../examples/multirecord), but can also be used with single-record
forms. The values
should be in the form `{ field1: 'value1', field2: 'value2' }`.

#### `onSubmit : Function` [optional]

> The function to call with the form data when the `handleSubmit()` is fired from within the form component. If you
do not specify it as a prop here, you must pass it as a parameter to `handleSubmit()` inside your form component.

> If your `onSubmit` function returns a promise, the `submitting` property will be set to
`true` until the promise has been resolved or rejected. If it is rejected with an object matching
`{ field1: 'error', field2: 'error' }` then the submission errors will be added to each field (to the
`error` prop) just like async validation errors are. If there is an error that is not specific
to any field, but applicable to the entire form, you may pass that as if it were the error for a field
called `_error`, and it will be given as the `error` prop.

#### `propNamespace : string` [optional]

> If specified, all the props normally passed into your decorated component directly will be passed under the key
specified. Useful if using other decorator libraries on the same component to avoid prop namespace collisions.

#### `readonly : boolean` [optional]

> if `true`, the decorated component will not be passed any of the `onX` functions as props that will allow
it to mutate the state. Useful for decorating another component that is not your form, but that needs to know
about the state of your form.

#### `reduxMountPoint : String` [optional]

> The use of this property is highly discouraged, but if you absolutely need to mount your `redux-form` reducer at
somewhere other than `form` in your Redux state, you will need to specify the key you mounted it under with this
property. Defaults to `'form'`.

> See [Alternate Mount Point Example](../../examples/alternate-mount-point) for more details.

#### `returnRejectedSubmitPromise : boolean` [optional]

> If set to `true`, a failed submit will return a rejected promise. Defaults to `false`. Only use this if you need to
detect submit failures and run some code when a submit fails.

#### `touchOnBlur : boolean` [optional]

> marks fields as `touched` when the blur action is fired. Defaults to `true`.

#### `touchOnChange : boolean` [optional]

> marks fields as `touched` when the change action is fired. Defaults to `false`.

#### `validate : (values:Object, props:Object) => errors:Object` [optional]

> a synchronous validation function that takes the form values and props passed into your component.
If validation passes, it should return `{}`. If validation fails, it should return the validation errors in the
form `{ field1: <String>, field2: <String> }`. Defaults to `(values, props) => ({})`.

> See [Synchronous Validation Example](../../examples/synchronous-validation) for more details.
