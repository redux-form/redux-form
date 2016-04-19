# `props`

> The `props` listed on this page are are the `props` that `redux-form` generates to give
to your decorated form component. The `props` that _you pass into your wrapped component_ are
listed [here](#/api/reduxForm).

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

### `asyncValidate : Function`

> A function that may be called to initiate asynchronous validation if asynchronous validation is enabled.

### `asyncValidating : String | boolean`

> This value will be either: 
> * `false` - No asynchronous validation is currently happening
> * `true` - Asynchronous validation is currently running in preparation to submit a form
> * a `string` - The name of the field that just blurred to trigger asynchronous validation

### `destroy() : Function`

> Destroys the form state in the Redux store. By default, this will be called for you in
`componentWillUnmount()`.

### `dirty : boolean`

> `true` if the form data has changed from its initialized values. Opposite of `pristine`.

### `error : String`

> A generic error for the entire form given by the `_error` key in the result from the
synchronous validation function, the asynchronous validation, or the rejected promise from
`onSubmit`.

#### `handleSubmit(eventOrSubmit) : Function`

> A function meant to be passed to `<form onSubmit={handleSubmit}>` or to
`<button onClick={handleSubmit}>`. It will run validation, both sync and async, and, if the
form is valid, it will call `this.props.onSubmit(data)` with the contents of the form data.

> Optionally, you may also pass your `onSubmit` function to `handleSubmit` which will take
the place of the `onSubmit` prop. For example:
`<form onSubmit={handleSubmit(this.save.bind(this))}>`

> If your `onSubmit` function returns a promise, the `submitting` property will be set to
`true` until the promise has been resolved or rejected. If it is rejected with an object
matching `{ field1: 'error', field2: 'error' }` then the submission errors will be added
to each field (to the `error` prop) just like async validation errors are. If there is an
error that is not specific to any field, but applicable to the entire form, you may pass
that as if it were the error for a field called `_error`, and it will be given as the
`error` prop.

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

#### `initialize(data:Object) : Function`

> Initializes the form data to the given values. All `dirty` and `pristine` state will be
determined by comparing the current data with these initialized values.

#### `invalid : boolean`

> `true` if the form has validation errors. Opposite of `valid`.

#### `pristine: boolean`

> `true` if the form data is the same as its initialized values. Opposite of `dirty`.

#### `reset() : Function`

> Resets all the values in the form to the initialized state, making it pristine again.

#### `submitting : boolean`

> Whether or not your form is currently submitting. This prop will only work if you have passed an
`onSubmit` function that returns a promise. It will be `true` until the promise is resolved or rejected.

#### `submitFailed : boolean`

> Starts as `false`. If `onSubmit` is called, and fails to submit _for any reason_, `submitFailed` will be set to 
`true`. A subsequent successful submit will set it back to `false`.

#### `touch(...field:string) : Function`

> Marks the given fields as "touched" to show errors.

#### `untouch(...field:string) : Function`

> Clears the "touched" flag for the given fields

#### `valid : boolean`

> `true` if the form passes validation (has no validation errors). Opposite of `invalid`.
