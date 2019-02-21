# Synchronous Validation Example

There are two ways to provide synchronous client-side validation to your form.

The first is to provide redux-form with a validation function that takes an
object of form values and returns an object of errors. This is done by providing
the validation function to the decorator as a config parameter, or to the
decorated form component as a prop.

The second is to use individual validators for each field. See
[Field-Level Validation Example](http://redux-form.com/8.1.0/examples/fieldLevelValidation/).

Additionally, you can provide redux-form with a warn function with the same type
signature as your validation function. Warnings are errors that do not mark a
form as invalid, allowing for two tiers of severity for errors.

The example validation function is purely for simplistic demonstration value. In
your application, you will want to build some type of reusable system of
validators.

Notice the reused stateless function component used to render each field. It is
important that it is not defined inline (in the `render()` function), because
it will create a new instance on every render and trigger a rerender for the field,
because the `component` prop will have changed.

**IMPORTANT**: If the validation function returns errors and the form does not
currently render fields for all of the errors, then the form will be considered
valid and will be submitted.

**IMPORTANT**: Synchronous validation happens on every change to your form data,
so, if your field value is invalid, your field.error value will always be
present. You will probably only want to show validation errors once your field
has been touched, a flag that is set for you by `redux-form` when the onBlur
event occurs on your field. When you submit the form, all the fields are marked
as touched, allowing any of their validation errors to show.

**IMPORTANT**: In your validate function, values can be `undefined`, so pay attention when you are validating nested fields. If not, you could encounter some `TypeError: undefined is not an object`.

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:syncValidation` or manually run the following
commands:

```
cd ./examples/syncValidation
npm install
npm start
```
