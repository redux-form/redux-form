# `props`

[`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/reduxForm.js#L347)

> The `props` listed on this page are the `props` that `redux-form` generates to
> give to your decorated form component. The `props` that _you pass into your
> wrapped component_ are listed
> [here](https://redux-form.com/7.2.3/docs/api/ReduxForm.md/).

> If you are a strict `PropTypes` completionist, `redux-form` exports all of
> these
> [`propTypes`](https://github.com/erikras/redux-form/blob/master/src/propTypes.js),
> so you may import them, like so:

```javascript
import { reduxForm, propTypes } from 'redux-form'

class SimpleForm extends Component {
  static propTypes = {
    ...propTypes
    // other props you might be using
  }
  // ...
}
```

### `anyTouched : boolean`

> `true` if any of the fields have been marked as `touched`, `false` otherwise.

### `array : Object`

> A set of pre-bound action creators for you to operate on array fields in your
> form.

> #### `array.insert(field:String, index:Number, value:Any) : Function`

> Inserts a value into the given array field in your form. This is a bound
> action creator, so it returns nothing.

> #### `array.move(field:String, from:Number, to:Number) : Function`

> Moves a value at the given `from` index to the given `to` index in the given
> array field in your form. This is a bound action creator, so it returns
> nothing.

> #### `array.pop(field:String) : Function`

> Pops a value off of the end of a given array field in your form. This is a
> bound action creator, so it returns nothing.

> #### `array.push(field:String, value:Any) : Function`

> Pushes the given value onto the end of the given array field in your form.
> This is a bound action creator, so it returns nothing.

> #### `array.remove(field:String, index:Number) : Function`

> Removes a value at the given index from the given array field in your form.
> This is a bound action creator, so it returns nothing.

> #### `array.removeAll(field:String) : Function`

> Removes all the values from the given array field in your form. This is a
> bound action creator, so it returns nothing.

> #### `array.shift(field:String) : Function`

> Shifts a value out of the beginning of the given array in your form. This is a
> bound action creator, so it returns nothing.

> #### `array.splice(field:String, index:Number, removeNum:Number, value:Any) : Function`

> Performs an
> [`Array.splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
> operation on the given array in your form. This is a bound action creator, so
> it returns nothing.

> #### `array.swap(field:String, indexA:Number, indexB:Number) : Function`

> Swaps two values at the given indexes of the given array field in your form.
> This is a bound action creator, so it returns nothing.

> #### `array.unshift(field:String, value:Any) : Function`

> Unshifts the given value into the beginning of the given array field in your
> form. This is a bound action creator, so it returns nothing.

### `asyncValidate : Function`

> A function that may be called to initiate asynchronous validation if
> asynchronous validation is enabled.

### `asyncValidating : String | boolean`

> This value will be either:
>
> * `false` - No asynchronous validation is currently happening
> * `true` - Asynchronous validation is currently running in preparation to
>   submit a form
> * a `string` - The name of the field that just blurred to trigger asynchronous
>   validation

### `autofill(field:String, value:any) : Function`

> Sets the value and marks the field as `autofilled` in the Redux Store. This is
> useful when a field needs to be set programmatically, but in a way that lets
> the user know (via a styling change using the `autofilled` prop in `Field`)
> that it has been autofilled for them programmatically. This is a bound action
> creator, so it returns nothing.

### `blur(field:String, value:any) : Function`

> Marks a field as blurred in the Redux store. This is a bound action creator,
> so it returns nothing.

### `change(field:String, value:any) : Function`

> Changes the value of a field in the Redux store. This is a bound action
> creator, so it returns nothing.

### `clearAsyncError(field:String) : Function`

> Clear async error of a field in the Redux store. This is a bound action
> creator, so it returns nothing.

### `destroy() : Function`

> Destroys the form state in the Redux store. By default, this will be called
> for you in `componentWillUnmount()`. This is a bound action creator, so it
> returns nothing.

### `dirty : boolean`

> `true` if the form data has changed from its initialized values. Opposite of
> `pristine`.

### `error : any`

> A generic error for the entire form given by the `_error` key in the result
> from the synchronous validation function, the asynchronous validation, or the
> rejected promise from `onSubmit`.

### `form : String`

> The form name that you gave to the `reduxForm()` decorator or the prop you
> passed in to your decorated form component.

#### `handleSubmit(eventOrSubmit) : Function`

> A function meant to be passed to `<form onSubmit={handleSubmit}>` or to
> `<button onClick={handleSubmit}>`. It will run validation, both sync and
> async, and, if the form is valid, it will call `this.props.onSubmit(data)`
> with the contents of the form data.

> Optionally, you may also pass your `onSubmit` function to `handleSubmit` which
> will take the place of the `onSubmit` prop. For example: `<form onSubmit={handleSubmit(this.save.bind(this))}>`

> If your `onSubmit` function returns a promise, the `submitting` property will
> be set to `true` until the promise has been resolved or rejected. If it is
> rejected with an object like `new SubmissionError({ field1: 'error', field2: 'error' })` then the submission errors will be added to each field (to the
> `error` prop) just like async validation errors are. If there is an error that
> is not specific to any field, but applicable to the entire form, you may pass
> that as if it were the error for a field called `_error`, and it will be given
> as the `error` prop.

> To recap, there are two ways to use `handleSubmit`:

> **1. pass it a function to call**

```javascript
;<button
  onClick={handleSubmit(data => {
    // do something with data. validation will have been called at this point,
    // so you know the data is valid
  })}
>
  Submit
</button>
```

> **2. pass in such a function as the onSubmit prop to your decorated
> component**

```javascript
;<MyDecoratedForm
  onSubmit={data => {
    // do something with data. validation will have been called at this point,
    // so you know the data is valid
  }}
/>
```

#### `initialize(data:Object) : Function`

> Initializes the form data to the given values. All `dirty` and `pristine`
> state will be determined by comparing the current data with these initialized
> values. This is a bound action creator, so it returns nothing.

### `initialized : boolean`

> `true` the form has been initialized with initial values, `false` otherwise.

#### `initialValues : Object`

> The same initialValues object passed to `reduxForm` to initialize the form
> data.

#### `invalid : boolean`

> `true` if the form has validation errors. Opposite of `valid`.

#### `pristine: boolean`

> `true` if the form data is the same as its initialized values. Opposite of
> `dirty`.

#### `reset() : Function`

> Resets all the values in the form to the initialized state, making it pristine
> again. This is a bound action creator, so it returns nothing.

#### `submitFailed : boolean`

> Starts as `false`. If `onSubmit` is called, and fails to submit _for any
> reason_, `submitFailed` will be set to `true`. A subsequent successful submit
> will set it back to `false`.

#### `submitSucceeded : boolean`

> Starts as `false`. If `onSubmit` is called, and succeed to submit ,
> `submitSucceeded` will be set to `true`. A subsequent unsuccessful submit will
> set it back to `false`.

#### `submitting : boolean`

> Whether or not your form is currently submitting. This prop will only work if
> you have passed an `onSubmit` function that returns a promise. It will be
> `true` until the promise is resolved or rejected.

#### `touch(...field:string) : Function`

> Marks the given fields as "touched" to show errors. This is a bound action
> creator, so it returns nothing.

#### `untouch(...field:string) : Function`

> Clears the "touched" flag for the given fields This is a bound action creator,
> so it returns nothing.

#### `valid : boolean`

> `true` if the form passes validation (has no validation errors). Opposite of
> `invalid`.

#### `warning : any`

> A generic warning for the entire form given by the `_warning` key in the
> result from the synchronous warning function.
