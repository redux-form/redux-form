# Synchronous Validation Example

To provide synchronous client-side validation, you will need to provide redux-form with a 
validation function that takes an object of form values and returns an object of errors.

The way you provide your synchronous validation function is via the reducer.

```js
import { reducer as formReducer } from 'redux-form'

const reducerWithValidation = reducer.validation({
  formName: (values) => {
    // do validation
    return {} // {} means that validation passed
  }
})
```

The example validation function is purely for simplistic demonstration value. In your 
application, you will want to build some type of reusable system of validators.

**IMPORTANT**: Synchronous validation happens on every change to your form data, so, if your field 
value is invalid, your field.error value will always be present. You will probably only want to
show validation errors once your field has been touched, a flag that is set for you by `redux-form`
when the onBlur event occurs on your field. When you submit the form, all the fields are marked as
touched, allowing any of their validation errors to show.

