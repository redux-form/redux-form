# Synchronous Validation Example

To provide synchronous client-side validation, you will need to provide redux-form with a 
validation function that takes an object of form values and returns an object of errors.
This is done by providing the validation function to the decorator as a config parameter, or
to the decorated form component as a prop.

The example validation function is purely for simplistic demonstration value. In your 
application, you will want to build some type of reusable system of validators.

**IMPORTANT**: Synchronous validation happens on every change to your form data, so, if your field 
value is invalid, your field.error value will always be present. You will probably only want to
show validation errors once your field has been touched, a flag that is set for you by `redux-form`
when the onBlur event occurs on your field. When you submit the form, all the fields are marked as
touched, allowing any of their validation errors to show.

