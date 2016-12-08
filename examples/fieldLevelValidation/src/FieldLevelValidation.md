# Field-Level Validation Example

As well as allowing you to provide a validation function to validate all the values in your form
at once, see [Synchronous Validation Example](http://redux-form.com/6.2.1/examples/syncValidation/),
you may also provide individual value validation functions for each `Field` or `FieldArray`.

The parameters to the validation function are:

* `value` - The current value of the field
* `allValues` - The values of the entire form

If the `value` is valid, the validation function should return `undefined`.

If the `value` is invalid, the validation function should return an error. This is usually a
string, but it does not have to be.

---

Obviously, you will want to define your validation functions just once for your application and
reuse them as needed across your forms.

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:fieldLevelValidation` or manually run the
following commands:
```
cd ./examples/fieldLevelValidation
npm install
npm start
```

