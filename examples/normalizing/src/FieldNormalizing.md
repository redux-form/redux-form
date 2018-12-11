# Field Normalizing Example

When you need to put some control between what the user enters and the value that gets stored in
Redux, you can use a "normalizer". A normalizer is just a function that gets run every time a
value is changed that can transform the value before storing.

One common use case is when you need a value to be in a certain format, like a phone number or a
credit card.

Normalizers are passed five parameters:

- `value` - The value of the field on which you have placed the normalizer
- `previousValue` - The value of the field on which you have placed the normalizer before the
  most recent change
- `allValues` - All the values in the form, with the current field value set
- `previousAllValues` - All the values in the form before the current field is changed
- `name` - The name of the field being normalized

This allows you to do things like restrict one field value based on the value of another field,
like the `min` and `max` fields in the example below. Notice that you cannot set `min` to be
greater than `max`, and you cannot set `max` to be less than `min`.

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:normalizing` or manually run the
following commands:

```
cd ./examples/normalizing
npm install
npm start
```

Then open [`localhost:3030`](http://localhost:3030) in your
browser to view the example running locally on your machine.
