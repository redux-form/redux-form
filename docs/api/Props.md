# `props`

> The `props` listed on this page are the `props` that `redux-form` generates to give
to your decorated form component. The `props` that _you pass into your wrapped component_ are listed
[here](#/api/reduxForm).

> If you are a strict `PropTypes` completionist, `redux-form` exports all of these
[`propTypes`](https://github.com/erikras/redux-form/blob/master/src/propTypes.js), 
so you may import them, like so:

```javascript
import {reduxForm, propTypes} from 'redux-form';

class SimpleForm extends Component {
  static propTypes = {
    ...propTypes,
    // other props you might be using
  }
  // ...
}
```

### `active : String`

> The name of the currently active (with focus) field.

### `asyncValidate : Function`

> A function that may be called to initiate asynchronous validation if asynchronous validation is enabled.

### `asyncValidating : String | boolean`

> This value will be either: 
> * `false` - No asynchronous validation is currently happening
> * `true` - Asynchronous validation is currently running in preparation to submit a form
> * a `string` - The name of the field that just blurred to trigger asynchronous validation

### `destroyForm() : Function`

> Destroys the form state in the Redux store. By default, this will be called for you in
`componentWillUnmount()`.

### `dirty : boolean`

> `true` if the form data has changed from its initialized values. Opposite of `pristine`.

### `error : String`

> A generic error for the entire form given by the `_error` key in the result from the synchronous validation function,
the asynchronous validation, or the rejected promise from `onSubmit`.

### `fields : Object`

> The form data, in the form `{ field1: <Object>, field2: <Object> }`. The field objects are meant to be 
destructured into your input component as props, e.g. `<input type="text" {...field.name}/>`. Each field `Object` 
has the following properties:

> #### `active : boolean`

> > `true` if this field currently has focus. It will only work if you are passing `onFocus` to your input element.

> #### `autofill : Function`

> > Provided for convenience in dispatching an autofill action to modify the field value and set the `autofilled` flag to `true`.

> #### `autofilled : boolean` [optional]

> > `true` if the field value was set programmatically by an autofill action. Not present initially or after the field is updated by `onChange`. Applications may wish to check that `pristine || autofilled` is true before autofilling to avoid overwriting user-provided values.

> #### `checked : boolean` [optional]

> > An alias for `value` _only when `value` is a boolean_. Provided for convenience of destructuring the whole field
object into the props of a form element.

> #### `dirty : boolean`

> > `true` if the field value has changed from its initialized value. Opposite of `pristine`.

> #### `error : String` [optional]

> > The error for this field if its value is not passing validation. Both synchronous and asynchronous validation 
errors will be reported here.

> #### `initialValue : any`

> > The value for this field as supplied in `initialValues` to the form.

> #### `invalid : boolean`

> > `true` if the field value fails validation (has a validation error). Opposite of `valid`.

> #### `name : String`

> > The name of the field. It will be the same as the key in the `fields` Object, but useful if bundling up a field to 
send down to a specialized input component.

> #### `onBlur(eventOrValue) : Function`

> > A function to call when the form field loses focus. It expects to _either_ receive the 
[React SyntheticEvent](http://facebook.github.io/react/docs/events.html) _or_ the current value of the field.

> #### `onChange(eventOrValue) : Function`

> > A function to call when the form field is changed. It expects to _either_ receive the 
[React SyntheticEvent](http://facebook.github.io/react/docs/events.html) _or_ the new value of the field.

> #### `onDragStart() : Function`

> > A function to call when the form field receives a 'dragStart' event. Saves the field value in the event for 
giving the field it is dropped into.

> #### `onDrop() : Function`

> > A function to call when the form field receives a `drop` event.

> #### `onFocus() : Function`

> > A function to call when the form field receives focus.

> #### `onUpdate : Function`

> > An alias for `onChange`. Provided for convenience of destructuring the whole field object into the props of a 
form element. Added to provide out-of-the-box support for [Belle](http://nikgraf.github.io/belle/) components' 
[`onUpdate` API](https://github.com/nikgraf/belle/issues/58).

> #### `pristine : boolean`

> > `true` if the field value is the same as its initialized value. Opposite of `dirty`.

> #### `touched : boolean`

> > `true` if the field has been touched. By default this will be set when the field is blurred.

> #### `valid : boolean`

> > `true` if the field value passes validation (has no validation errors). Opposite of `invalid`.

> #### `value: boolean|String`

> > The value of this form field. It will be a boolean for checkboxes, and a string for all other input types.

> #### `visited: boolean`

> > `true` if this field has ever had focus. It will only work if you are passing `onFocus` to your input element.

#### `handleSubmit(eventOrSubmit) : Function`

> A function meant to be passed to `<form onSubmit={handleSubmit}>` or to `<button onClick={handleSubmit}>`.
It will run validation, both sync and async, and, if the form is valid, it will call `this.props.onSubmit(data)`
with the contents of the form data.

> Optionally, you may also pass your `onSubmit` function to `handleSubmit` which will take the place of the 
`onSubmit` prop. For example: `<form onSubmit={handleSubmit(this.save.bind(this))}>`

> If your `onSubmit` function returns a promise, the `submitting` property will be set to
`true` until the promise has been resolved or rejected. If it is rejected with an object matching
`{ field1: 'error', field2: 'error' }` then the submission errors will be added to each field (to the
`error` prop) just like async validation errors are. If there is an error that is not specific 
to any field, but applicable to the entire form, you may pass that as if it were the error for a field
called `_error`, and it will be given as the `error` prop.

> To recap, there are two ways to use `handleSubmit`:

> **1. pass it a function to call**
```javascript
<button onClick={handleSubmit(data => {
  // do something with data. validation will have been called at this point,
  // so you know the data is valid
})}>Submit</button>
```
> **2. pass in such a function as the onSubmit prop to your decorated component**
```javascript
<MyDecoratedForm onSubmit={data => {
  // do something with data. validation will have been called at this point,
  // so you know the data is valid
}}/>
```

> With [the ability to `mapDispatchToProps` using `reduxForm()`](#/api/reduxForm), you could use Option #2 and 
bind your submission action creator directly to `onSubmit` with `mapDispatchToProps`. For example:
```javascript
export default reduxForm({
  form: signup,
  fields: ['email', 'password']
},
undefined, // or mapping some state to props
{
  onSubmit: signup  // action creator to run submit form mapped to onSubmit
})(SignupForm);
```
> and then, in your component:
```javascript
<form onSubmit={this.props.handleSubmit}/>
```

#### `initializeForm(data:Object) : Function`

> Initializes the form data to the given values. All `dirty` and `pristine` state will be determined by
comparing the current data with these initialized values.

#### `invalid : boolean`

> `true` if the form has validation errors. Opposite of `valid`.

#### `pristine: boolean`

> `true` if the form data is the same as its initialized values. Opposite of `dirty`.

#### `resetForm() : Function`

> Resets all the values in the form to the initialized state, making it pristine again.

#### `formKey : String`

> The same `formKey` prop that was passed in. See [Editing Multiple Records](#editing-multiple-records).

#### `submitting : boolean`

> Whether or not your form is currently submitting. This prop will only work if you have passed an
`onSubmit` function that returns a promise. It will be `true` until the promise is resolved or rejected.

#### `submitFailed : boolean`

> Starts as `false`. If `onSubmit` is called, and fails to submit _for any reason_, `submitFailed` will be set to 
`true`. A subsequent successful submit will set it back to `false`.

#### `touch(...field:string) : Function`

> Marks the given fields as "touched" to show errors.

#### `touchAll() : Function`

> Marks all fields as "touched" to show errors. This will automatically happen on form submission.

#### `untouch(...field:string) : Function`

> Clears the "touched" flag for the given fields

#### `untouchAll() : Function`

> Clears the "touched" flag for the all fields

#### `valid : boolean`

> `true` if the form passes validation (has no validation errors). Opposite of `invalid`.

#### `values : Object`

> All of your values in the form `{ field1: <string>, field2: <string> }`.

