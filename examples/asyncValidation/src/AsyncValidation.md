# Async Blur Validation Example

The recommended way to provide server-side validation is to use
[Submit Validation](../../submitValidation), but there may be instances when you want to run
server-side validation _while the form is being filled out_. The classic example of this
letting someone choose a value, like a username, that must be unique within your system.

To provide asynchronous validation, provide `redux-form` with an asynchronous validation
function (`asyncValidate`) that takes an object of form values, and the Redux `dispatch`
function, and returns a promise that either rejects with an object of errors or resolves.

You will also need to specify which fields should fire the asynchronous validation when
they are blurred with the `asyncBlurFields` config property.

## Important

1. Asynchronous validation _will_ be called before the `onSubmit` is fired, but if all
you care about is validation `onSubmit`, you should use
[Submit Validation](../../submitValidation).
2. Asynchronous validation will _not_ be called if synchronous validation is failing
_for the field just blurred_.

The errors are displayed in the exact same way as validation errors created by
[Synchronous Validation](../../syncValidation).

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:asyncValidation` or manually run the
following commands:
```
cd ./examples/asyncValidation
npm install
npm start
```

Then open [`localhost:3030`](http://localhost:3030) in your
browser to view the example running locally on your machine.

## How to use the form below:

* Usernames that will _fail_ validation: `john`, `paul`, `george` or `ringo`.

