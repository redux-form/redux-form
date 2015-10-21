To provide synchronous client-side validation, simply provide `redux-form` with a validation function that takes an 
object of form values and returns an object of errors.

The example validation function is purely for simplistic demonstration value. In your application, you will want to 
build some type of reusable system of validators. [Here is a simple
example](https://github .com/erikras/react-redux-universal-hot-example/blob/master/src/utils/validation.js).

**IMPORTANT:** Synchronous validation happens _on every render_, so, if your field value is invalid, your `field.error` 
value will always be present. You will probably only want to show validation errors once your field has been `touched`,
a flag that is set for you by `redux-form` when the `onBlur` event occurs on your field.
